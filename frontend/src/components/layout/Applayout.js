import Navbar from "./Navbar"
import { useTheme } from "../../context/ThemeContext"
import { useAuth } from "../../context/AuthContext"
import Sidebar from "../Sidebar"
// src/components/layout/AppLayout.js
export default function AppLayout({ children }) {
    const { user, logout } = useAuth()

    const { theme, setTheme, themeStyles, themes } = useTheme()
    return (

        <div className={`min-h-screen flex flex-col ${themeStyles.bg} ${themeStyles.text}`}>

            <Navbar />
            <Sidebar />
            <div className=" flex flex-row justify-between items-center p-4">
            </div>
            <div className="absolute top-4 right-4 flex gap-2 flex-wrap">
                {Object.keys(themes).map((key) => (
                    <button
                        key={key}
                        onClick={() => setTheme(key)}
                        className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-200
              hover:scale-105
              ${theme === key ? themeStyles.button : themeStyles.themeButton}`}
                    >
                        {themes[key].name}
                    </button>
                ))}
            </div>
            <button
                onClick={logout}
                className="text-sm opacity-70 hover:opacity-100 "
            >
                Logout
            </button>


            <main className="flex-1 p-4">
                {children}
            </main>

        </div>
    )
}