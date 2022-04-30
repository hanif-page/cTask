const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: Buffer
    },
    profilePictureType: {
        type: String
    }
})

// Virtual data
userSchema.virtual("profilePicturePath").get(function(){
    if(this.profilePicture != null && this.profilePictureType != null)
    {
        // return the real image path
        return `data:${this.profilePictureType};charset=utf-8;base64,${this.profilePicture.toString('base64')}`
    }
})

module.exports = mongoose.model("User", userSchema)