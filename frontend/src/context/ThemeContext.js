import { createContext, useContext, useEffect, useState } from "react"

const ThemeContext = createContext(null)

const themes = {
    day: {
        name: "Day",
        bg: "bg-white",
        cardBg: "bg-gray-50",
        text: "text-black",
        accent: "text-gray-600",
        border: "border-black",
        button: "bg-black text-white hover:bg-gray-800",
        input: "border-black bg-white text-black focus:ring-black",
        themeButton: "bg-gray-200 hover:bg-gray-300 text-black",
    },
    night: {
        name: "Night",
        bg: "bg-black",
        cardBg: "bg-gray-900",
        text: "text-white",
        accent: "text-blue-400",
        border: "border-white",
        button: "bg-white text-black hover:bg-gray-200",
        input: "border-white bg-black text-white focus:ring-white",
        themeButton: "bg-gray-800 hover:bg-gray-700 text-white",
    },
    coffee: {
        name: "Coffee",
        bg: "bg-amber-50",
        cardBg: "bg-amber-100",
        text: "text-amber-900",
        accent: "text-amber-700",
        border: "border-amber-900",
        button: "bg-amber-900 text-amber-50 hover:bg-amber-800",
        input: "border-amber-900 bg-amber-50 text-amber-900 focus:ring-amber-900",
        themeButton: "bg-amber-200 hover:bg-amber-300 text-amber-900",
    },
    sakura: {
        name: "Sakura",
        bg: "bg-pink-50",
        cardBg: "bg-pink-100",
        text: "text-pink-900",
        accent: "text-pink-700",
        border: "border-pink-900",
        button: "bg-pink-900 text-pink-50 hover:bg-pink-800",
        input: "border-pink-900 bg-pink-50 text-pink-900 focus:ring-pink-900",
        themeButton: "bg-pink-200 hover:bg-pink-300 text-pink-900",
    },
    cyberpunk: {
        name: "Cyberpunk",
        bg: "bg-gray-900",
        cardBg: "bg-black",
        text: "text-green-400",
        accent: "text-cyan-400",
        border: "border-green-400",
        button: "bg-green-400 text-black hover:bg-green-300",
        input: "border-green-400 bg-black text-green-400 focus:ring-green-400",
        themeButton: "bg-gray-800 hover:bg-gray-700 text-green-400",
    },
}

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("theme") || "day"
    })

    useEffect(() => {
        if (!themes[theme]) return
        localStorage.setItem("theme", theme)
    }, [theme])

    return (
        <ThemeContext.Provider
            value={{
                theme,
                setTheme,
                themeStyles: themes[theme],
                themes,
            }}
        >
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)

    if (!context) {
        throw new Error("useTheme must be used inside ThemeProvider")
    }

    return context
}
