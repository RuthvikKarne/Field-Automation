const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        enum: ["pending", "in-progress", "completed", "blocked"],
        default: "pending"
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high", "urgent"],
        default: "medium"
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    dueDate: {
        type: Date,
        default: null
    },
    startDate: {
        type: Date,
        default: null
    },
    completedDate: {
        type: Date,
        default: null
    },
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        userName: String,
        text: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    estimatedHours: {
        type: Number,
        default: 0
    },
    actualHours: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Task", taskSchema)
