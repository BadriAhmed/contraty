#!/usr/bin/env python3
"""Fix template texts using Gemini reviews. Processes one template at a time.

Usage: python3 data/fix_template.py bail-habitation
"""

import json, sys, asyncio
from pathlib import Path
from google.genai import Client

TEMPLATES_DIR = Path("/home/imari/IdeaProjects/Contraty/data/templates")
REVIEWS_DIR = Path("/home/imari/IdeaProjects/Contraty/data/reviews")
API_KEY = "GEMINI_API_KEY_PLACEHOLDER"

async def fix(slug):
    # Load template
    t_path = TEMPLATES_DIR / f"{slug}.json"
    data = json.loads(t_path.read_text(encoding="utf-8"))

    # Load reviews
    review_ar = ""
    review_fr = ""
    r_ar = REVIEWS_DIR / f"{slug}.json"
    r_fr = REVIEWS_DIR / f"{slug}_fr.json"
    if r_ar.exists():
        review_ar = json.loads(r_ar.read_text()).get("review", "")
    if r_fr.exists():
        review_fr = json.loads(r_fr.read_text()).get("review", "")

    client = Client(api_key=API_KEY)

    # Fix AR
    if review_ar and "CLEAN" not in review_ar:
        ar_sections = ""
        for s in data["sections"]:
            ar_sections += f"\n[{s['title_ar']}]\n"
            for a in s.get("articles", []):
                ar_sections += f"  ID:{a['id']} | {a['text_ar']}\n"

        prompt_ar = f"""أنت محامٍ تونسي. أصلح النص العربي للعقد بناءً على المراجعة.

المراجعة (المشاكل المطلوب إصلاحها):
{review_ar[:3000]}

النص الأصلي (يجب إخراجه مصلحاً، حافظ على أرقام ID):
{ar_sections[:5000]}

أخرج النص المصلح بهذا التنسيق بالضبط (JSON فقط، لا تعليقات):
{{"sections":[
  {{"title_ar":"...", "articles":[{{"id":"art-xxx","text_ar":"النص المصلح"}}]}}
]}}"""

        resp = await client.aio.models.generate_content(model='gemini-flash-latest', contents=prompt_ar)
        corrected_ar = json.loads(_extract_json(resp.text))
        # Merge AR corrections
        for cs in corrected_ar.get("sections", []):
            for orig_s in data["sections"]:
                if orig_s["title_ar"] == cs["title_ar"]:
                    for ca in cs.get("articles", []):
                        for orig_a in orig_s["articles"]:
                            if orig_a["id"] == ca["id"]:
                                orig_a["text_ar"] = ca["text_ar"]

    # Fix FR
    if review_fr and "Pas de problème" not in review_fr and "pas de problème" not in review_fr.lower()[:300]:
        fr_sections = ""
        for s in data["sections"]:
            fr_sections += f"\n[{s['title_fr']}]\n"
            for a in s.get("articles", []):
                fr_sections += f"  ID:{a['id']} | {a['text_fr']}\n"

        prompt_fr = f"""Tu es un avocat tunisien. Corrige le texte français du contrat selon la revue ci-dessous.

REVUE (problèmes à corriger):
{review_fr[:3000]}

TEXTE ORIGINAL (garde les IDs):
{fr_sections[:5000]}

Sors le texte corrigé en JSON exact (pas de commentaires):
{{"sections":[
  {{"title_fr":"...", "articles":[{{"id":"art-xxx","text_fr":"texte corrigé"}}]}}
]}}"""

        resp = await client.aio.models.generate_content(model='gemini-flash-latest', contents=prompt_fr)
        corrected_fr = json.loads(_extract_json(resp.text))
        for cs in corrected_fr.get("sections", []):
            for orig_s in data["sections"]:
                if orig_s["title_fr"] == cs["title_fr"]:
                    for ca in cs.get("articles", []):
                        for orig_a in orig_s["articles"]:
                            if orig_a["id"] == ca["id"]:
                                orig_a["text_fr"] = ca["text_fr"]

    # Save
    t_path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    return slug

def _extract_json(text):
    text = text.strip()
    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end != -1:
        return text[start:end+1]
    return text

slug = sys.argv[1] if len(sys.argv) > 1 else "bail-habitation"
asyncio.run(fix(slug))
print(f"Fixed: {slug}")
