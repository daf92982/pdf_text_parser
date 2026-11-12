from app.services.pdf_extractor import corners_from_bbox

def test_corners_from_bbox():
    assert corners_from_bbox([10, 20, 30, 40]) == {
        "top_left": [10, 20],
        "top_right": [30, 20],
        "bottom_left": [10, 40],
        "bottom_right": [30, 40],
    }
