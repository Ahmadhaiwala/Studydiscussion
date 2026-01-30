import { useState } from "react"
import ConversationList from "../components/chat/ConversationList"
import ChatWindow from "../components/chat/ChatWindow"
import FriendListForChat from "../components/chat/FriendListForChat"

export default function Chat() {
    const [selectedConversation, setSelectedConversation] = useState(null)
    const [selectedFriendName, setSelectedFriendName] = useState("")
    const [showFriendList, setShowFriendList] = useState(false)
    const [refreshTrigger, setRefreshTrigger] = useState(0)

    function handleSelectConversation(conversationId, friendName) {
        setSelectedConversation(conversationId)
        setSelectedFriendName(friendName)
        setShowFriendList(false)
    }

    function handleSelectFriend(conversationId, friendName) {
        setSelectedConversation(conversationId)
        setSelectedFriendName(friendName)
        setShowFriendList(false)
        // Trigger refresh to show new conversation in list
        setRefreshTrigger(prev => prev + 1)
    }

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-8rem)] bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Conversation List Sidebar */}
            <div className="w-full lg:w-80 border-r flex flex-col">
                <ConversationList
                    onSelectConversation={handleSelectConversation}
                    selectedConversationId={selectedConversation}
                    refreshTrigger={refreshTrigger}
                />
                <button
                    onClick={() => setShowFriendList(!showFriendList)}
                    className="p-4 bg-blue-500 text-white hover:bg-blue-600 transition-colors font-medium"
                >
                    {showFriendList ? "← Back to Conversations" : "+ Start New Chat"}
                </button>
            </div>

            {/* Chat Window */}
            <div className="flex-1 flex flex-col">
                {showFriendList ? (
                    <FriendListForChat onSelectFriend={handleSelectFriend} />
                ) : (
                    <ChatWindow
                        conversationId={selectedConversation}
                        friendName={selectedFriendName}
                        onMessageSent={() => setRefreshTrigger(prev => prev + 1)}
                    />
                )}
            </div>
        </div>
    )
}
