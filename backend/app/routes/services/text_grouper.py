def group_words(page):
    """Return word-level items using PyMuPDF's word extraction.

    PyMuPDF word tuples contain x0, y0, x1, y1, word, block_no,
    line_no, word_no. For CJK text without spaces, this initial version
    follows the PDF's extracted word segmentation; a later iteration can
    add character-based grouping while preserving source character data.
    """
    items = []
    for index, word in enumerate(page.get_text("words")):
        x0, y0, x1, y1, text, *_ = word
        if not str(text).strip():
            continue
        items.append({
            "id": f"p{page.number + 1}-w{index + 1}",
            "text": str(text),
            "bbox": [round(x0, 3), round(y0, 3), round(x1, 3), round(y1, 3)],
        })
    return items
