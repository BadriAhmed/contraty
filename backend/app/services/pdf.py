import logging
from pathlib import Path
from weasyprint import HTML
from app.models.contract import Language, Contract

logger = logging.getLogger(__name__)

_CSS_PATH = Path(__file__).resolve().parent / "templates" / "contract.css"


class PDFRenderer:
    def __init__(self):
        self._base_css: str | None = None

    def _load_css(self):
        if self._base_css is not None:
            return
        try:
            self._base_css = _CSS_PATH.read_text()
        except FileNotFoundError:
            self._base_css = """
                @page { margin: 2cm; }
                body { font-family: Arial, sans-serif; line-height: 1.6; }
                h1 { text-align: center; color: #1a365d; }
                .disclaimer { border: 2px solid red; padding: 1em; margin-bottom: 2em; background: #fff5f5; }
                .section { margin-bottom: 1.5em; }
                .section-title { font-size: 1.2em; font-weight: bold; color: #1a365d; margin-bottom: 0.5em; }
                .article { margin-bottom: 0.7em; white-space: pre-wrap; }
                [dir="rtl"] { direction: rtl; text-align: right; }
                [dir="ltr"] { direction: ltr; text-align: left; }
            """
            logger.warning("Default CSS fallback loaded")

    def render_contract(self, contract: Contract, language: Language) -> bytes:
        self._load_css()
        html = self._build_html(contract, language)
        return HTML(string=html).write_pdf()

    def _build_html(self, contract: Contract, language: Language) -> str:
        direction = "rtl" if language == Language.ar else "ltr"
        title = contract.title_ar if language == Language.ar else contract.title_fr

        body = ""
        for section in contract.sections:
            sec_title = section.title_ar if language == Language.ar else section.title_fr
            body += f'<div class="section">'
            if sec_title:
                body += f'<div class="section-title">{sec_title}</div>'
            for article in section.articles:
                text = article.text_ar if language == Language.ar else article.text_fr
                body += f'<div class="article">{text}</div>'
            body += '</div>'

        return f"""<!DOCTYPE html>
<html lang="{language.value}" dir="{direction}">
<head><meta charset="utf-8"><style>{self._base_css}</style></head>
<body>
<div class="disclaimer">{contract.disclaimer}</div>
<h1>{title}</h1>
{body}
</body>
</html>"""


pdf_renderer = PDFRenderer()
