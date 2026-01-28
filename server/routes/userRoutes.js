const express = require("express")
const router = express.Router()
const User = require("../models/User")
const auth = require("../middleware/authMiddleware")
const { isManager } = require("../middleware/roleMiddleware")

// Get all workers (for task assignment - manager only)
router.get("/workers", auth, isManager, async (req, res) => {
    try {
        const workers = await User.find({ role: "worker" })
            .select("name email department")
            .sort({ name: 1 })

        res.json(workers)
    } catch (error) {
        console.error("Get workers error:", error)
        res.status(500).json({ msg: "Failed to fetch workers" })
    }
})

// Get current user info
router.get("/me", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password")
        res.json(user)
    } catch (error) {
        console.error("Get user error:", error)
        res.status(500).json({ msg: "Failed to fetch user" })
    }
})

module.exports = router
