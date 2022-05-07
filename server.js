if(process.env.NODE_ENV !== "production") 
{
    require("dotenv").config()
}

const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const bodyParser = require("body-parser")
const methodOverride = require("method-override")
const flash = require("connect-flash")
const session = require("express-session")
const passport = require("passport")
const { ensureAuthenticated } = require("./config/authenticate")

const app = express()
const port = process.env.PORT || 3000

app.set('view engine', 'ejs')
app.set('layout', 'main-layout/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(methodOverride("_method"))
app.use(bodyParser.urlencoded({limit: "10mb", extended: false}))

// Requiring router as a middleware
const indexRoute = require("./routes/index")
const userRoute = require("./routes/user")
const taskRoute = require("./routes/task")

// Connect to DB
const mongoose = require("mongoose")
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log("Connected to Mongoose..."))

// Express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

// Passport config 
require("./config/passport")(passport)

// Passport middleware 
app.use(passport.initialize())
app.use(passport.session())


// Connect flash
app.use(flash())

// Global vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')

    next()
})

// Use the router middleware
app.use("/", indexRoute)
app.use("/user", userRoute)
app.use("/task", taskRoute)

// Page Not Found
app.use(ensureAuthenticated, (req, res, next) => {
    res.render("not-found", {
        pageType: "404",
        title: "404 - Not Found"
    })
})

app.listen(port, () => console.log(`\nServer running on http://localhost:${port}\n`))