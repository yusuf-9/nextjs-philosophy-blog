const mongoose = require("mongoose")

const userActions = new mongoose.Schema({
    email:{
        type: String,
        unique: true,
        required: true
    },
    unique_id:{
        type:String,
        unique: true,
        required: true
    },
    date_created:{
        type: Date,
        expires: '3600m',
        default: Date.now()
    }
})


export default mongoose.models.userActions || mongoose.model("userActions", userActions)