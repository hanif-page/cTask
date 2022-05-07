const mongoose = require("mongoose")
const validate = require("mongoose-validator")

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
                required: true,
                validate: textValidator
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