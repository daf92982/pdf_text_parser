# PDF Text Coordinate Extractor

PDF 文字座標擷取與視覺化工具。

第一版目標：支援文字型 PDF，擷取單字／詞語文字及其 bounding box，計算四角座標，並在網頁上視覺化。

## 專案結構

- `frontend/`：PDF 檢視、文字框 overlay、座標面板與 JSON 匯出。
- `backend/`：FastAPI API 與 PyMuPDF 文字座標擷取。
- `samples/`：測試樣本說明（請勿提交含個資或機密內容的 PDF）。

## 本機開發

### 後端

```bash
cd backend
python -m venv .venv
# Windows PowerShell:
.venv\\Scripts\\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API 預設位址：`http://127.0.0.1:8000`。

### 前端

先以 VS Code Live Server 或其他靜態 HTTP server 開啟 `frontend/`。前端 API 位址設定在 `frontend/js/api.js`。

## 第一版限制

目前只支援含有可擷取文字圖層的 PDF，不包含 OCR。若 PDF 是掃描圖片，可能無法擷取文字。
