export default function TaskCard({ task, onStatusUpdate, onViewDetails, userRole }) {
    const getPriorityColor = (priority) => {
        const colors = {
            low: "#10b981",
            medium: "#f59e0b",
            high: "#ef4444",
            urgent: "#dc2626"
        }
        return colors[priority] || colors.medium
    }

    const getStatusColor = (status) => {
        const colors = {
            pending: "#6b7280",
            "in-progress": "#3b82f6",
            completed: "#10b981",
            blocked: "#ef4444"
        }
        return colors[status] || colors.pending
    }

    const formatDate = (date) => {
        if (!date) return "No due date"
        const d = new Date(date)
        return d.toLocaleDateString()
    }

    const isOverdue = (dueDate) => {
        if (!dueDate) return false
        return new Date(dueDate) < new Date() && task.status !== "completed"
    }

    return (
        <div className="task-card">
            <div className="task-card-header">
                <h3>{task.title}</h3>
                <span
                    className="priority-badge"
                    style={{ backgroundColor: getPriorityColor(task.priority) }}
                >
                    {task.priority}
                </span>
            </div>

            {task.description && (
                <p className="task-description">{task.description}</p>
            )}

            <div className="task-meta">
                <div className="task-meta-item">
                    <span className="label">Status:</span>
                    <span
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(task.status) }}
                    >
                        {task.status}
                    </span>
                </div>

                {task.assignedTo && (
                    <div className="task-meta-item">
                        <span className="label">Assigned to:</span>
                        <span className="value">{task.assignedTo.name}</span>
                    </div>
                )}

                <div className="task-meta-item">
                    <span className="label">Due:</span>
                    <span className={isOverdue(task.dueDate) ? "overdue" : "value"}>
                        {formatDate(task.dueDate)}
                    </span>
                </div>
            </div>

            <div className="task-card-actions">
                {userRole === "worker" && task.status !== "completed" && (
                    <select
                        onChange={(e) => onStatusUpdate(task._id, e.target.value)}
                        value={task.status}
                        className="status-select"
                    >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="blocked">Blocked</option>
                    </select>
                )}
                <button onClick={() => onViewDetails(task)} className="btn-secondary">
                    View Details
                </button>
            </div>
        </div>
    )
}
