if(process.env.NODE_ENV !== "production") 
{
    require("dotenv").config()
}

const express = require("express")
const expressLayouts = require("express-ejs-layouts")

const app = express()
const port = process.env.PORT || 3000

app.set('view engine', 'ejs')
app.set('layout', 'main-layout/layout')
app.use(expressLayouts)
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render("index", {
        pageType: "index",
        title: "cTask",
        userProfilePictUrl: ""
    })
})

app.get('/login', (req, res) => {
    res.render("login", {
        pageType: "signing",
        title: "cTask | Login"
    })
})

app.get('/signup', (req, res) => {
    res.render("sign-up", {
        pageType: "signing",
        title: "cTask | Sign Up"
    })
})

app.get('/user/profile/', (req, res) => {
    res.render("profile", {
        pageType: 'profile',
        title: "cTask | [Username] Profile"
    })
})

app.get('/user/profile/edit', (req, res) => {
    res.render("update-profile", {
        pageType: 'profile',
        title: "cTask | Edit [Username] Profile"
    })
})

app.use((req, res, next) => {
    res.send("<h1>404 Not Found</h1><br><a href='/' style='color: purple'>Back to Home Page</a>")
})

app.listen(port, () => console.log(`\nServer running on http://localhost:${port}\n`))