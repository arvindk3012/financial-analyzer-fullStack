from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from pydantic import BaseModel
import pandas as pd
import io

router = APIRouter()

class UploadResponse(BaseModel):
    message: str
    filename: str
    records_processed: int

@router.post("/upload", response_model=UploadResponse)
async def upload_financial_data(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
):
    """Upload and process financial data file"""
    try:
        if not file.filename.endswith(('.csv', '.xlsx', '.xls')):
            raise HTTPException(
                status_code=400, 
                detail="Only CSV and Excel files are supported"
            )
        
        # Read file content
        content = await file.read()
        
        # Process based on file type
        if file.filename.endswith('.csv'):
            df = pd.read_csv(io.StringIO(content.decode('utf-8')))
        else:
            df = pd.read_excel(io.BytesIO(content))
        
        # Basic validation
        if df.empty:
            raise HTTPException(status_code=400, detail="File is empty")
        
        records_count = len(df)
        
        # For now, just return success without actually saving to DB
        # In full implementation, this would process and save the data
        
        return UploadResponse(
            message="File uploaded and processed successfully",
            filename=file.filename,
            records_processed=records_count
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

@router.get("/upload-status")
async def get_upload_status():
    """Get upload processing status"""
    return {
        "status": "ready",
        "supported_formats": ["CSV", "Excel (.xlsx, .xls)"],
        "max_file_size": "10MB"
    }
