const express = require("express")
const router = express.Router()
const auth = require("../middleware/authMiddleware")
const {
    getAllTasks,
    createTask,
    getTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    addComment,
    getTaskStats
} = require("../controllers/taskController")

// Get task statistics
router.get("/stats", auth, getTaskStats)

// Get all tasks (filtered by role)
router.get("/", auth, getAllTasks)

// Create new task (manager only)
router.post("/", auth, createTask)

// Get single task
router.get("/:id", auth, getTask)

// Update task (manager only)
router.put("/:id", auth, updateTask)

// Update task status
router.patch("/:id/status", auth, updateTaskStatus)

// Delete task (manager only)
router.delete("/:id", auth, deleteTask)

// Add comment to task
router.post("/:id/comments", auth, addComment)

module.exports = router
