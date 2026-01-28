import { useState } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"

export default function Signup() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState("worker")
    const [department, setDepartment] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const signup = async () => {
        if (!name || !email || !password || !role) {
            setError("Please fill in all required fields")
            return
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters")
            return
        }

        setLoading(true)
        setError("")

        try {
            await axios.post("http://127.0.0.1:5000/api/auth/signup", {
                name,
                email,
                password,
                role,
                department
            })
            navigate("/")
        } catch (err) {
            console.error("Signup request failed:", err)
            setError(err.response?.data?.msg || "Could not connect to server. Please check if the backend is running.")
        } finally {
            setLoading(false)
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            signup()
        }
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Sign Up</h2>
                {error && <div className="error-message">{error}</div>}

                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                />
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

                <div className="role-selection">
                    <label>Select Role:</label>
                    <div className="radio-group">
                        <label className="radio-label">
                            <input
                                type="radio"
                                value="worker"
                                checked={role === "worker"}
                                onChange={e => setRole(e.target.value)}
                                disabled={loading}
                            />
                            <span>Worker</span>
                        </label>
                        <label className="radio-label">
                            <input
                                type="radio"
                                value="manager"
                                checked={role === "manager"}
                                onChange={e => setRole(e.target.value)}
                                disabled={loading}
                            />
                            <span>Manager</span>
                        </label>
                    </div>
                </div>

                <input
                    type="text"
                    placeholder="Department (optional)"
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                />

                <button onClick={signup} disabled={loading}>
                    {loading ? "Creating account..." : "Sign Up"}
                </button>

                <p className="auth-link">
                    Already have an account? <Link to="/">Login</Link>
                </p>
            </div>
        </div>
    )
}
