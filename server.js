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
        title: "cTask"
    })
})

app.get('/user/login', (req, res) => {
    res.render("login", {
        pageType: "signing",
        title: "cTask | Login"
    })
})
app.get('/user/signup', (req, res) => {
    res.render("signup", {
        pageType: "signing",
        title: "cTask | Sign Up"
    })
})

app.listen(port, () => console.log(`\nServer running on http://localhost:${port}\n`))