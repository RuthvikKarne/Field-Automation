import { useState } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const login = async () => {
    if (!email || !password) {
      setError("Please fill in all fields")  
      return
    }

    setLoading(true)
    setError("")

    try {
      const res = await axios.post("http://127.0.0.1:5000/api/auth/login", {
        email,
        password
      })
      localStorage.setItem("token", res.data.token)
      localStorage.setItem("user", JSON.stringify(res.data.user))
      navigate("/dashboard")
    } catch (err) {
      console.error("Login request failed:", err)
      setError(err.response?.data?.msg || "Could not connect to server. Please check if the backend is running.")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      login()
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />
        <button onClick={login} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="auth-link">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  )
}
