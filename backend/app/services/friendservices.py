from app.core.supabase import supabase
from fastapi import HTTPException
from app.schemas.friends import Friend

class Friendservices:
    @staticmethod
    async def addfriend(user_id: str, friend_id: str):
        try:
            existing = (
                supabase
                .table("friends")
                .select("*")
                .or_(
                    f"and(user_id.eq.{user_id},friend_id.eq.{friend_id}),"
                    f"and(user_id.eq.{friend_id},friend_id.eq.{user_id})"
                )
                .execute()
            ).data

            if existing:
                raise HTTPException(400, "Friend request already exists")

            response = (
                supabase
                .table("friend_request")
                .insert({
                    "sender_id": user_id,
                    "receiver_id": friend_id,
                    "status": "pending"
                })
                .execute()
            )


            

            if not response.data:
                raise HTTPException(500, "Failed to send friend request")

            return True

        except Exception as e:
            print("ERROR:", e)
            raise HTTPException(500, "Failed to send friend request")
    @staticmethod
    async def getfriends(user_id: str):
        try:
            rows = (
                supabase
                .table("friends")
                .select("user_id, friend_id, created_at")
                .or_(f"user_id.eq.{user_id},friend_id.eq.{user_id}")
                .execute()
            ).data

            if not rows:
                return []

            friend_ids = [
                r["friend_id"] if r["user_id"] == user_id else r["user_id"]
                for r in rows
            ]

            profiles = (
                supabase
                .table("profiles")
                .select("id, username")
                .in_("id", friend_ids)
                .execute()
            ).data
            print("PROFILES:", profiles)
            profile_map = {p["id"]: p["username"] for p in profiles}
            

            return [
                Friend(
                    user_id=user_id,
                    friend_id=fid,
                    name=profile_map.get(fid, "Unknown"),
                    created_at=next(
                        r["created_at"] for r in rows
                        if (r["user_id"] == user_id and r["friend_id"] == fid)
                        or (r["friend_id"] == user_id and r["user_id"] == fid)
                    )
                )
                for fid in friend_ids
            
            ]

        except Exception as e:
            print("ERROR:", e)
            raise HTTPException(500, "Failed to fetch friends")
    @staticmethod
    async def unfriend(user_id: str, friend_id: str):
        try:
            response = (
                supabase
                .table("friends")
                .delete()
                .or_(
                    f"and(user_id.eq.{user_id},friend_id.eq.{friend_id}),"
                    f"and(user_id.eq.{friend_id},friend_id.eq.{user_id})"
                )
                .execute()
            )

            if not response.data:
                raise HTTPException(500, "Failed to unfriend user")

            return True

        except Exception as e:
            print("ERROR:", e)
            raise HTTPException(500, "Failed to unfriend user")
    @staticmethod
    async def searchfriends(query: str):
        try:
            rows = (
                supabase
                .table("profiles")
                .select("id, username")
                .ilike("username", f"%{query}%")
                .execute()
            ).data

            return [
                Friend(
                    user_id=None,
                    friend_id=r["id"],
                    name=r["username"]
                )
                for r in rows
            ]

        except Exception as e:
            print("ERROR:", e)
            raise HTTPException(500, "Failed to search friends")
    

