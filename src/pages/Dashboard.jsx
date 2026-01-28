import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import TaskCard from "../components/TaskCard"
import TaskModal from "../components/TaskModal"
import StatsCard from "../components/StatsCard"

export default function Dashboard() {
    const [tasks, setTasks] = useState([])
    const [stats, setStats] = useState(null)
    const [workers, setWorkers] = useState([])
    const [user, setUser] = useState(null)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [filterStatus, setFilterStatus] = useState("all")
    const [filterPriority, setFilterPriority] = useState("all")
    const navigate = useNavigate()

    const token = localStorage.getItem("token")

    useEffect(() => {
        const userData = localStorage.getItem("user")
        if (userData) {
            setUser(JSON.parse(userData))
        }
        fetchTasks()
        fetchStats()
    }, [])

    useEffect(() => {
        if (user?.role === "manager") {
            fetchWorkers()
        }
    }, [user])

    const fetchTasks = async () => {
        try {
            setLoading(true)
            const res = await axios.get("http://127.0.0.1:5000/api/tasks", {
                headers: { Authorization: `Bearer ${token}` }
            })
            setTasks(res.data)
            setError("")
        } catch (err) {
            if (err.response?.status === 401) {
                localStorage.removeItem("token")
                localStorage.removeItem("user")
                navigate("/")
            } else {
                setError("Failed to load tasks")
            }
        } finally {
            setLoading(false)
        }
    }

    const fetchStats = async () => {
        try {
            const res = await axios.get("http://127.0.0.1:5000/api/tasks/stats", {
                headers: { Authorization: `Bearer ${token}` }
            })
            setStats(res.data)
        } catch (err) {
            console.error("Failed to fetch stats:", err)
        }
    }

    const fetchWorkers = async () => {
        try {
            const res = await axios.get("http://127.0.0.1:5000/api/users/workers", {
                headers: { Authorization: `Bearer ${token}` }
            })
            setWorkers(res.data)
        } catch (err) {
            console.error("Failed to fetch workers:", err)
        }
    }

    const handleStatusUpdate = async (taskId, newStatus) => {
        try {
            await axios.patch(
                `http://127.0.0.1:5000/api/tasks/${taskId}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            fetchTasks()
            fetchStats()
        } catch (err) {
            setError("Failed to update task status")
        }
    }

    const handleViewDetails = (task) => {
        // For now, just log. You can create a TaskDetails modal later
        console.log("View task details:", task)
    }

    const logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        navigate("/")
    }

    const getFilteredTasks = () => {
        return tasks.filter(task => {
            const statusMatch = filterStatus === "all" || task.status === filterStatus
            const priorityMatch = filterPriority === "all" || task.priority === filterPriority
            return statusMatch && priorityMatch
        })
    }

    const filteredTasks = getFilteredTasks()

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <div>
                    <h2>Dashboard</h2>
                    {user && (
                        <p className="user-info">
                            Welcome, {user.name} ({user.role})
                            {user.department && ` - ${user.department}`}
                        </p>
                    )}
                </div>
                <button onClick={logout} className="logout-btn">Logout</button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {/* Statistics */}
            {stats && (
                <div className="stats-grid">
                    <StatsCard
                        title="Total Tasks"
                        value={stats.total}
                        icon="📋"
                        color="#667eea"
                        onClick={() => setFilterStatus("all")}
                    />
                    <StatsCard
                        title="In Progress"
                        value={stats.inProgress}
                        icon="⚡"
                        color="#3b82f6"
                        onClick={() => setFilterStatus("in-progress")}
                    />
                    <StatsCard
                        title="Completed"
                        value={stats.completed}
                        icon="✅"
                        color="#10b981"
                        onClick={() => setFilterStatus("completed")}
                    />
                    <StatsCard
                        title="Pending"
                        value={stats.pending}
                        icon="⏳"
                        color="#f59e0b"
                        onClick={() => setFilterStatus("pending")}
                    />
                    {stats.overdue > 0 && (
                        <StatsCard
                            title="Overdue"
                            value={stats.overdue}
                            icon="⚠️"
                            color="#ef4444"
                        />
                    )}
                </div>
            )}

            {/* Filters and Actions */}
            <div className="dashboard-controls">
                <div className="filters">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="blocked">Blocked</option>
                    </select>

                    <select
                        value={filterPriority}
                        onChange={(e) => setFilterPriority(e.target.value)}
                        className="filter-select"
                    >
                        <option value="all">All Priority</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                    </select>
                </div>

                {user?.role === "manager" && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn-primary"
                    >
                        + Create Task
                    </button>
                )}
            </div>

            {/* Tasks Grid */}
            {loading ? (
                <p className="loading">Loading tasks...</p>
            ) : filteredTasks.length === 0 ? (
                <div className="no-tasks">
                    <p>No tasks found.</p>
                    {user?.role === "manager" && (
                        <button onClick={() => setIsModalOpen(true)} className="btn-primary">
                            Create Your First Task
                        </button>
                    )}
                </div>
            ) : (
                <div className="tasks-grid">
                    {filteredTasks.map(task => (
                        <TaskCard
                            key={task._id}
                            task={task}
                            onStatusUpdate={handleStatusUpdate}
                            onViewDetails={handleViewDetails}
                            userRole={user?.role}
                        />
                    ))}
                </div>
            )}

            {/* Task Creation Modal */}
            {user?.role === "manager" && (
                <TaskModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onTaskCreated={() => {
                        fetchTasks()
                        fetchStats()
                    }}
                    workers={workers}
                />
            )}
        </div>
    )
}
