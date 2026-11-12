import fitz
from app.services.text_grouper import group_words

COORDINATE_SYSTEM = "pdf_points_top_left_origin"

def corners_from_bbox(bbox):
    x0, y0, x1, y1 = bbox
    return {
        "top_left": [x0, y0],
        "top_right": [x1, y0],
        "bottom_left": [x0, y1],
        "bottom_right": [x1, y1],
    }

def extract_pdf(content: bytes, filename: str):
    document = fitz.open(stream=content, filetype="pdf")
    pages = []
    for page in document:
        items = group_words(page)
        for item in items:
            item["page"] = page.number + 1
            item["corners"] = corners_from_bbox(item["bbox"])
            item["coordinate_system"] = COORDINATE_SYSTEM
        pages.append({
            "page": page.number + 1,
            "width": round(page.rect.width, 3),
            "height": round(page.rect.height, 3),
            "rotation": page.rotation,
            "items": items,
        })
    document.close()
    return {"filename": filename, "page_count": len(pages), "pages": pages}
