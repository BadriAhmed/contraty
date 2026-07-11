#!/usr/bin/env python3
"""Batch Arabic legal review — sends all 22 contract templates to Gemini Pro for legal/verbal correctness."""

import json
import asyncio
from pathlib import Path
from google.genai import Client

TEMPLATES_DIR = Path("/home/imari/IdeaProjects/Contraty/data/templates")
REVIEWS_DIR = Path("/home/imari/IdeaProjects/Contraty/data/reviews")
REVIEWS_DIR.mkdir(exist_ok=True)

API_KEY = "GEMINI_API_KEY_PLACEHOLDER"

PROMPT = """أنت محامٍ تونسي مختص في صياغة العقود ومراجعتها. لديك معرفة عميقة بـ:
- مجلة الالتزامات والعقود التونسية (م.إ.ع)
- مجلة الشغل التونسية
- مجلة الشركات التجارية التونسية
- الإجراءات الإدارية التونسية (البلدية، القباضة المالية، التسجيل)

مهمتك: مراجعة دقيقة للصياغة العربية للعقد أدناه.

المطلوب (مرتب حسب الأولوية):
1. **أخطاء قانونية حرجة** — مصطلحات أو صيغ مخالفة للقانون التونسي قد تبطل العقد
2. **مصطلحات غير صحيحة** — كلمات عربية فصحى أو مشرقية لا تستخدم في القانون التونسي
3. **ترجمات ركيكة** — ترجمات حرفية من الفرنسية إلى صياغة غير طبيعية
4. **أخطاء إملائية أو نحوية**

لكل مشكلة، قدم:
- النص الخاطئ
- المشكلة بالضبط
- النص المصحح (جاهز للنسخ واللصق)

إذا كانت الصياغة سليمة تمامًا، اكتب فقط: "الصياغة سليمة — لا توجد مشاكل."

النص للمراجعة:
{tmpl_title}

{ar_text}"""


async def review_template(client, path, model):
    slug = path.stem
    data = json.loads(path.read_text(encoding="utf-8"))

    lines = []
    for s in data.get("sections", []):
        lines.append(f"[{s.get('title_ar', '')}]")
        for a in s.get("articles", []):
            lines.append(a.get("text_ar", ""))
    ar_text = "\n".join(lines)

    if len(ar_text) < 50:
        return slug, "SKIP", "Empty"

    prompt = PROMPT.format(tmpl_title=data.get("title_ar", slug), ar_text=ar_text[:4000])

    try:
        response = await client.aio.models.generate_content(model=model, contents=prompt)
        result = response.text
    except Exception as e:
        result = f"ERROR: {str(e)[:500]}"

    report = {
        "slug": slug,
        "title_ar": data.get("title_ar", ""),
        "model": model,
        "review": result,
    }
    out_path = REVIEWS_DIR / f"{slug}.json"
    out_path.write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")

    issues = result.count("المشكلة") + result.count("الخلل") + result.count("السبب") + result.count("خطأ")
    status = "CLEAN" if "سليمة" in result[:200] else f"{issues} issues"
    return slug, status, result


async def main():
    # Try best available models
    for model in ["gemini-3-pro-preview", "gemini-pro-latest", "gemini-3.5-flash", "gemini-flash-latest"]:
        try:
            client = Client(api_key=API_KEY)
            # Quick test
            resp = await client.aio.models.generate_content(model=model, contents="Reply with just: OK")
            if "OK" in resp.text:
                print(f"Using model: {model}\n")
                break
        except Exception as e:
            err = str(e)[:80]
            print(f"  {model}: {err}")
            model = "gemini-flash-latest"

    client = Client(api_key=API_KEY)

    paths = sorted(TEMPLATES_DIR.glob("*.json"))
    results = []
    for i, path in enumerate(paths):
        slug, status, _ = await review_template(client, path, model)
        results.append((slug, status))
        print(f"[{i+1:2d}/{len(paths)}] {slug:35s} → {status}")

    print(f"\n{'='*60}")
    clean = sum(1 for _, s in results if "CLEAN" in s)
    issues = sum(1 for _, s in results if "CLEAN" not in s)
    print(f"Clean: {clean}, Issues: {issues}")
    print(f"Reviews saved to: {REVIEWS_DIR}")

asyncio.run(main())
