from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from app.core.security import get_current_user
from app.schemas.chat import MessageCreate, Message, ConversationListOut, ConversationDetail
from app.services.chatservices import ChatService
from typing import List, Dict
import json

router = APIRouter()

# Store active WebSocket connections
class ConnectionManager:
    def __init__(self):
        # Map of user_id -> WebSocket connection
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, user_id: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[user_id] = websocket
        print(f"User {user_id} connected. Total connections: {len(self.active_connections)}")

    def disconnect(self, user_id: str):
        if user_id in self.active_connections:
            del self.active_connections[user_id]
            print(f"User {user_id} disconnected. Total connections: {len(self.active_connections)}")

    async def send_personal_message(self, message: dict, user_id: str):
        if user_id in self.active_connections:
            try:
                await self.active_connections[user_id].send_json(message)
            except Exception as e:
                print(f"Error sending message to {user_id}: {e}")

manager = ConnectionManager()

@router.websocket("/ws/chat/{token}")
async def websocket_endpoint(websocket: WebSocket, token: str):
    """WebSocket endpoint for real-time chat"""
    from app.core.supabase import supabase
    
    # Verify token and get user
    try:
        user_response = supabase.auth.get_user(token)
        if not user_response.user:
            await websocket.close(code=1008)
            return
        user_id = user_response.user.id
    except Exception as e:
        print(f"WebSocket auth error: {e}")
        await websocket.close(code=1008)
        return
    
    await manager.connect(user_id, websocket)
    
    try:
        while True:
            # Receive message from client
            data = await websocket.receive_json()
            
            action = data.get("action")
            
            if action == "send_message":
                conversation_id = data.get("conversation_id")
                content = data.get("content")
                
                # Save message to database
                message = await ChatService.send_message(conversation_id, user_id, content)
                
                # Get the other participant
                conversation = await ChatService.get_conversation_details(conversation_id, user_id)
                other_user_id = (
                    conversation["participant2_id"] 
                    if conversation["participant1_id"] == user_id 
                    else conversation["participant1_id"]
                )
                
                # Send to both users
                message_data = {
                    "type": "new_message",
                    "message": {
                        "id": str(message.id),
                        "conversation_id": str(message.conversation_id),
                        "sender_id": str(message.sender_id),
                        "content": message.content,
                        "created_at": message.created_at.isoformat(),
                        "read_at": message.read_at.isoformat() if message.read_at else None
                    }
                }
                
                # Send to sender
                await manager.send_personal_message(message_data, user_id)
                
                # Send to receiver
                await manager.send_personal_message(message_data, str(other_user_id))
            
            elif action == "mark_read":
                conversation_id = data.get("conversation_id")
                await ChatService.mark_messages_as_read(conversation_id, user_id)
                
    except WebSocketDisconnect:
        manager.disconnect(user_id)
    except Exception as e:
        print(f"WebSocket error: {e}")
        manager.disconnect(user_id)

@router.get("/chat/conversations", response_model=ConversationListOut)
async def get_conversations(current_user=Depends(get_current_user)):
    """Get all conversations for the current user"""
    return await ChatService.get_user_conversations(current_user.id)

@router.post("/chat/conversations/{friend_id}", response_model=ConversationDetail)
async def start_conversation(friend_id: str, current_user=Depends(get_current_user)):
    """Start or get existing conversation with a friend"""
    return await ChatService.get_or_create_conversation(current_user.id, friend_id)

@router.get("/chat/conversations/{conversation_id}/messages", response_model=List[Message])
async def get_messages(conversation_id: str, current_user=Depends(get_current_user)):
    """Get all messages in a conversation"""
    return await ChatService.get_conversation_messages(conversation_id, current_user.id)

@router.post("/chat/conversations/{conversation_id}/messages", response_model=Message)
async def send_message(
    conversation_id: str, 
    message: MessageCreate,
    current_user=Depends(get_current_user)
):
    """Send a message in a conversation"""
    return await ChatService.send_message(conversation_id, current_user.id, message.content)

@router.put("/chat/conversations/{conversation_id}/read")
async def mark_as_read(conversation_id: str, current_user=Depends(get_current_user)):
    """Mark all messages in a conversation as read"""
    await ChatService.mark_messages_as_read(conversation_id, current_user.id)
    return {"message": "Messages marked as read"}
