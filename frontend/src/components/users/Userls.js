import { useEffect, useState } from "react"
import { useAuth } from "../../context/AuthContext"

export default function Userls() {
  const [users, setUsers] = useState([])
  const { user } = useAuth()
  console.log(user)

  useEffect(() => {
    if (!user?.access_token) return
    getAllUsers()
  }, [user])

  async function getAllUsers() {
    const response = await fetch("http://localhost:8000/api/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.access_token}`,
      },
    })

    const data = await response.json()
    setUsers(Array.isArray(data) ? data : data.users)
  }
  const viewprofile = (userid) => {
    console.log('user called for')
    
  }
  const addfriend = async (userid) => {
    const response = await fetch(`http://localhost:8000/api/friends/${userid}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.access_token}`,
      },
    })
    if (response.ok) {
      console.log("Friend request sent to user ID:", userid)
    } else {
      console.error("Failed to send friend request to user ID:", userid)
    }
  }

  return (
    <>
      {users.map(u => (
        <div key={u.id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
          <h2>{u.username}</h2>
          {u.email && <p>Email: {u.email}</p>}
          {u.bio && <p>Bio: {u.bio}</p>}
          <p>Joined: {new Date(u.created_at).toLocaleDateString()}</p>
          {user.user.id !== u.id && (
  <>
    <button onClick={() => viewprofile(u.id)}>View Profile</button>
    <button onClick={() => addfriend(u.id)}>Add Friend</button>
  </>
)}

         
        </div>
      ))}
    </>
  )
}
