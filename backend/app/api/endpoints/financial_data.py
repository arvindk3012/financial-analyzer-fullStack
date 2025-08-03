from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.core.database import get_db
from app.models.financial_models import FinancialRecord, FinancialDataset
from app.schemas.financial_schemas import FinancialRecordResponse, FinancialDatasetResponse

router = APIRouter()

@router.get("/records", response_model=List[FinancialRecordResponse])
async def get_financial_records(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    """Get financial records with pagination"""
    try:
        result = await db.execute(
            select(FinancialRecord).offset(skip).limit(limit)
        )
        records = result.scalars().all()
        return records
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/datasets", response_model=List[FinancialDatasetResponse])
async def get_datasets(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db)
):
    """Get financial datasets with pagination"""
    try:
        result = await db.execute(
            select(FinancialDataset).offset(skip).limit(limit)
        )
        datasets = result.scalars().all()
        return datasets
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/analytics/summary")
async def get_analytics_summary(db: AsyncSession = Depends(get_db)):
    """Get basic analytics summary"""
    try:
        # Get total records count
        records_result = await db.execute(select(FinancialRecord))
        total_records = len(records_result.scalars().all())
        
        # Get datasets count
        datasets_result = await db.execute(select(FinancialDataset))
        total_datasets = len(datasets_result.scalars().all())
        
        return {
            "total_records": total_records,
            "total_datasets": total_datasets,
            "status": "active"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
