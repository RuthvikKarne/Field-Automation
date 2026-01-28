const Task = require("../models/Task")
const User = require("../models/User")

// Get all tasks (filtered by role)
exports.getAllTasks = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)

        let tasks
        if (user.role === "manager") {
            // Managers see all tasks they created
            tasks = await Task.find({ createdBy: req.user.id })
                .populate("assignedTo", "name email")
                .populate("createdBy", "name email")
                .sort({ createdAt: -1 })
        } else {
            // Workers see only tasks assigned to them
            tasks = await Task.find({ assignedTo: req.user.id })
                .populate("assignedTo", "name email")
                .populate("createdBy", "name email")
                .sort({ createdAt: -1 })
        }

        res.json(tasks)
    } catch (error) {
        console.error("Get tasks error:", error)
        res.status(500).json({ msg: "Failed to fetch tasks" })
    }
}

// Create new task (manager only)
exports.createTask = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)

        if (user.role !== "manager") {
            return res.status(403).json({ msg: "Only managers can create tasks" })
        }

        const { title, description, priority, assignedTo, dueDate, estimatedHours } = req.body

        const task = await Task.create({
            title,
            description,
            priority,
            assignedTo: assignedTo || null,
            dueDate: dueDate || null,
            estimatedHours: estimatedHours || 0,
            createdBy: req.user.id
        })

        const populatedTask = await Task.findById(task._id)
            .populate("assignedTo", "name email")
            .populate("createdBy", "name email")

        res.status(201).json(populatedTask)
    } catch (error) {
        console.error("Create task error:", error)
        res.status(500).json({ msg: "Failed to create task" })
    }
}

// Get single task
exports.getTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate("assignedTo", "name email role")
            .populate("createdBy", "name email role")
            .populate("comments.user", "name email")

        if (!task) {
            return res.status(404).json({ msg: "Task not found" })
        }

        // Check if user has access to this task
        const user = await User.findById(req.user.id)
        if (user.role === "worker" && task.assignedTo?._id.toString() !== req.user.id) {
            return res.status(403).json({ msg: "Access denied" })
        }

        res.json(task)
    } catch (error) {
        console.error("Get task error:", error)
        res.status(500).json({ msg: "Failed to fetch task" })
    }
}

// Update task
exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
        if (!task) {
            return res.status(404).json({ msg: "Task not found" })
        }

        const user = await User.findById(req.user.id)

        // Only manager who created the task can update it
        if (user.role !== "manager" || task.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ msg: "Access denied" })
        }

        const { title, description, priority, assignedTo, dueDate, estimatedHours } = req.body

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            { title, description, priority, assignedTo, dueDate, estimatedHours },
            { new: true }
        ).populate("assignedTo", "name email").populate("createdBy", "name email")

        res.json(updatedTask)
    } catch (error) {
        console.error("Update task error:", error)
        res.status(500).json({ msg: "Failed to update task" })
    }
}

// Update task status
exports.updateTaskStatus = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
        if (!task) {
            return res.status(404).json({ msg: "Task not found" })
        }

        const user = await User.findById(req.user.id)
        const { status, actualHours } = req.body

        // Workers can only update tasks assigned to them
        if (user.role === "worker" && task.assignedTo?.toString() !== req.user.id) {
            return res.status(403).json({ msg: "Access denied" })
        }

        // Update status-related dates
        const updates = { status }
        if (status === "in-progress" && !task.startDate) {
            updates.startDate = new Date()
        }
        if (status === "completed" && !task.completedDate) {
            updates.completedDate = new Date()
        }
        if (actualHours !== undefined) {
            updates.actualHours = actualHours
        }

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true }
        ).populate("assignedTo", "name email").populate("createdBy", "name email")

        res.json(updatedTask)
    } catch (error) {
        console.error("Update status error:", error)
        res.status(500).json({ msg: "Failed to update task status" })
    }
}

// Delete task (manager only)
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
        if (!task) {
            return res.status(404).json({ msg: "Task not found" })
        }

        const user = await User.findById(req.user.id)

        if (user.role !== "manager" || task.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ msg: "Access denied" })
        }

        await Task.findByIdAndDelete(req.params.id)
        res.json({ msg: "Task deleted successfully" })
    } catch (error) {
        console.error("Delete task error:", error)
        res.status(500).json({ msg: "Failed to delete task" })
    }
}

// Add comment to task
exports.addComment = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
        if (!task) {
            return res.status(404).json({ msg: "Task not found" })
        }

        const user = await User.findById(req.user.id)
        const { text } = req.body

        if (!text || !text.trim()) {
            return res.status(400).json({ msg: "Comment text is required" })
        }

        task.comments.push({
            user: req.user.id,
            userName: user.name,
            text: text.trim(),
            createdAt: new Date()
        })

        await task.save()

        const updatedTask = await Task.findById(task._id)
            .populate("assignedTo", "name email")
            .populate("createdBy", "name email")
            .populate("comments.user", "name email")

        res.json(updatedTask)
    } catch (error) {
        console.error("Add comment error:", error)
        res.status(500).json({ msg: "Failed to add comment" })
    }
}

// Get task statistics
exports.getTaskStats = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)

        let filter = {}
        if (user.role === "manager") {
            filter.createdBy = req.user.id
        } else {
            filter.assignedTo = req.user.id
        }

        const totalTasks = await Task.countDocuments(filter)
        const pendingTasks = await Task.countDocuments({ ...filter, status: "pending" })
        const inProgressTasks = await Task.countDocuments({ ...filter, status: "in-progress" })
        const completedTasks = await Task.countDocuments({ ...filter, status: "completed" })
        const blockedTasks = await Task.countDocuments({ ...filter, status: "blocked" })

        // Get overdue tasks
        const overdueTasks = await Task.countDocuments({
            ...filter,
            dueDate: { $lt: new Date() },
            status: { $nin: ["completed"] }
        })

        res.json({
            total: totalTasks,
            pending: pendingTasks,
            inProgress: inProgressTasks,
            completed: completedTasks,
            blocked: blockedTasks,
            overdue: overdueTasks
        })
    } catch (error) {
        console.error("Get stats error:", error)
        res.status(500).json({ msg: "Failed to fetch statistics" })
    }
}
