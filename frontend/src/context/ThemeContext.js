'use client';

import { createContext, useContext, useEffect, useState } from "react"

const ThemeContext = createContext(null)
const interactions = {
  buttonBase: `
    relative overflow-hidden
    transition-all duration-300 ease-out
    hover:-translate-y-[1px]
    active:scale-[0.97]
    focus:outline-none focus:ring-2
  `,

  glowSweep: `
    before:absolute before:inset-0
    before:bg-gradient-to-r
    before:from-transparent before:via-white/20 before:to-transparent
    before:translate-x-[-120%]
    hover:before:translate-x-[120%]
    before:transition-transform before:duration-700
  `,
}

const themes = {
  day: {
    name: "Day",
    bg: "bg-slate-50",
    secondbar: "bg-slate-100",
    cardBg: "bg-white",
    text: "text-slate-900",
    accent: "text-slate-600",
    border: "border-slate-200",

    button: `
      ${interactions.buttonBase}
      bg-slate-900 text-white
      hover:bg-slate-800
      shadow-sm hover:shadow-lg
    `,

    input: `
      border-slate-300 bg-white text-slate-900
      focus:ring-blue-500 focus:border-blue-500
      transition
    `,

    themeButton: `
      ${interactions.buttonBase}
      bg-slate-200 text-slate-900
      hover:bg-slate-300
    `,
  },

  night: {
    name: "Night",
    bg: "bg-slate-950",
    secondbar: "bg-slate-800",
    cardBg: "bg-slate-900",
    text: "text-slate-50",
    accent: "text-slate-400",
    border: "border-slate-700",

    button: `
      ${interactions.buttonBase}
      ${interactions.glowSweep}
      bg-white text-slate-900
      hover:bg-slate-100
      shadow hover:shadow-xl
    `,

    input: `
      border-slate-700 bg-slate-900 text-slate-50
      focus:ring-blue-400 focus:border-blue-400
      transition
    `,

    themeButton: `
      ${interactions.buttonBase}
      bg-slate-800 text-slate-50
      hover:bg-slate-700
    `,
  },

  elegant: {
    name: "Elegant",
    bg: "bg-stone-50",
    secondbar: "bg-stone-100",
    cardBg: "bg-white",
    text: "text-stone-900",
    accent: "text-stone-600",
    border: "border-stone-300",

    button: `
      ${interactions.buttonBase}
      bg-stone-900 text-stone-50
      hover:bg-stone-800
      shadow-md hover:shadow-2xl
    `,

    input: `
      border-stone-300 bg-white text-stone-900
      focus:ring-amber-500 focus:border-amber-500
      transition
    `,

    themeButton: `
      ${interactions.buttonBase}
      bg-stone-200 text-stone-900
      hover:bg-stone-300
    `,
  },

  neo: {
    name: "Neo",
    bg: "bg-[#0b0e14]",
    secondbar: "bg-[#121726]",
    cardBg: "bg-[#161b2e]/80 backdrop-blur-md",
    text: "text-slate-100",
    accent: "text-indigo-400",
    border: "border-white/10",

    button: `
      ${interactions.buttonBase}
      ${interactions.glowSweep}
      bg-indigo-500/90 text-white
      hover:bg-indigo-400
      shadow-[0_6px_30px_rgba(99,102,241,0.35)]
      hover:shadow-[0_12px_50px_rgba(99,102,241,0.55)]
    `,

    input: `
      border-white/10 bg-white/5 text-slate-100
      placeholder:text-slate-400
      focus:ring-indigo-500/60 focus:border-indigo-500/60
      transition
    `,

    themeButton: `
      ${interactions.buttonBase}
      bg-white/5 text-slate-100
      hover:bg-white/10
    `,
  },

  anime: {
    name: "Anime",
    bg: "bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]",
    secondbar: "bg-black/20",
    cardBg: "bg-white/10 backdrop-blur-lg",
    text: "text-white",
    accent: "text-pink-400",
    border: "border-white/10",

    button: `
      ${interactions.buttonBase}
      ${interactions.glowSweep}
      bg-pink-500 text-white
      hover:bg-pink-400
      shadow-[0_0_30px_rgba(236,72,153,0.5)]
    `,

    input: `
      border-white/20 bg-black/30 text-white
      focus:ring-pink-400 focus:border-pink-400
      transition
    `,

    themeButton: `
      ${interactions.buttonBase}
      bg-white/10 text-white
      hover:bg-white/20
    `,
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
                            