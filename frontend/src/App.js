import { useAuth } from "./context/AuthContext"
import Auth from "./pages/Auth"
import Home from "./pages/home"
import Loading from "./components/Loading"
import { ThemeProvider } from "./context/ThemeContext"

export default function App() {
  const { user, loading } = useAuth()

  if (loading) return <ThemeProvider>  <Loading /></ThemeProvider>

  return user ? <ThemeProvider><Home /></ThemeProvider> : <ThemeProvider><Auth /></ThemeProvider>
}
