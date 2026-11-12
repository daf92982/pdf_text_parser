from fastapi import APIRouter, File, HTTPException, UploadFile
from app.services.pdf_extractor import extract_pdf

router = APIRouter()

@router.post("/extract")
async def extract(file: UploadFile = File(...)):
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="請上傳 PDF 檔案。")
    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="檔案內容是空的。")
    try:
        return extract_pdf(content, file.filename)
    except Exception as exc:
        raise HTTPException(status_code=422, detail=f"無法解析 PDF：{exc}") from exc
