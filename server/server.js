const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

const app = express()
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connected successfully"))
    .catch(err => console.error("❌ MongoDB connection error:", err))

app.use("/api/auth", require("./routes/authRoutes"))
app.use("/api/tasks", require("./routes/taskRoutes"))
app.use("/api/users", require("./routes/userRoutes"))

const PORT = process.env.PORT || 5000
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on http://127.0.0.1:${PORT}`)
})
