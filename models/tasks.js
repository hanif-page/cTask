const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    tasks: [
        {
            taskID: {
                type: String,
                required: true
            },
            text: {
                type: String,
                required: true
            },
            isChecked: {
                type: Boolean,
                required: true,
                default: false
            },
            lastUpdated: {
                type: Date,
                required: true,
                default: Date.now
            }
        }
    ],
})

module.exports = mongoose.model("Task", taskSchema)