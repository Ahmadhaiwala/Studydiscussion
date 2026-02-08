"""
AI Chat API Endpoints
"""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.core.security import get_current_user
from app.services.ai_chat_service import ai_chat_service
from typing import Optional

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    group_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    timestamp: str
    error: bool

@router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(
    request: ChatRequest,
    current_user = Depends(get_current_user)
):
    """
    Send a message to the AI assistant and get a response
    """
    try:
        user_id = current_user.id
        
        result = await ai_chat_service.chat(
            user_id=user_id,
            message=request.message,
            group_id=request.group_id
        )
        
        return ChatResponse(**result)
        
    except Exception as e:
        print(f"AI Chat endpoint error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process AI chat: {str(e)}"
        )

@router.get("/chat/history")
async def get_chat_history(
    limit: int = 20,
    group_id: Optional[str] = None,
    current_user = Depends(get_current_user)
):
    """
    Get AI chat history for the current user, optionally filtered by group
    """
    try:
        user_id = current_user.id
        
        # Get history from service with optional group_id filter
        history = await ai_chat_service._get_conversation_history(user_id, limit, group_id)
        
        return {
            "count": len(history),
            "messages": history
        }
        
    except Exception as e:
        print(f"Get history error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch chat history: {str(e)}"
        )
