from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.extract import router as extract_router

app = FastAPI(title="PDF Text Coordinate Extractor API", version="0.1.0")

# Development default. Restrict allowed origins before production deployment.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

app.include_router(extract_router, prefix="/api")

@app.get("/health")
def health():
    return {"status": "ok"}
