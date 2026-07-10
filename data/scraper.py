"""
Scraper v2 for Tunisian legal codes from jurisitetunisie.com.
Handles multiple article formats: COC, CT, CS.
Recursively discovers all leaf .htm pages from menu structure.
"""
import json
import re
import time
import requests
from bs4 import BeautifulSoup, NavigableString, Tag
from pathlib import Path
from dataclasses import dataclass, field, asdict
from typing import Optional

BASE_URL = "https://www.jurisitetunisie.com/tunisie/codes"
OUTPUT_DIR = Path("/home/imari/IdeaProjects/Contraty/data/raw")
DELAY = 0.25
UA = "Contraty/1.0 (legal research)"


@dataclass
class Article:
    number: int
    text: str
    is_modified: bool = False
    references: list[str] = field(default_factory=list)


def fetch_page(url: str) -> str:
    resp = requests.get(url, timeout=30, headers={"User-Agent": UA})
    resp.raise_for_status()
    return resp.text


def extract_internal_refs(text: str) -> list[str]:
    refs = []
    for m in re.finditer(r'(?:articles?|article)\s+(\d+(?:\s*(?:et|,|\-)\s*\d+)*)', text, re.IGNORECASE):
        nums = re.findall(r'\d+', m.group(1))
        refs.extend(nums)
    return refs


# Multiple article heading patterns
ART_PATTERNS = [
    re.compile(r'Art(?:icle)?\.?\s*(\d+)\s*[\.\:\-]\s*(.+)', re.IGNORECASE),
    re.compile(r'Art(?:icle)?\.?\s*(\d+)\s*$', re.IGNORECASE),  # heading only, text follows
]


def parse_legal_page(html: str) -> list[Article]:
    """Parse a legal code page with multiple article format support."""
    soup = BeautifulSoup(html, "lxml")
    body = soup.find("body")
    if not body:
        return []

    raw: list[tuple[int, str, bool]] = []
    current_num = None
    current_text = []
    current_modified = False
    skip_until_br = False

    for element in body.descendants:
        if isinstance(element, Tag):
            if element.name == "del":
                skip_until_br = True
                continue
            if element.name == "br" and skip_until_br:
                skip_until_br = False
                continue

        if isinstance(element, NavigableString):
            text = element.strip()
            if not text:
                continue
            if skip_until_br:
                continue

            # Try to match article start
            matched = False
            for pat in ART_PATTERNS:
                match = pat.match(text)
                if match:
                    # Save previous article
                    if current_num is not None and current_text:
                        raw.append((current_num, " ".join(current_text), current_modified))

                    current_num = int(match.group(1))
                    rest = match.group(2) if match.lastindex and match.lastindex >= 2 else None

                    if rest and rest.strip() == "**":
                        current_modified = True
                        current_text = []
                    elif rest:
                        current_modified = False
                        current_text = [rest]
                    else:
                        # Text-only heading, collect from next nodes
                        current_modified = False
                        current_text = []
                    matched = True
                    break

            if matched:
                continue

            # Check for standalone ** marker
            if current_num is not None and text == "**":
                current_modified = True
                current_text = []
                continue

            # Stop at junk text
            if any(kw in text for kw in ["Copyright", "Jurisite", "Codes et lois", "Menu",
                                           "Sommaire", "Table Chronologique", "Loi de Promulgation"]):
                if current_num is not None and current_text:
                    raw.append((current_num, " ".join(current_text), current_modified))
                current_num = None
                current_text = []
                continue

            if current_num is not None:
                current_text.append(text)

    # Save last
    if current_num is not None and current_text:
        raw.append((current_num, " ".join(current_text), current_modified))

    # Deduplicate: prefer modified versions
    by_num: dict[int, Article] = {}
    for num, text, modified in raw:
        refs = extract_internal_refs(text)
        if num in by_num:
            if modified and not by_num[num].is_modified:
                by_num[num] = Article(num, text, True, refs)
            elif modified == by_num[num].is_modified:
                by_num[num] = Article(num, text, modified, refs)
        else:
            by_num[num] = Article(num, text, modified, refs)

    return sorted(by_num.values(), key=lambda a: a.number)


def discover_leaf_pages(code_dir: str, start_menu: str = "menu.html") -> dict[str, str]:
    """Recursively discover all leaf .htm/.html article pages from menu structure.
    Returns {label: relative_path} mapping.
    """
    seen = set()
    leaf_pages: dict[str, str] = {}
    queue = [start_menu]
    urls_fetched = 0

    while queue:
        page = queue.pop(0)
        if page in seen:
            continue
        seen.add(page)

        # Resolve URL: relative paths are relative to the page itself
        url = f"{BASE_URL}/{code_dir}/{page}"
        try:
            r = requests.get(url, timeout=15, headers={"User-Agent": UA})
            urls_fetched += 1
            if r.status_code != 200:
                continue

            soup = BeautifulSoup(r.text, 'lxml')
            for a in soup.find_all('a', href=True):
                href = a['href'].strip()
                text = a.get_text(strip=True)[:100]

                # Skip external, absolute, and anchor links
                if href.startswith(('#', 'http://', 'https://', 'javascript:', 'mailto:')):
                    continue
                if href.startswith('/') and 'jurisitetunisie' not in href:
                    # Absolute path on same domain - e.g. /textes/index.html
                    if '/codes/' not in href:
                        continue
                    # Convert to relative
                    href = href.split('/')[-1]

                # Skip parent dir references
                if href.startswith('..'):
                    continue

                # Only .htm and .html files
                if not (href.endswith('.htm') or href.endswith('.html')):
                    continue

                if href in seen:
                    continue

                if 'menu' in href.lower():
                    queue.append(href)
                else:
                    # Leaf article page - create a label from the text
                    label = text[:60].replace(' ', '_').replace('/', '_').lower()
                    if not label:
                        label = href.replace('.htm', '').replace('.html', '')
                    # Ensure unique
                    base = label
                    counter = 1
                    while label in leaf_pages:
                        label = f"{base}_{counter}"
                        counter += 1
                    leaf_pages[label] = f"{code_dir}/{href}"
        except Exception:
            continue

    print(f"  Discovered {len(leaf_pages)} article pages from {urls_fetched} menu pages")
    return leaf_pages


def scrape_all(code_dir: str, output_file: Path):
    """Discover all pages for a code and scrape them."""
    print(f"\nDiscovering {code_dir} pages...")
    pages = discover_leaf_pages(code_dir)

    all_articles: dict[str, list[dict]] = {}
    total = len(pages)

    for i, (label, path) in enumerate(pages.items(), 1):
        url = f"{BASE_URL}/{path}"
        try:
            print(f"  [{i:3d}/{total}] {label[:45]:45s} ", end="", flush=True)
            html = fetch_page(url)
            articles = parse_legal_page(html)
            all_articles[label] = [asdict(a) for a in articles]
            if articles:
                art_range = f" {articles[0].number}-{articles[-1].number}"
            else:
                art_range = " (no articles found)"
            print(f"{len(articles):3d} arts{art_range}")
        except Exception as e:
            print(f"ERROR: {e}")
            all_articles[label] = []
        time.sleep(DELAY)

    output_file.parent.mkdir(parents=True, exist_ok=True)
    output_file.write_text(json.dumps(all_articles, ensure_ascii=False, indent=2), encoding='utf-8')
    total_arts = sum(len(v) for v in all_articles.values())
    print(f"  → {total_arts} articles in {len(all_articles)} pages → {output_file}")


if __name__ == "__main__":
    for code_dir, out_name in [
        ("coc", "coc_articles.json"),
        ("ct", "ct_articles.json"),
        ("cs", "cs_articles.json"),
    ]:
        print(f"\n{'='*65}")
        print(f"  {code_dir.upper()} — {'Code des Obligations' if code_dir=='coc' else 'Code du Travail' if code_dir=='ct' else 'Code des Sociétés'}")
        print(f"{'='*65}")
        scrape_all(code_dir, OUTPUT_DIR / code_dir / out_name)

    print(f"\nDone. All data in {OUTPUT_DIR}")
