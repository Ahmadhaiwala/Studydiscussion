import { useState } from "react"
import { supabase } from "../../lib/supabase"
import { useTheme } from "../../context/ThemeContext"

export default function Signup() {
    const { themeStyles } = useTheme()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const handleSignup = async (e) => {
        e.preventDefault()
        setError("")
        setSuccess("")

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters")
            return
        }

        setLoading(true)

        const { error } = await supabase.auth.signUp({
            email,
            password,
        })

        setLoading(false)

        if (error) {
            setError(error.message)
        } else {
            setSuccess("Check your email to verify your account")
        }
    }

    const signupWithProvider = async (provider) => {
        await supabase.auth.signInWithOAuth({
            provider,
        })
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Sign Up</h2>

            {error && (
                <p className="text-red-500 text-sm mb-3">{error}</p>
            )}

            {success && (
                <p className="text-green-500 text-sm mb-3">{success}</p>
            )}

            <form onSubmit={handleSignup} className="space-y-4">
                <input
                    type="email"
                    placeholder="Email"
                    className={`w-full px-3 py-2 rounded-md border ${themeStyles.input}`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    className={`w-full px-3 py-2 rounded-md border ${themeStyles.input}`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Confirm Password"
                    className={`w-full px-3 py-2 rounded-md border ${themeStyles.input}`}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 rounded-md transition ${themeStyles.button}`}
                >
                    {loading ? "Creating account..." : "Sign Up"}
                </button>
            </form>

            {/* OAuth signup */}
            <div className="mt-4 space-y-2">
                <button
                    onClick={() => signupWithProvider("google")}
                    className={`w-full py-2 rounded-md border ${themeStyles.themeButton}`}
                >
                    Sign up with Google
                </button>

                <button
                    onClick={() => signupWithProvider("github")}
                    className={`w-full py-2 rounded-md border ${themeStyles.themeButton}`}
                >
                    Sign up with GitHub
                </button>
            </div>
        </div>
    )
}
