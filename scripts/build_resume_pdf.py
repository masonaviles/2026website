"""Generate web/public/resume.pdf from the source .docx.

Run with one-shot deps so we don't pollute the api project's lockfile:

    uv run --with reportlab --with python-docx scripts/build_resume_pdf.py

The .docx remains the source of truth in /Users/mason/Documents/work.
Re-run this script whenever the .docx changes (or replace the PDF directly
with your own Word/Pages export — fidelity will be higher).
"""
from __future__ import annotations

import sys
from pathlib import Path

from docx import Document
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas

SRC = Path("/Users/mason/Documents/work/Mason_Aviles_Resume.docx")
DST = Path(__file__).resolve().parent.parent / "web" / "public" / "resume.pdf"

INK = HexColor("#15151a")
SOFT = HexColor("#4a4a55")
MUTE = HexColor("#8a8a93")
ACCENT = HexColor("#0f9d6e")

PAGE_W, PAGE_H = LETTER
MARGIN_X = 0.6 * inch
MARGIN_Y = 0.55 * inch
LINE_W = PAGE_W - 2 * MARGIN_X


def paragraphs(doc: Document) -> list[str]:  # type: ignore[type-arg]
    out: list[str] = []
    for p in doc.paragraphs:
        text = (p.text or "").strip()
        if text:
            out.append(text)
    return out


def classify(line: str, idx: int) -> str:
    """Heuristic classifier for resume sections."""
    if idx == 0:
        return "name"
    if idx == 1:
        return "subtitle"
    if idx == 2:
        return "contact"
    if idx == 3 and line.startswith(("gitaddmason", "linkedin", "github")):
        return "contact"
    if line.isupper() and len(line) < 60:
        return "section"
    if "\t" in line:
        return "role"
    return "body"


def draw(c: canvas.Canvas, lines: list[str]) -> None:
    y = PAGE_H - MARGIN_Y

    def newline(gap: float) -> None:
        nonlocal y
        y -= gap

    def page_break_if(needed: float) -> None:
        nonlocal y
        if y - needed < MARGIN_Y:
            c.showPage()
            y = PAGE_H - MARGIN_Y

    for idx, line in enumerate(lines):
        kind = classify(line, idx)
        page_break_if(0.4 * inch)

        if kind == "name":
            c.setFillColor(INK)
            c.setFont("Helvetica-Bold", 22)
            c.drawString(MARGIN_X, y, line)
            newline(0.28 * inch)
        elif kind == "subtitle":
            c.setFillColor(SOFT)
            c.setFont("Helvetica", 10.5)
            c.drawString(MARGIN_X, y, line)
            newline(0.2 * inch)
        elif kind == "contact":
            c.setFillColor(MUTE)
            c.setFont("Helvetica", 9)
            c.drawString(MARGIN_X, y, line)
            newline(0.16 * inch)
        elif kind == "section":
            newline(0.08 * inch)
            c.setFillColor(ACCENT)
            c.setFont("Helvetica-Bold", 10.5)
            c.drawString(MARGIN_X, y, line)
            c.setStrokeColor(ACCENT)
            c.setLineWidth(0.6)
            c.line(MARGIN_X, y - 3, MARGIN_X + 0.6 * inch, y - 3)
            newline(0.22 * inch)
        elif kind == "role":
            # Format: "Title — Company\tDates · Location"
            parts = line.split("\t", 1)
            title = parts[0].strip()
            meta = parts[1].strip() if len(parts) > 1 else ""
            c.setFillColor(INK)
            c.setFont("Helvetica-Bold", 11)
            c.drawString(MARGIN_X, y, title)
            if meta:
                c.setFillColor(MUTE)
                c.setFont("Helvetica-Oblique", 9)
                c.drawRightString(PAGE_W - MARGIN_X, y, meta)
            newline(0.2 * inch)
        else:
            c.setFillColor(SOFT)
            c.setFont("Helvetica", 9.5)
            wrap_and_draw(c, line, MARGIN_X, y, LINE_W, 0.16 * inch, set_y=lambda v: newline(v))
    # Final cleanup
    c.showPage()


def wrap_and_draw(
    c: canvas.Canvas,
    text: str,
    x: float,
    y: float,
    width: float,
    line_height: float,
    set_y,
) -> None:
    """Naive word-wrapping for body paragraphs."""
    words = text.split()
    line: list[str] = []
    for word in words:
        candidate = " ".join([*line, word])
        if c.stringWidth(candidate, "Helvetica", 9.5) > width and line:
            c.drawString(x, y, " ".join(line))
            y -= line_height
            set_y(line_height)
            line = [word]
        else:
            line.append(word)
    if line:
        c.drawString(x, y, " ".join(line))
        set_y(line_height)


def main() -> int:
    if not SRC.exists():
        print(f"Missing source: {SRC}", file=sys.stderr)
        return 1
    DST.parent.mkdir(parents=True, exist_ok=True)

    doc = Document(str(SRC))
    lines = paragraphs(doc)

    c = canvas.Canvas(str(DST), pagesize=LETTER)
    c.setTitle("Mason Aviles — Resume")
    c.setAuthor("Mason Aviles")
    draw(c, lines)
    c.save()
    print(f"Wrote {DST} ({DST.stat().st_size:,} bytes)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
