const mongoose = require("mongoose")

const User = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: String,
        default: "user"
    },
    verified:{
        type: Boolean,
        default: false
    }
})

export default mongoose.models.User || mongoose.model("User", User)