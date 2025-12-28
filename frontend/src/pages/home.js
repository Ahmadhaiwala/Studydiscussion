import { useAuth } from "../context/AuthContext"
import { useEffect } from "react"
import AppLayout from "../components/layout/Applayout"

export default function Home() {
  const { user, loading } = useAuth()
  


  const fetchProfile = async () => {
    console.log("Fetching profile...")
    console.log("User object:", user)
    console.log("Current session:", user?.access_token)
    if (!user?.access_token) {
      console.log("No access token available")
      return
    }
  
    const response = await fetch("http://localhost:8000/api/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.access_token}`,
      },
    })
    
    
    console.log("Response status:", response.status)

    const data = await response.json()
    console.log("Profile data:", data)
  }
  useEffect(() => {
    if (user?.access_token) {
      fetchProfile()
    }
  }, [user?.access_token])

  if (loading) return <p>Loading...</p>

  return (
    <AppLayout>
      <div className="text-center mt-10">
        <h1 className="text-3xl font-bold mb-4">Welcome to the Home Page</h1>
        {user ? (
          <p className="text-lg">Hello, {user.email}!</p>
        ) : (
          <p className="text-lg">You are not logged in.</p>
        )}
      </div>
    </AppLayout>
  )
}
