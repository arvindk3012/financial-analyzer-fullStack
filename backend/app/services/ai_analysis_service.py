"""
AI Analysis Service - OpenAI integration for financial data analysis
"""

import openai
from typing import Dict, Any, List, Optional
import json
import pandas as pd
from datetime import datetime, timedelta
import asyncio
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.services.financial_data_service import FinancialDataService
from app.models.analysis import Analysis, AnalysisType, AnalysisStatus


class AIAnalysisService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.financial_service = FinancialDataService(db)
        openai.api_key = settings.OPENAI_API_KEY

    async def analyze_financial_data(
        self,
        dataset_id: int,
        user_id: int,
        analysis_type: str,
        custom_prompt: Optional[str] = None,
        focus_columns: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """
        Perform AI-powered analysis on financial data
        """
        try:
            # Get dataset and verify ownership
            dataset = await self.financial_service.get_dataset(dataset_id, user_id)
            if not dataset:
                raise ValueError("Dataset not found or access denied")

            # Get data summary for context
            data_summary = await self.financial_service.get_data_summary(dataset_id)
            
            # Get recent financial records for analysis
            recent_records = await self.financial_service.get_financial_records(
                dataset_id=dataset_id,
                limit=100
            )

            # Prepare data context for AI
            data_context = self._prepare_data_context(data_summary, recent_records, focus_columns)
            
            # Generate analysis based on type
            if analysis_type == "trend":
                result = await self._trend_analysis(data_context, custom_prompt)
            elif analysis_type == "health":
                result = await self._financial_health_assessment(data_context, custom_prompt)
            elif analysis_type == "comparative":
                result = await self._comparative_analysis(data_context, custom_prompt)
            elif analysis_type == "risk":
                result = await self._risk_assessment(data_context, custom_prompt)
            elif analysis_type == "forecast":
                result = await self._forecast_analysis(data_context, custom_prompt)
            elif analysis_type == "custom":
                result = await self._custom_analysis(data_context, custom_prompt)
            else:
                raise ValueError(f"Unsupported analysis type: {analysis_type}")

            # Save analysis to database
            analysis_record = await self._save_analysis(
                dataset_id=dataset_id,
                user_id=user_id,
                analysis_type=analysis_type,
                result=result,
                custom_prompt=custom_prompt
            )

            return {
                "analysis_id": analysis_record.id,
                "analysis_type": analysis_type,
                "result": result,
                "created_at": analysis_record.created_at.isoformat(),
                "dataset_name": dataset.name
            }

        except Exception as e:
            raise Exception(f"AI analysis failed: {str(e)}")

    def _prepare_data_context(
        self,
        data_summary: Any,
        recent_records: List[Any],
        focus_columns: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """Prepare financial data context for AI analysis"""
        
        # Convert records to structured format
        records_data = []
        for record in recent_records[:20]:  # Limit to recent 20 records
            records_data.append({
                "date": record.date.isoformat(),
                "type": record.record_type.value,
                "category": record.category.value if record.category else "Unknown",
                "amount": float(record.amount),
                "description": record.description or ""
            })

        context = {
            "summary": {
                "total_records": data_summary.total_records,
                "total_revenue": data_summary.total_revenue,
                "total_expenses": data_summary.total_expenses,
                "net_profit": data_summary.net_profit,
                "profit_margin": data_summary.profit_margin,
                "revenue_transactions": data_summary.revenue_transactions,
                "expense_transactions": data_summary.expense_transactions,
                "date_range": {
                    "start": data_summary.date_range_start.isoformat() if data_summary.date_range_start else None,
                    "end": data_summary.date_range_end.isoformat() if data_summary.date_range_end else None
                }
            },
            "recent_transactions": records_data,
            "focus_columns": focus_columns or []
        }
        
        return context

    async def _trend_analysis(self, data_context: Dict[str, Any], custom_prompt: Optional[str] = None) -> Dict[str, Any]:
        """Perform trend analysis using OpenAI"""
        
        base_prompt = f"""
        Analyze the financial trends in the following data:

        Summary:
        - Total Revenue: ${data_context['summary']['total_revenue']:,.2f}
        - Total Expenses: ${data_context['summary']['total_expenses']:,.2f}
        - Net Profit: ${data_context['summary']['net_profit']:,.2f}
        - Profit Margin: {data_context['summary']['profit_margin']:.2f}%
        - Date Range: {data_context['summary']['date_range']['start']} to {data_context['summary']['date_range']['end']}

        Recent Transactions (sample):
        {json.dumps(data_context['recent_transactions'][:10], indent=2)}

        Please provide:
        1. Key trends identified in revenue and expenses
        2. Seasonal patterns or cyclical behavior
        3. Growth rates and trajectory analysis
        4. Recommendations for trend optimization
        5. Potential concerns or red flags

        {f'Additional context: {custom_prompt}' if custom_prompt else ''}
        """

        response = await self._call_openai(base_prompt)
        
        return {
            "analysis_type": "trend",
            "insights": response,
            "key_metrics": {
                "revenue_trend": "positive" if data_context['summary']['total_revenue'] > 0 else "negative",
                "profit_margin": data_context['summary']['profit_margin'],
                "transaction_volume": data_context['summary']['total_records']
            }
        }

    async def _financial_health_assessment(self, data_context: Dict[str, Any], custom_prompt: Optional[str] = None) -> Dict[str, Any]:
        """Assess financial health using OpenAI"""
        
        base_prompt = f"""
        Assess the financial health of this business based on the following data:

        Financial Summary:
        - Total Revenue: ${data_context['summary']['total_revenue']:,.2f}
        - Total Expenses: ${data_context['summary']['total_expenses']:,.2f}
        - Net Profit: ${data_context['summary']['net_profit']:,.2f}
        - Profit Margin: {data_context['summary']['profit_margin']:.2f}%
        - Revenue Transactions: {data_context['summary']['revenue_transactions']}
        - Expense Transactions: {data_context['summary']['expense_transactions']}

        Please provide:
        1. Overall financial health score (1-10)
        2. Strengths and weaknesses analysis
        3. Liquidity and profitability assessment
        4. Comparison to industry benchmarks (if applicable)
        5. Specific recommendations for improvement
        6. Risk factors to monitor

        {f'Additional context: {custom_prompt}' if custom_prompt else ''}
        """

        response = await self._call_openai(base_prompt)
        
        # Calculate health score based on metrics
        health_score = self._calculate_health_score(data_context['summary'])
        
        return {
            "analysis_type": "financial_health",
            "insights": response,
            "health_score": health_score,
            "key_indicators": {
                "profitability": "good" if data_context['summary']['profit_margin'] > 10 else "poor",
                "revenue_diversity": len(set(t['category'] for t in data_context['recent_transactions'])),
                "expense_control": "good" if data_context['summary']['profit_margin'] > 15 else "needs_attention"
            }
        }

    async def _comparative_analysis(self, data_context: Dict[str, Any], custom_prompt: Optional[str] = None) -> Dict[str, Any]:
        """Perform comparative analysis using OpenAI"""
        
        base_prompt = f"""
        Perform a comparative analysis of this financial data:

        Current Performance:
        - Revenue: ${data_context['summary']['total_revenue']:,.2f}
        - Expenses: ${data_context['summary']['total_expenses']:,.2f}
        - Profit: ${data_context['summary']['net_profit']:,.2f}
        - Margin: {data_context['summary']['profit_margin']:.2f}%

        Please provide:
        1. Period-over-period comparison insights
        2. Revenue vs expense ratio analysis
        3. Performance benchmarking suggestions
        4. Category-wise performance comparison
        5. Efficiency metrics and recommendations

        {f'Additional context: {custom_prompt}' if custom_prompt else ''}
        """

        response = await self._call_openai(base_prompt)
        
        return {
            "analysis_type": "comparative",
            "insights": response,
            "comparisons": {
                "revenue_expense_ratio": data_context['summary']['total_revenue'] / max(data_context['summary']['total_expenses'], 1),
                "profit_margin_category": "excellent" if data_context['summary']['profit_margin'] > 20 else "good" if data_context['summary']['profit_margin'] > 10 else "needs_improvement"
            }
        }

    async def _risk_assessment(self, data_context: Dict[str, Any], custom_prompt: Optional[str] = None) -> Dict[str, Any]:
        """Perform risk assessment using OpenAI"""
        
        base_prompt = f"""
        Assess the financial risks based on this data:

        Financial Position:
        - Revenue: ${data_context['summary']['total_revenue']:,.2f}
        - Expenses: ${data_context['summary']['total_expenses']:,.2f}
        - Profit Margin: {data_context['summary']['profit_margin']:.2f}%
        - Transaction Volume: {data_context['summary']['total_records']}

        Recent Transaction Patterns:
        {json.dumps(data_context['recent_transactions'][:5], indent=2)}

        Please identify:
        1. Financial risk factors and their severity
        2. Cash flow risks and volatility
        3. Revenue concentration risks
        4. Expense management risks
        5. Mitigation strategies for each risk
        6. Early warning indicators to monitor

        {f'Additional context: {custom_prompt}' if custom_prompt else ''}
        """

        response = await self._call_openai(base_prompt)
        
        # Calculate risk score
        risk_score = self._calculate_risk_score(data_context['summary'])
        
        return {
            "analysis_type": "risk_assessment",
            "insights": response,
            "risk_score": risk_score,
            "risk_factors": {
                "profitability_risk": "high" if data_context['summary']['profit_margin'] < 5 else "low",
                "revenue_volatility": "medium",  # Would need historical data for accurate assessment
                "expense_control": "good" if data_context['summary']['profit_margin'] > 15 else "poor"
            }
        }

    async def _forecast_analysis(self, data_context: Dict[str, Any], custom_prompt: Optional[str] = None) -> Dict[str, Any]:
        """Perform forecast analysis using OpenAI"""
        
        base_prompt = f"""
        Provide financial forecasting insights based on this data:

        Current Performance:
        - Revenue: ${data_context['summary']['total_revenue']:,.2f}
        - Expenses: ${data_context['summary']['total_expenses']:,.2f}
        - Profit: ${data_context['summary']['net_profit']:,.2f}
        - Margin: {data_context['summary']['profit_margin']:.2f}%

        Transaction Trends:
        {json.dumps(data_context['recent_transactions'][:10], indent=2)}

        Please provide:
        1. Revenue growth projections for next 3-6 months
        2. Expense trend forecasts
        3. Profit margin predictions
        4. Seasonal adjustments and considerations
        5. Growth opportunities and constraints
        6. Scenario planning (best/worst/most likely cases)

        {f'Additional context: {custom_prompt}' if custom_prompt else ''}
        """

        response = await self._call_openai(base_prompt)
        
        return {
            "analysis_type": "forecast",
            "insights": response,
            "projections": {
                "revenue_growth_estimate": "5-15%",  # Would use ML models for accurate forecasting
                "expense_trend": "stable",
                "profit_outlook": "positive" if data_context['summary']['profit_margin'] > 10 else "cautious"
            }
        }

    async def _custom_analysis(self, data_context: Dict[str, Any], custom_prompt: str) -> Dict[str, Any]:
        """Perform custom analysis based on user prompt"""
        
        base_prompt = f"""
        Analyze the following financial data based on the user's specific request:

        Financial Summary:
        - Revenue: ${data_context['summary']['total_revenue']:,.2f}
        - Expenses: ${data_context['summary']['total_expenses']:,.2f}
        - Profit: ${data_context['summary']['net_profit']:,.2f}
        - Margin: {data_context['summary']['profit_margin']:.2f}%

        Recent Transactions:
        {json.dumps(data_context['recent_transactions'][:15], indent=2)}

        User Request: {custom_prompt}

        Please provide a comprehensive analysis addressing the user's specific question or request.
        """

        response = await self._call_openai(base_prompt)
        
        return {
            "analysis_type": "custom",
            "insights": response,
            "custom_prompt": custom_prompt
        }

    async def _call_openai(self, prompt: str) -> str:
        """Make API call to OpenAI"""
        try:
            response = await asyncio.to_thread(
                openai.ChatCompletion.create,
                model=settings.OPENAI_MODEL,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a professional financial analyst with expertise in business finance, accounting, and data analysis. Provide clear, actionable insights based on the financial data presented."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                max_tokens=1500,
                temperature=0.7
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            raise Exception(f"OpenAI API call failed: {str(e)}")

    def _calculate_health_score(self, summary: Dict[str, Any]) -> float:
        """Calculate financial health score (1-10)"""
        score = 5.0  # Base score
        
        # Profit margin impact
        if summary['profit_margin'] > 20:
            score += 2
        elif summary['profit_margin'] > 10:
            score += 1
        elif summary['profit_margin'] < 0:
            score -= 3
        
        # Revenue size impact
        if summary['total_revenue'] > 1000000:
            score += 1
        elif summary['total_revenue'] < 10000:
            score -= 1
        
        # Transaction volume impact
        if summary['total_records'] > 100:
            score += 0.5
        
        return max(1.0, min(10.0, score))

    def _calculate_risk_score(self, summary: Dict[str, Any]) -> float:
        """Calculate risk score (1-10, higher = more risky)"""
        score = 5.0  # Base score
        
        # Profit margin risk
        if summary['profit_margin'] < 0:
            score += 3
        elif summary['profit_margin'] < 5:
            score += 2
        elif summary['profit_margin'] > 20:
            score -= 2
        
        # Revenue size risk
        if summary['total_revenue'] < 50000:
            score += 1
        
        return max(1.0, min(10.0, score))

    async def _save_analysis(
        self,
        dataset_id: int,
        user_id: int,
        analysis_type: str,
        result: Dict[str, Any],
        custom_prompt: Optional[str] = None
    ) -> Analysis:
        """Save analysis results to database"""
        
        analysis = Analysis(
            dataset_id=dataset_id,
            user_id=user_id,
            analysis_type=AnalysisType(analysis_type),
            status=AnalysisStatus.COMPLETED,
            result=result,
            prompt=custom_prompt
        )
        
        self.db.add(analysis)
        await self.db.commit()
        await self.db.refresh(analysis)
        
        return analysis

    async def get_analysis_history(
        self,
        user_id: int,
        dataset_id: Optional[int] = None,
        analysis_type: Optional[str] = None,
        limit: int = 50
    ) -> List[Analysis]:
        """Get analysis history for user"""
        from sqlalchemy import select, and_, desc
        
        query = select(Analysis).where(Analysis.user_id == user_id)
        
        if dataset_id:
            query = query.where(Analysis.dataset_id == dataset_id)
        
        if analysis_type:
            query = query.where(Analysis.analysis_type == AnalysisType(analysis_type))
        
        query = query.order_by(desc(Analysis.created_at)).limit(limit)
        
        result = await self.db.execute(query)
        return result.scalars().all()
