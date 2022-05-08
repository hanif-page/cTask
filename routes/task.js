const express = require("express")
const router = express.Router()

const Task = require("../models/task")
const User = require("../models/user")

router.get('/', async (req, res) => {
    const user = await getUser(req)
    
    if(user._id)
    {
        try 
        {
            const task = await Task.findOne({ user: user._id })

            // CONDITION IF THE TASK IS NOT GETTING INITIALIZED
            if(!task)
            {
                await initializeTask(user)
                
                res.json({ msg: "Initializing task... Please reload" })
            }
            else 
            {
                res.json({ tasks: task.tasks })
            }
        }
        catch(err) 
        { 
            // console.log(err)
            req.flash("error_msg", "Error when getting all task")
            res.sendStatus(500)
            
        }
    }
})

router.post('/', async (req, res) => {
    const user = await getUser(req)
    
    if(user._id)
    {
        const newTask = req.body 
        try 
        {
            const task = await Task.findOne({ user: user._id }) 

            task.tasks.push(newTask)
            await task.save();
            req.flash('success_msg', 'New task added!')
            res.sendStatus(200)

        }
        catch(err) 
        { 
            // console.log(err.errors)

            if(newTask.text.length < 1 || newTask.text.length > 26) 
            {
                req.flash("error_msg", "Task name should be between 1 and 26 characters")
                res.sendStatus(300)
            }
            else 
            {
                req.flash("error_msg", "Error when adding new task")
                res.sendStatus(500)
            }
            
        }
    }
})

router.delete('/', async (req, res) => {
    const user = await getUser(req)
    
    if(user._id)
    {
        try 
        {
            let task = await Task.findOne({ user: user._id })

            const updatedArrTask = []

            if(updatedArrTask)
            {
                task.tasks = updatedArrTask

                await task.save();
                req.flash('success_msg', 'All task deleted!')
                res.sendStatus(200)
                
            }
            else throw new Error("Error when deleting all task")
        }
        catch(err) 
        { 
            console.log(err)
            
            req.flash("error_msg", "Error when deleting all task")
            res.sendStatus(500)

        }
    }
})

router.put('/:taskID', async (req, res) => {
    const user = await getUser(req)
    
    if(user._id)
    {
        try 
        {
            const task = await Task.findOne({ user: user._id })

            const targetedTask = task.tasks.find(task => task._id == req.params.taskID)
            if(targetedTask)
            {
                targetedTask.isChecked = req.body.isChecked
                
                await task.save();
                req.flash('success_msg', 'Task updated!')
                res.sendStatus(200)
    
            }
            else throw new Error("No task with that taskID")
        }
        catch(err) 
        { 
            console.log(err)
            
            req.flash("error_msg", "Error when updating task")
            res.sendStatus(500)
            
        }
    }
})

router.delete('/:taskID', async (req, res) => {
    const user = await getUser(req)
    
    if(user._id)
    {
        try 
        {
            let task = await Task.findOne({ user: user._id })

            const updatedArrTask = task.tasks.filter(task => task._id != req.params.taskID)

            if(updatedArrTask)
            {
                task.tasks = updatedArrTask

                await task.save();
                req.flash('success_msg', 'Task deleted!')
                res.sendStatus(200)
    
            }
            else throw new Error("Error when deleting task")
        }
        catch(err) 
        { 
            console.log(err)
            
            req.flash("error_msg", "Error when deleting task")
            res.sendStatus(500)

        }
    }
})

const getUser = async (req) => {
    const userEmail = req.user.email
    const user = await User.findOne({ email: userEmail })

    return user // will be mainly use as boolean statement (either true or false)
}

const initializeTask = async (user) => {
    try 
    {
        const initializedTask = new Task({
            user: user._id,
            tasks: {
                text: "Welcome!"
            }
        })
    
        await initializedTask.save();
    }
    catch(err)
    {
        console.log(err)
    }
}

module.exports = router
