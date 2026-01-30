import { useState, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"

export default function ConversationList({ onSelectConversation, selectedConversationId, refreshTrigger }) {
    const { user } = useAuth()
    const [conversations, setConversations] = useState([])

    useEffect(() => {
        if (user?.access_token) {
            fetchConversations()
            // Poll for conversation list updates every 5 seconds
            const interval = setInterval(fetchConversations, 5000)
            return () => clearInterval(interval)
        }
    }, [user, refreshTrigger])

    async function fetchConversations() {
        if (!user?.access_token) return

        try {
            console.log("Fetching conversations...")
            const response = await fetch("http://localhost:8000/api/chat/conversations", {
                headers: { Authorization: `Bearer ${user.access_token}` },
            })

            console.log("Response status:", response.status)

            if (response.ok) {
                const data = await response.json()
                console.log("Conversations data:", data)
                console.log("Conversations array:", data.conversations)
                console.log("Conversations length:", data.conversations?.length)
                setConversations(data.conversations || [])
            } else {
                const errorText = await response.text()
                console.error("Failed to fetch conversations:", response.status, errorText)
            }
        } catch (error) {
            console.error("Failed to fetch conversations:", error)
        }
    }

    return (
        <div className="border-r h-full overflow-y-auto">
            <div className="bg-gray-100 p-4 border-b">
                <h2 className="text-xl font-bold">Messages</h2>
                <p className="text-xs text-gray-500">({conversations.length} conversations)</p>
            </div>

            <div className="divide-y">
                {conversations.length === 0 ? (
                    <div className="p-4 text-gray-500 text-center">
                        <p>No conversations yet.</p>
                        <p className="text-sm mt-2">Start chatting with a friend!</p>
                    </div>
                ) : (
                    conversations.map((conv) => (
                        <div
                            key={conv.id}
                            onClick={() => onSelectConversation(conv.id, conv.participant.username)}
                            className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selectedConversationId === conv.id ? "bg-blue-50 border-l-4 border-blue-500" : ""
                                }`}
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold">{conv.participant.username}</h3>
                                        {conv.unread_count > 0 && (
                                            <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                                                {conv.unread_count}
                                            </span>
                                        )}
                                    </div>
                                    {conv.last_message && (
                                        <p className="text-sm text-gray-600 truncate mt-1">
                                            {conv.last_message.content}
                                        </p>
                                    )}
                                </div>
                                {conv.last_message && (
                                    <span className="text-xs text-gray-400 ml-2">
                                        {new Date(conv.last_message.created_at).toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
