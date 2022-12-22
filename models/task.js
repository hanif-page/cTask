const mongoose = require("mongoose")
const validate = require("mongoose-validator")

// Not getting use anymore, but I'm just keeping it (just in case)
const textValidator = [
    validate({
        validator: "isLength",
        arguments: [1, 26],
        message: "Task text should be between {ARGS[0]} and {ARGS[1]} characters"
    })
]

const taskSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    tasks: [
        {
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
            },
            textDetail: {
                type: String,
                required: true,
                default: "..."
            }
        }
    ],
})

module.exports = mongoose.model("Task", taskSchema)