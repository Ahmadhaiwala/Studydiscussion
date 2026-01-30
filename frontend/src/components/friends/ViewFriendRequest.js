import { useEffect, useState } from "react"
import { useAuth } from "../../context/AuthContext"

export default function FriendRequest() {
  const { user } = useAuth()
  const [requests, setRequests] = useState([])
  const [openId, setOpenId] = useState(null)

  useEffect(() => {
    if (!user?.access_token) return
    getFriendRequests()
  }, [user])

  async function getFriendRequests() {
    const response = await fetch("http://localhost:8000/api/friendrequest", {
      headers: { Authorization: `Bearer ${user.access_token}` },
    })

    const data = await response.json()
    if (response.ok) setRequests(data.requests ?? data ?? [])

  }

  async function acceptRequest(id) {
    const res = await fetch(
      `http://localhost:8000/api/friendrequest/accept/${id}`,
      { method: "POST", headers: { Authorization: `Bearer ${user.access_token}` } }
    )
    if (res.ok) getFriendRequests()
  }

  async function rejectRequest(id) {
    await fetch(
      `http://localhost:8000/api/friendrequest/reject/${id}`,
      { method: "POST", headers: { Authorization: `Bearer ${user.access_token}` } }
    )
    getFriendRequests()
  }

  return (
    <div className="border p-4 rounded mb-6">
      <h2 className="text-xl font-bold mb-3">📥 Friend Requests</h2>

      {requests.length === 0 ? (
        <p>No pending requests</p>
      ) : (
        requests.map((req) => (
          <div key={req.user_id} className="border rounded mb-2">


            <div
              className="flex justify-between p-3 cursor-pointer bg-gray-100"
              onClick={() => setOpenId(openId === req.user_id ? null : req.user_id)}
            >
              <span className="font-semibold">{req.name}</span>
              <span>{openId === req.user_id ? "▲" : "▼"}</span>
            </div>

            {/* BODY */}
            {openId === req.user_id && (
              <div className="p-3 bg-white">
                <p className="text-sm text-gray-500 mb-2">
                  Request sent on {new Date(req.created_at).toLocaleDateString()}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => acceptRequest(req.user_id)}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() => rejectRequest(req.user_id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Reject
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}
