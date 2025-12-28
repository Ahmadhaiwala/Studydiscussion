// src/components/layout/Navbar.js
import { Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="flex justify-between items-center px-6 py-3 border-b">
      <h1 className="font-bold">Unified Hub</h1>

      <div className="flex items-center gap-4">
        <Link to="/" className="text-sm opacity-70 hover:opacity-100">
          Home
        </Link>

        <button
          onClick={logout}
          className="text-sm opacity-70 hover:opacity-100 top-4"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}
