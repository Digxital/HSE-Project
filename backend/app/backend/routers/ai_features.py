import logging
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from dependencies.auth import get_current_user
from schemas.auth import UserResponse
from services.aihub import AIHubService
from schemas.aihub import GenTxtRequest, ChatMessage

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1/ai", tags=["ai"])


class SuggestCategoryRequest(BaseModel):
    description: str
    category_options: list[str] = [
        "Unsafe Act",
        "Unsafe Condition",
        "Near Miss",
        "Environmental Hazard",
        "Stop Work Authority",
    ]
    severity_options: list[str] = ["Low", "Medium", "High", "Critical"]


class SuggestCategoryResponse(BaseModel):
    suggested_category: str
    suggested_severity: str
    confidence: str


class GenerateSummaryRequest(BaseModel):
    hazards_count: int
    incidents_count: int
    open_actions: int
    overdue_actions: int
    recent_trends: str


class GenerateSummaryResponse(BaseModel):
    summary: str


class DetectDuplicateRequest(BaseModel):
    description: str
    existing_descriptions: list[str]


class DetectDuplicateResponse(BaseModel):
    is_duplicate: bool
    similar_report_index: int = None
    confidence: str


@router.post("/suggest-category", response_model=SuggestCategoryResponse)
async def suggest_category(
    data: SuggestCategoryRequest,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Use AI to suggest hazard category and severity based on description"""
    try:
        aihub_service = AIHubService()

        prompt = f"""Based on the following hazard description, suggest the most appropriate category and severity level.

Description: {data.description}

Available Categories: {', '.join(data.category_options)}
Available Severity Levels: {', '.join(data.severity_options)}

Respond in JSON format:
{{
    "category": "selected category",
    "severity": "selected severity",
    "confidence": "high/medium/low"
}}"""

        request = GenTxtRequest(
            messages=[
                ChatMessage(role="system", content="You are a safety expert analyzing hazard reports."),
                ChatMessage(role="user", content=prompt),
            ],
            model="gemini-2.5-pro",
        )

        response = await aihub_service.gentxt(request)
        
        # Parse AI response
        import json
        result = json.loads(response.content)

        return SuggestCategoryResponse(
            suggested_category=result.get("category", "Unsafe Condition"),
            suggested_severity=result.get("severity", "Medium"),
            confidence=result.get("confidence", "medium"),
        )

    except Exception as e:
        logger.error(f"AI category suggestion error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to suggest category: {str(e)}")


@router.post("/generate-summary", response_model=GenerateSummaryResponse)
async def generate_summary(
    data: GenerateSummaryRequest,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Generate AI-powered dashboard summary and insights"""
    try:
        aihub_service = AIHubService()

        prompt = f"""Generate a concise executive summary for an HSE dashboard with the following data:

- Total Hazards Reported: {data.hazards_count}
- Total Incidents: {data.incidents_count}
- Open Actions: {data.open_actions}
- Overdue Actions: {data.overdue_actions}
- Recent Trends: {data.recent_trends}

Provide:
1. Overall safety performance assessment (2-3 sentences)
2. Key concerns that need immediate attention (1-2 items)
3. Positive trends or improvements (1 item)

Keep it professional, actionable, and under 150 words."""

        request = GenTxtRequest(
            messages=[
                ChatMessage(
                    role="system",
                    content="You are an HSE manager providing executive summaries for oil & gas operations.",
                ),
                ChatMessage(role="user", content=prompt),
            ],
            model="gemini-2.5-pro",
        )

        response = await aihub_service.gentxt(request)

        return GenerateSummaryResponse(summary=response.content)

    except Exception as e:
        logger.error(f"AI summary generation error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate summary: {str(e)}")


@router.post("/detect-duplicate", response_model=DetectDuplicateResponse)
async def detect_duplicate(
    data: DetectDuplicateRequest,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Detect if a hazard report is a duplicate of existing reports"""
    try:
        if not data.existing_descriptions:
            return DetectDuplicateResponse(is_duplicate=False, confidence="high")

        aihub_service = AIHubService()

        existing_list = "\n".join([f"{i+1}. {desc}" for i, desc in enumerate(data.existing_descriptions)])

        prompt = f"""Analyze if the new hazard report is a duplicate or very similar to any existing reports.

New Report: {data.description}

Existing Reports:
{existing_list}

Respond in JSON format:
{{
    "is_duplicate": true/false,
    "similar_report_index": index number (1-based) or null,
    "confidence": "high/medium/low"
}}"""

        request = GenTxtRequest(
            messages=[
                ChatMessage(
                    role="system",
                    content="You are a safety analyst detecting duplicate hazard reports.",
                ),
                ChatMessage(role="user", content=prompt),
            ],
            model="gemini-2.5-pro",
        )

        response = await aihub_service.gentxt(request)

        # Parse AI response
        import json
        result = json.loads(response.content)

        return DetectDuplicateResponse(
            is_duplicate=result.get("is_duplicate", False),
            similar_report_index=result.get("similar_report_index"),
            confidence=result.get("confidence", "medium"),
        )

    except Exception as e:
        logger.error(f"AI duplicate detection error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to detect duplicate: {str(e)}")