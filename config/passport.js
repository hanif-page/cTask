const LocalStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

// Load User Model
const User = require("../models/user")

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
            
            // Matching User
            User.findOne({ email: email })
                .then(user => {
                    if(!user)
                    {
                        // unsuccess
                        return done(null, false, {message: "That email is not registered"})
                    }

                    // Mathing Password
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if(err) throw err
                        if(isMatch)
                        {
                            // success, user can be access by req.user
                            return done(null, user, {message: "Logged in success"})
                        }
                        else 
                        {
                            // unsuccess
                            return done(null, false, { message: "Password incorrect" })
                        }
                    })
                })
                .catch(err => {
                    console.log(err)
                })

        })
    )

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })
}