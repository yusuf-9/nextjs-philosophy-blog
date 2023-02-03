const mongoose = require("mongoose")

const GoogleUser = new mongoose.Schema({
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
    role:{
        type: String,
        default: "user"
    },
})

export default mongoose.models.GoogleUser || mongoose.model("GoogleUser", GoogleUser)