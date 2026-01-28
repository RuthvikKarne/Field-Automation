const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")

const router = express.Router()

router.post("/signup", async (req, res) => {
    const { name, email, password, role, department } = req.body

    // Validation
    if (!name || !email || !password || !role) {
        return res.status(400).json({ msg: "Please provide all required fields" })
    }

    if (!["manager", "worker"].includes(role)) {
        return res.status(400).json({ msg: "Invalid role. Must be 'manager' or 'worker'" })
    }

    try {
        // Check if user exists
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ msg: "User already exists with this email" })
        }

        // We don't hash here because User.js has a pre-save hook that hashes it
        const user = await User.create({
            name,
            email,
            password, // Passing plain password, hook will hash it
            role,
            department: department || ""
        })

        console.log(`✅ User created: ${email} (${role})`)
        res.json({ msg: "User created successfully" })
    } catch (error) {
        console.error("❌ Signup error:", error)
        res.status(500).json({ msg: error.message || "Server error during signup" })
    }
})

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ msg: "Please provide email and password" })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ msg: "Invalid email or password" })
        }

        const match = await bcrypt.compare(password, user.password)
        if (!match) {
            return res.status(400).json({ msg: "Invalid email or password" })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "your-secret-key")

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department
            }
        })
    } catch (error) {
        console.error("Login error:", error)
        res.status(500).json({ msg: "Server error during login" })
    }
})

module.exports = router
