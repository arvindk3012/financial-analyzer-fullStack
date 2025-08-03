from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn
import os
from app.api.endpoints import financial_data, ai_analysis, data_upload
from app.core.database import engine, Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Financial Data Analyzer API",
    description="A comprehensive financial data analysis platform with AI-powered insights",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(financial_data.router, prefix="/api/v1/financial-data", tags=["financial-data"])
app.include_router(ai_analysis.router, prefix="/api/v1/ai-analysis", tags=["ai-analysis"])
app.include_router(data_upload.router, prefix="/api/v1/data-upload", tags=["data-upload"])

@app.get("/")
async def root():
    return {"message": "Financial Data Analyzer API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
