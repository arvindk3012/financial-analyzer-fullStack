"""
Financial Data Service - Business logic for financial data operations
"""

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, or_, desc
from sqlalchemy.orm import selectinload
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import pandas as pd
from decimal import Decimal

from app.models.financial_data import (
    FinancialDataset, 
    FinancialRecord, 
    KPIMetric,
    RecordType,
    Category
)
from app.schemas.financial_data import (
    FinancialDatasetCreate,
    FinancialDatasetUpdate,
    FinancialRecordCreate,
    BulkFinancialRecordCreate,
    BulkOperationResponse,
    DataSummary,
    RevenueAnalysis,
    ExpenseAnalysis,
    ProfitAnalysis
)


class FinancialDataService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_dataset(self, dataset_data: FinancialDatasetCreate, user_id: int) -> FinancialDataset:
        """Create a new financial dataset"""
        db_dataset = FinancialDataset(
            **dataset_data.dict(),
            user_id=user_id
        )
        self.db.add(db_dataset)
        await self.db.commit()
        await self.db.refresh(db_dataset)
        return db_dataset

    async def get_user_datasets(self, user_id: int, skip: int = 0, limit: int = 100) -> List[FinancialDataset]:
        """Get all datasets for a user"""
        query = select(FinancialDataset).where(
            FinancialDataset.user_id == user_id
        ).offset(skip).limit(limit).order_by(desc(FinancialDataset.created_at))
        
        result = await self.db.execute(query)
        return result.scalars().all()

    async def get_dataset(self, dataset_id: int, user_id: int) -> Optional[FinancialDataset]:
        """Get a specific dataset by ID"""
        query = select(FinancialDataset).where(
            and_(
                FinancialDataset.id == dataset_id,
                FinancialDataset.user_id == user_id
            )
        )
        result = await self.db.execute(query)
        return result.scalar_one_or_none()

    async def update_dataset(self, dataset_id: int, dataset_update: FinancialDatasetUpdate, user_id: int) -> Optional[FinancialDataset]:
        """Update a dataset"""
        dataset = await self.get_dataset(dataset_id, user_id)
        if not dataset:
            return None
        
        update_data = dataset_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(dataset, field, value)
        
        dataset.updated_at = datetime.utcnow()
        await self.db.commit()
        await self.db.refresh(dataset)
        return dataset

    async def delete_dataset(self, dataset_id: int, user_id: int) -> bool:
        """Delete a dataset"""
        dataset = await self.get_dataset(dataset_id, user_id)
        if not dataset:
            return False
        
        await self.db.delete(dataset)
        await self.db.commit()
        return True

    async def get_financial_records(
        self,
        dataset_id: int,
        skip: int = 0,
        limit: int = 100,
        category: Optional[str] = None,
        date_from: Optional[datetime] = None,
        date_to: Optional[datetime] = None
    ) -> List[FinancialRecord]:
        """Get financial records with optional filtering"""
        query = select(FinancialRecord).where(
            FinancialRecord.dataset_id == dataset_id
        )
        
        if category:
            query = query.where(FinancialRecord.category == category)
        
        if date_from:
            query = query.where(FinancialRecord.date >= date_from)
        
        if date_to:
            query = query.where(FinancialRecord.date <= date_to)
        
        query = query.offset(skip).limit(limit).order_by(desc(FinancialRecord.date))
        
        result = await self.db.execute(query)
        return result.scalars().all()

    async def create_financial_record(self, record_data: FinancialRecordCreate) -> FinancialRecord:
        """Create a new financial record"""
        db_record = FinancialRecord(**record_data.dict())
        self.db.add(db_record)
        await self.db.commit()
        await self.db.refresh(db_record)
        return db_record

    async def create_bulk_financial_records(self, bulk_data: BulkFinancialRecordCreate) -> BulkOperationResponse:
        """Create multiple financial records in bulk"""
        created_records = []
        failed_records = []
        
        for record_data in bulk_data.records:
            try:
                record_data.dataset_id = bulk_data.dataset_id
                db_record = FinancialRecord(**record_data.dict())
                self.db.add(db_record)
                created_records.append(db_record)
            except Exception as e:
                failed_records.append({
                    "record": record_data.dict(),
                    "error": str(e)
                })
        
        await self.db.commit()
        
        return BulkOperationResponse(
            total_records=len(bulk_data.records),
            successful_records=len(created_records),
            failed_records=len(failed_records),
            errors=failed_records
        )

    async def get_data_summary(
        self,
        dataset_id: int,
        date_from: Optional[datetime] = None,
        date_to: Optional[datetime] = None
    ) -> DataSummary:
        """Get comprehensive data summary for a dataset"""
        
        # Base query
        base_query = select(FinancialRecord).where(FinancialRecord.dataset_id == dataset_id)
        
        if date_from:
            base_query = base_query.where(FinancialRecord.date >= date_from)
        if date_to:
            base_query = base_query.where(FinancialRecord.date <= date_to)
        
        # Total records
        total_records_query = select(func.count(FinancialRecord.id)).where(
            FinancialRecord.dataset_id == dataset_id
        )
        if date_from:
            total_records_query = total_records_query.where(FinancialRecord.date >= date_from)
        if date_to:
            total_records_query = total_records_query.where(FinancialRecord.date <= date_to)
        
        total_records_result = await self.db.execute(total_records_query)
        total_records = total_records_result.scalar()
        
        # Revenue summary
        revenue_query = select(
            func.sum(FinancialRecord.amount).label('total'),
            func.count(FinancialRecord.id).label('count')
        ).where(
            and_(
                FinancialRecord.dataset_id == dataset_id,
                FinancialRecord.record_type == RecordType.REVENUE
            )
        )
        if date_from:
            revenue_query = revenue_query.where(FinancialRecord.date >= date_from)
        if date_to:
            revenue_query = revenue_query.where(FinancialRecord.date <= date_to)
        
        revenue_result = await self.db.execute(revenue_query)
        revenue_data = revenue_result.first()
        
        # Expense summary
        expense_query = select(
            func.sum(FinancialRecord.amount).label('total'),
            func.count(FinancialRecord.id).label('count')
        ).where(
            and_(
                FinancialRecord.dataset_id == dataset_id,
                FinancialRecord.record_type == RecordType.EXPENSE
            )
        )
        if date_from:
            expense_query = expense_query.where(FinancialRecord.date >= date_from)
        if date_to:
            expense_query = expense_query.where(FinancialRecord.date <= date_to)
        
        expense_result = await self.db.execute(expense_query)
        expense_data = expense_result.first()
        
        # Calculate metrics
        total_revenue = float(revenue_data.total or 0)
        total_expenses = float(expense_data.total or 0)
        net_profit = total_revenue - total_expenses
        profit_margin = (net_profit / total_revenue * 100) if total_revenue > 0 else 0
        
        # Date range
        date_range_query = select(
            func.min(FinancialRecord.date).label('start_date'),
            func.max(FinancialRecord.date).label('end_date')
        ).where(FinancialRecord.dataset_id == dataset_id)
        
        date_range_result = await self.db.execute(date_range_query)
        date_range = date_range_result.first()
        
        return DataSummary(
            total_records=total_records,
            total_revenue=total_revenue,
            total_expenses=total_expenses,
            net_profit=net_profit,
            profit_margin=profit_margin,
            revenue_transactions=revenue_data.count or 0,
            expense_transactions=expense_data.count or 0,
            date_range_start=date_range.start_date,
            date_range_end=date_range.end_date
        )

    async def get_kpi_metrics(
        self,
        dataset_id: int,
        metric_type: Optional[str] = None,
        period_type: Optional[str] = None
    ) -> List[KPIMetric]:
        """Get KPI metrics for a dataset"""
        query = select(KPIMetric).where(KPIMetric.dataset_id == dataset_id)
        
        if metric_type:
            query = query.where(KPIMetric.metric_type == metric_type)
        if period_type:
            query = query.where(KPIMetric.period_type == period_type)
        
        query = query.order_by(desc(KPIMetric.period_start))
        
        result = await self.db.execute(query)
        return result.scalars().all()

    async def get_revenue_analysis(
        self,
        dataset_id: int,
        period: str = "monthly",
        date_from: Optional[datetime] = None,
        date_to: Optional[datetime] = None
    ) -> Dict[str, Any]:
        """Get detailed revenue analysis"""
        
        # Revenue by category
        category_query = select(
            FinancialRecord.category,
            func.sum(FinancialRecord.amount).label('total'),
            func.count(FinancialRecord.id).label('count')
        ).where(
            and_(
                FinancialRecord.dataset_id == dataset_id,
                FinancialRecord.record_type == RecordType.REVENUE
            )
        ).group_by(FinancialRecord.category)
        
        if date_from:
            category_query = category_query.where(FinancialRecord.date >= date_from)
        if date_to:
            category_query = category_query.where(FinancialRecord.date <= date_to)
        
        category_result = await self.db.execute(category_query)
        revenue_by_category = [
            {
                "category": row.category,
                "total": float(row.total),
                "count": row.count
            }
            for row in category_result
        ]
        
        # Revenue trends (simplified - would need more complex date grouping in production)
        trends_query = select(
            FinancialRecord.date,
            func.sum(FinancialRecord.amount).label('daily_total')
        ).where(
            and_(
                FinancialRecord.dataset_id == dataset_id,
                FinancialRecord.record_type == RecordType.REVENUE
            )
        ).group_by(FinancialRecord.date).order_by(FinancialRecord.date)
        
        if date_from:
            trends_query = trends_query.where(FinancialRecord.date >= date_from)
        if date_to:
            trends_query = trends_query.where(FinancialRecord.date <= date_to)
        
        trends_result = await self.db.execute(trends_query)
        revenue_trends = [
            {
                "date": row.date.isoformat(),
                "amount": float(row.daily_total)
            }
            for row in trends_result
        ]
        
        return {
            "revenue_by_category": revenue_by_category,
            "revenue_trends": revenue_trends,
            "period": period,
            "date_from": date_from.isoformat() if date_from else None,
            "date_to": date_to.isoformat() if date_to else None
        }

    async def get_expense_analysis(
        self,
        dataset_id: int,
        period: str = "monthly",
        date_from: Optional[datetime] = None,
        date_to: Optional[datetime] = None
    ) -> Dict[str, Any]:
        """Get detailed expense analysis"""
        
        # Expense by category
        category_query = select(
            FinancialRecord.category,
            func.sum(FinancialRecord.amount).label('total'),
            func.count(FinancialRecord.id).label('count')
        ).where(
            and_(
                FinancialRecord.dataset_id == dataset_id,
                FinancialRecord.record_type == RecordType.EXPENSE
            )
        ).group_by(FinancialRecord.category)
        
        if date_from:
            category_query = category_query.where(FinancialRecord.date >= date_from)
        if date_to:
            category_query = category_query.where(FinancialRecord.date <= date_to)
        
        category_result = await self.db.execute(category_query)
        expenses_by_category = [
            {
                "category": row.category,
                "total": float(row.total),
                "count": row.count
            }
            for row in category_result
        ]
        
        # Expense trends
        trends_query = select(
            FinancialRecord.date,
            func.sum(FinancialRecord.amount).label('daily_total')
        ).where(
            and_(
                FinancialRecord.dataset_id == dataset_id,
                FinancialRecord.record_type == RecordType.EXPENSE
            )
        ).group_by(FinancialRecord.date).order_by(FinancialRecord.date)
        
        if date_from:
            trends_query = trends_query.where(FinancialRecord.date >= date_from)
        if date_to:
            trends_query = trends_query.where(FinancialRecord.date <= date_to)
        
        trends_result = await self.db.execute(trends_query)
        expense_trends = [
            {
                "date": row.date.isoformat(),
                "amount": float(row.daily_total)
            }
            for row in trends_result
        ]
        
        return {
            "expenses_by_category": expenses_by_category,
            "expense_trends": expense_trends,
            "period": period,
            "date_from": date_from.isoformat() if date_from else None,
            "date_to": date_to.isoformat() if date_to else None
        }

    async def get_profit_analysis(
        self,
        dataset_id: int,
        period: str = "monthly",
        date_from: Optional[datetime] = None,
        date_to: Optional[datetime] = None
    ) -> Dict[str, Any]:
        """Get detailed profit analysis"""
        
        # Get revenue and expense data for profit calculation
        revenue_data = await self.get_revenue_analysis(dataset_id, period, date_from, date_to)
        expense_data = await self.get_expense_analysis(dataset_id, period, date_from, date_to)
        
        # Calculate profit trends by combining revenue and expense trends
        revenue_trends = {item["date"]: item["amount"] for item in revenue_data["revenue_trends"]}
        expense_trends = {item["date"]: item["amount"] for item in expense_data["expense_trends"]}
        
        all_dates = set(revenue_trends.keys()) | set(expense_trends.keys())
        profit_trends = []
        
        for date in sorted(all_dates):
            revenue = revenue_trends.get(date, 0)
            expense = expense_trends.get(date, 0)
            profit = revenue - expense
            
            profit_trends.append({
                "date": date,
                "revenue": revenue,
                "expense": expense,
                "profit": profit,
                "margin": (profit / revenue * 100) if revenue > 0 else 0
            })
        
        # Calculate summary metrics
        total_revenue = sum(item["amount"] for item in revenue_data["revenue_trends"])
        total_expenses = sum(item["amount"] for item in expense_data["expense_trends"])
        net_profit = total_revenue - total_expenses
        profit_margin = (net_profit / total_revenue * 100) if total_revenue > 0 else 0
        
        return {
            "profit_trends": profit_trends,
            "summary": {
                "total_revenue": total_revenue,
                "total_expenses": total_expenses,
                "net_profit": net_profit,
                "profit_margin": profit_margin
            },
            "period": period,
            "date_from": date_from.isoformat() if date_from else None,
            "date_to": date_to.isoformat() if date_to else None
        }
