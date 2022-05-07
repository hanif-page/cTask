const express = require("express")
const router = express.Router()

const Task = require("../models/task")
const User = require("../models/user")

router.get('/', async (req, res) => {
    res.send("Hello World")

    // THIS CODE BELOW IS FOR POST LOGIC, SO MAKE SURE U MOVE IT UP NEXT
    const user = await User.findOne({ email: "dead@pool.com"})
    
    // res.json({ count: user.length }) => ERROR
    // console.log(user._id)

    if(user._id)
    {
        const data = {
            user: user._id,
            tasks: {
                text: "Hello World"
            }
        }

        // CONTINUE
        try 
        {
            const task = await Task.findOne({ user: user._id })
            const newTask = {
                text: "Hello World2d dawdjwiuajduwai hudiawhduiw"
            }
            task.tasks.push(newTask)
    
            await task.save();
            console.log("Success.. Check DB!")
        }
        catch(err)
        {
            console.log(err)
        }
    }
    // ...
})

router.post('/', (req, res) => {
    res.send("Add new task")
    // ...
})

router.put('/:taskID', (req, res) => {
    res.send(`Update ${req.params.taskID} task`)
    // ...
})

router.delete('/:taskID', (req, res) => {
    res.send(`Delete ${req.params.taskID} task`)
    // ...
})

module.exports = router
