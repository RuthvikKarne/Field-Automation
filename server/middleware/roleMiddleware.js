const User = require("../models/User")

// Middleware to check if user is a manager
exports.isManager = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)

        if (!user) {
            return res.status(404).json({ msg: "User not found" })
        }

        if (user.role !== "manager") {
            return res.status(403).json({ msg: "Access denied. Manager role required." })
        }

        next()
    } catch (error) {
        console.error("Role check error:", error)
        res.status(500).json({ msg: "Server error" })
    }
}

// Middleware to check if user is a worker
exports.isWorker = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)

        if (!user) {
            return res.status(404).json({ msg: "User not found" })
        }

        if (user.role !== "worker") {
            return res.status(403).json({ msg: "Access denied. Worker role required." })
        }

        next()
    } catch (error) {
        console.error("Role check error:", error)
        res.status(500).json({ msg: "Server error" })
    }
}
