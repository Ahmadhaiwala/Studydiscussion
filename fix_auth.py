import os

file_path = r"c:\Users\haiwa\fsd1\project1\backend\core\security.py"
content = """# backend/core/security.py

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from supabase import create_client
import os

security = HTTPBearer()

# Initialize Supabase client for authentication verification
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://jlznjylmntyzepvufkja.supabase.co")
# FIXED: Use correct environment variable name
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    token = credentials.credentials

    try:
        # Use Supabase client to verify the token
        user_response = supabase.auth.get_user(token)
        
        if not user_response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
            )

        # Return the user ID
        return user_response.user.id

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication failed: {str(e)}",
        )
"""

try:
    with open(file_path, "w") as f:
        f.write(content)
    print("Successfully updated security.py")
except Exception as e:
    print(f"Error updating file: {e}")
