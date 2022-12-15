const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const passport = require("passport")
const { ensureAuthenticated, forwardAuthenticated } = require("../config/authenticate")

const User = require("../models/user")
const Task = require("../models/task")

router.get('/', ensureAuthenticated, (req, res) => {
    res.render("index", {
        pageType: "index",
        title: "cTask",
        userProfilePictUrl: "",
        userData: req.user
    })
})

// UNFINISHED
router.get("/edit/:taskID", ensureAuthenticated, async (req, res) => {
    const user = await getUser(req)

    if(user._id)
    {
        try 
        {
            const task = await Task.findOne({ user: user._id })

            const targetedTask = task.tasks.find(task => task._id == req.params.taskID)
            if(targetedTask)
            {
                var prevTask = targetedTask.text
            }
            else
            {
                var prevTask = ""
            } 
        }
        catch (err)
        {
            console.log(err)
        }
    }

    res.render("task-edit", {
        pageType: "profile",
        title: "cTask | Task Edit",
        userProfilePictUrl: "",
        userData: req.user,
        taskID: req.params.taskID,
        prevTask : prevTask
    })
})

// router.get("/task/detail/:taskID", ensureAuthenticated, (req, res) => {
//     res.render("task-edit", {
//         pageType: "profile",
//         title: "cTask | Edit Task Text",
//         userProfilePictUrl: "",
//         userData: req.user,
//         taskID: req.params.taskID
//     })
// })

router.get('/login', forwardAuthenticated,(req, res) => {
    res.render("login", {
        pageType: "signing",
        title: "cTask | Login"
    })
})

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: "/login",
        failureFlash: true
    })(req, res, next)
})

router.get('/signup', forwardAuthenticated, (req, res) => {
    renderSignupPage(res)
})

router.post('/signup', async (req, res) => {
    // logic
    const { username, email, password, confirmPassword } = req.body
    let errors = []

    // Check required fields
    if(!username || !email || !password || !confirmPassword)
    {
        errors.push({ msg: "Please fill in all fields" })
    }
    // Check passwords match
    if(password !== confirmPassword)
    {
        errors.push({ msg: "Password do not match" })
    }
    // Check password length
    if(password.length < 6)
    {
        errors.push({ msg: "Password should be at least 6 characters" })
    }
    if(errors.length > 0)
    {
        renderSignupPage(res, errors, req.body)
    }
    else 
    {
        // Validation Passed
        User.findOne({ email: email })
            .then(user => {
                if(user)
                {
                    // user exist
                    errors.push({msg: "Email is already exist"})

                    renderSignupPage(res, errors, req.body)
                }
                else 
                {
                    const newUser = new User({
                        username,
                        email,
                        password
                    })

                    // Hash the password
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if(err) throw err

                            // Set password to hash
                            newUser.password = hash

                            // Save user
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You are now registered and can login')
                                    
                                    res.redirect('/login')
                                })
                                .catch(err => console.log(err))
                        })
                    })
                }
            })
    }
})

router.get('/logout', (req, res) => {
    req.logout()
    req.flash("success_msg", "You are logged out")

    res.redirect("/login")
})

const renderSignupPage = (res, errors = [], lastInput = {}) => {
    res.render('sign-up', {
        title: "cTask | Sign Up",
        pageType: "signing",
        errors,
        lastInput
    })
}

const renderLoginPage = (res, errors = [], lastInput = {}) => {
    res.render('login', {
        title: "cTask | Login",
        pageType: "signing",
        errors,
        lastInput
    })
}

const getUser = async (req) => {
    const userEmail = req.user.email
    const user = await User.findOne({ email: userEmail })

    return user // will be mainly use as boolean statement (either true or false)
}

module.exports = router