import { useEffect, useState } from "react"
import { useTheme } from "../../context/ThemeContext"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from "react-router-dom"
export default function ChatSidebar() {
    const { themeStyles } = useTheme()
    const { user } = useAuth()
    const navigate = useNavigate()
    useEffect(() => {
        fetchChats()
    }, [])
    const fetchChats = async () => {
        const response = await fetch("http://localhost:8000/api/chatgroups", {
            headers: {
                Authorization: `Bearer ${user.access_token}`,
            },
        })
        const data = await response.json()
        console.log(data)
    }
    return (
        <aside className={`w-64 p-4 border-r  ${themeStyles.cardBg} ${themeStyles.text} ${themeStyles.border} top-0 `}>
            <h2 className="text-xl font-bold mb-4">Chats</h2>
            <ul>
                <li
                    className="p-2 rounded hover:bg-gray-200 cursor-pointer"
                    onClick={() => navigate('/chat/general')}       
                >   General Chat</li>
                <li
                    className="p-2 rounded hover:bg-gray-200 cursor-pointer"
                    onClick={() => navigate(`/chat/${user.id}`)}       
                >   My Chat</li>
            </ul>
        </aside>
       
    )
}