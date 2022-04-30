// Like an authentication guard, so it protect some page that we want to be protected

module.exports = {
    ensureAuthenticated: function(req, res, next){
        if(req.isAuthenticated()) return next()
        req.flash('error_msg', "Please login to view this resource")
        res.redirect("/login")
    },
    forwardAuthenticated: function(req, res, next){
        if(!req.isAuthenticated()) return next() 

        res.redirect("/")
    }
}