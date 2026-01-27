from fastapi import APIRouter, Depends
from app.core.security import get_current_user
from app.schemas.friends import Friend
from app.services.friendservices import Friendservices
router = APIRouter()
@router.get("/friends", response_model=list[Friend])
async def get_friends(current_user=Depends(get_current_user)):
    
    return await Friendservices.getfriends(current_user.id)
@router.delete("/friends/{friend_id}")
async def unfriend(friend_id: str, current_user=Depends(get_current_user)):
    
    await Friendservices.unfriend(current_user.id, friend_id)
    return 
@router.post("/friends/{friend_id}")
async def add_friend(friend_id: str, current_user=Depends(get_current_user)):
    print('method called')
    await Friendservices.addfriend(current_user.id, friend_id)
    return
