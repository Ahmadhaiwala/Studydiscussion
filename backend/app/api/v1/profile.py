# app/api/v1/profile.py

from fastapi import APIRouter, Depends, HTTPException
from app.core.security import get_current_user
from app.core.supabase import supabase
from app.schemas.profile import ProfileResponse

router = APIRouter()


@router.get("/profile", response_model=ProfileResponse)
async def get_profile(current_user=Depends(get_current_user)):
    """
    Get the current user's profile from the profiles table
    """
    try:
        # Fetch profile from Supabase
        response = supabase.table("profiles").select("*").eq("id", current_user.id).execute()
        
        if not response.data or len(response.data) == 0:
            raise HTTPException(
                status_code=404,
                detail="Profile not found"
            )
        
        profile = response.data[0]
        return ProfileResponse(**profile)
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch profile: {str(e)}"
        )
