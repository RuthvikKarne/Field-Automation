const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ["manager", "worker"],
        required: true,
        default: "worker"
    },
    department: {
        type: String,
        trim: true
    },
    avatar: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
})

// Hash password before saving
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return

    try {
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
    } catch (error) {
        throw error // In async hooks, throwing an error is equivalent to calling next(error)
    }
})

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password)
}

module.exports = mongoose.model("User", userSchema)
