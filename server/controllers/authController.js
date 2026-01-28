const User = require("../models/User")
const jwt = require("jsonwebtoken")

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET || "your-secret-key", {
        expiresIn: "30d"
    })
}

// Signup controller
exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please provide all required fields" })
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email" })
        }

        // Create new user
        const user = await User.create({
            name,
            email,
            password
        })

        // Generate token
        const token = generateToken(user._id)

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
            token
        })
    } catch (error) {
        console.error("Signup error:", error)
        res.status(500).json({ message: "Server error during signup" })
    }
}

// Login controller
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password" })
        }

        // Find user
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" })
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password)
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" })
        }

        // Generate token
        const token = generateToken(user._id)

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
            token
        })
    } catch (error) {
        console.error("Login error:", error)
        res.status(500).json({ message: "Server error during login" })
    }
}
