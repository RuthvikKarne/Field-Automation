import { useState, useEffect } from "react"
import axios from "axios"

export default function TaskModal({ isOpen, onClose, onTaskCreated, workers }) {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [priority, setPriority] = useState("medium")
    const [assignedTo, setAssignedTo] = useState("")
    const [dueDate, setDueDate] = useState("")
    const [estimatedHours, setEstimatedHours] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const resetForm = () => {
        setTitle("")
        setDescription("")
        setPriority("medium")
        setAssignedTo("")
        setDueDate("")
        setEstimatedHours("")
        setError("")
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!title.trim()) {
            setError("Task title is required")
            return
        }

        setLoading(true)
        setError("")

        try {
            const token = localStorage.getItem("token")
            await axios.post(
                "http://127.0.0.1:5000/api/tasks",
                {
                    title,
                    description,
                    priority,
                    assignedTo: assignedTo || null,
                    dueDate: dueDate || null,
                    estimatedHours: estimatedHours ? parseFloat(estimatedHours) : 0
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            )

            resetForm()
            onTaskCreated()
            onClose()
        } catch (err) {
            setError(err.response?.data?.msg || "Failed to create task")
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Create New Task</h2>
                    <button className="modal-close" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label>Task Title *</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter task title"
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter task description"
                            rows="4"
                            disabled={loading}
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Priority</label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                disabled={loading}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Assign To</label>
                            <select
                                value={assignedTo}
                                onChange={(e) => setAssignedTo(e.target.value)}
                                disabled={loading}
                            >
                                <option value="">Unassigned</option>
                                {workers.map((worker) => (
                                    <option key={worker._id} value={worker._id}>
                                        {worker.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Due Date</label>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label>Estimated Hours</label>
                            <input
                                type="number"
                                value={estimatedHours}
                                onChange={(e) => setEstimatedHours(e.target.value)}
                                placeholder="0"
                                min="0"
                                step="0.5"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="modal-actions">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-secondary"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                        >
                            {loading ? "Creating..." : "Create Task"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
