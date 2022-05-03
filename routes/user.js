const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const { ensureAuthenticated } = require("../config/authenticate")

const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif']

const User = require("../models/user")

router.get('/profile', ensureAuthenticated, (req, res) => {
    res.render("profile", {
        pageType: 'profile',
        title: `cTask | ${req.user.username} Profile`,
        userData: req.user
    })
})

router.get('/profile/edit', ensureAuthenticated, (req, res) => {
    res.render("update-profile", {
        pageType: 'profile',
        title: `cTask | Edit ${req.user.username} Profile`,
        userData: req.user
    })
})

router.put('/profile/edit', async (req, res) => {
    const { profilepicture, username, email, prevEmail } = req.body
    
    // CHECK IF email === prevEmail, if true then continue to update the file with the same email
    if(email === prevEmail)
    {
        const user = await User.findOne({email: prevEmail})
        user.username = username 
        user.email = email 

        if(profilepicture != null && profilepicture !== "") saveProfilePict(user, profilepicture)
        
        await user.save()

        req.flash("success_msg", "Profile successfully updated")
        res.redirect('/user/profile')
    }
    else 
    {
        // check if the new email already exist or not
        const checkUser = await User.findOne({email: email})
        if(checkUser)
        {
            req.flash('error_msg', "Email is already exist")
            res.redirect("/user/profile/edit")
        }
        // continue updating 
        else 
        {
            const user = await User.findOne({email: prevEmail})
            user.username = username 
            user.email = email 
    
            if(profilepicture != null && profilepicture !== "") saveProfilePict(user, profilepicture)
            
            await user.save()
    
            req.flash("success_msg", "Profile successfully updated")
            res.redirect('/user/profile')
        }
    }
})

router.get("/profile/edit-password", ensureAuthenticated, (req, res) => renderEditpasswordPage(res, req))

router.put("/profile/edit-password", async (req, res) => {
    const { oldpassword, newpassword, newpassword2, targetemail } = req.body
    let errors = []
    const user = await User.findOne({ email: targetemail })

    // check required fields
    if(!oldpassword || !newpassword || !newpassword2) errors.push({ msg: "Please fill in all fields" })

    // check if the old password correct or not...
    if(!bcrypt.compareSync(oldpassword, user.password)) errors.push({ msg: "Wrong old password" }) 

    // check the similarity of old pass and new pass
    if(oldpassword === newpassword) errors.push({ msg: "New password cannot be the same as old"})

    // check the new pass length
    if(newpassword.length < 6) errors.push({ msg: "Password should be at least 6 characters"})

    // check the similarity of new pass and confirm new pass
    if(newpassword !== newpassword2) errors.push({ msg: "Password Confirmation do not match" })

    // check errors count
    if(errors.length > 0) renderEditpasswordPage(res, req, errors, req.body)

    // Validation passed
    else 
    {
        // Edit password database logic
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newpassword, salt, async (err, hash) => {
                if(err) throw err

                // set new password
                user.password = hash 

                try 
                { 
                    // save data
                    await user.save()
                    
                    req.flash('success_msg', 'Password successfully changed')
                    res.redirect('/user/profile')
                }
                catch(err) { console.log(err) }
            })
        })
    }
})

const saveProfilePict = (userDB, profilePictEncoded) => {
    if(profilePictEncoded == null) return 
    const profilePict = JSON.parse(profilePictEncoded)

    if(profilePict != null && imageMimeTypes.includes(profilePict.type))
    {
        userDB.profilePicture = new Buffer.from(profilePict.data, "base64")
        userDB.profilePictureType = profilePict.type
    }
} 

const renderEditpasswordPage = (res, req, errors = [], lastInput = {}) => {
    res.render("update-password", {
        pageType: 'profile',
        title: `cTask | Edit ${req.user.username} Password`,
        userEmail: req.user.email,

        errors,
        lastInput
    })
}

module.exports = router