from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.services.ai_analysis_service import AIAnalysisService
from pydantic import BaseModel

router = APIRouter()

class AIAnalysisRequest(BaseModel):
    query: str
    context: str = ""

class AIAnalysisResponse(BaseModel):
    query: str
    analysis: str
    insights: list = []

@router.post("/analyze", response_model=AIAnalysisResponse)
async def analyze_financial_data(
    request: AIAnalysisRequest,
    db: AsyncSession = Depends(get_db)
):
    """Analyze financial data using AI"""
    try:
        # For now, return a mock response since OpenAI integration needs API key
        mock_analysis = f"Analysis for query: '{request.query}'"
        mock_insights = [
            "Revenue trends show positive growth",
            "Expense optimization opportunities identified",
            "Cash flow analysis indicates healthy liquidity"
        ]
        
        return AIAnalysisResponse(
            query=request.query,
            analysis=mock_analysis,
            insights=mock_insights
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/insights")
async def get_predefined_insights():
    """Get predefined financial insights"""
    return {
        "insights": [
            {
                "title": "Revenue Analysis",
                "description": "Analyze revenue trends and patterns",
                "query": "What are the revenue trends over the last 12 months?"
            },
            {
                "title": "Expense Breakdown",
                "description": "Break down expenses by category",
                "query": "Show me the expense breakdown by category"
            },
            {
                "title": "Profit Margins",
                "description": "Calculate and analyze profit margins",
                "query": "What are the profit margins for each product line?"
            }
        ]
    }
