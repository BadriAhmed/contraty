import logging
from io import BytesIO
from docx import Document
from docx.shared import Pt, Inches, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from app.models.contract import Language, Contract

logger = logging.getLogger(__name__)


class DOCXRenderer:
    def render_contract(self, contract: Contract, language: Language) -> bytes:
        doc = Document()
        direction = "rtl" if language == Language.ar else "ltr"
        title = contract.title_ar if language == Language.ar else contract.title_fr

        # Title
        heading = doc.add_heading(title, level=1)
        heading.alignment = WD_ALIGN_PARAGRAPH.CENTER
        if language == Language.ar:
            heading.runs[0].font.rtl = True

        # Sections
        for section in contract.sections:
            sec_title = section.title_ar if language == Language.ar else section.title_fr
            if sec_title:
                h = doc.add_heading(sec_title, level=2)
                if language == Language.ar:
                    h.runs[0].font.rtl = True

            for article in section.articles:
                text = article.text_ar if language == Language.ar else article.text_fr
                if text.strip():
                    p = doc.add_paragraph(text)
                    if language == Language.ar:
                        p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
                        for run in p.runs:
                            run.font.rtl = True

        buf = BytesIO()
        doc.save(buf)
        return buf.getvalue()


docx_renderer = DOCXRenderer()
