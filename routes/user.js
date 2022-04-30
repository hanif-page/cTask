const express = require("express")
const router = express.Router()
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

const saveProfilePict = (userDB, profilePictEncoded) => {
    if(profilePictEncoded == null) return 
    const profilePict = JSON.parse(profilePictEncoded)

    if(profilePict != null && imageMimeTypes.includes(profilePict.type))
    {
        userDB.profilePicture = new Buffer.from(profilePict.data, "base64")
        userDB.profilePictureType = profilePict.type
    }
} 

module.exports = router