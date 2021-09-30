const user = require("../models/user")
const User = require("../models/user")

const renderRegister = (req,res) => {
    res.render("users/register")
}

const register = async (req,res) => {
    try {
        const {username,email,password} = req.body
        const user = new User({username,email})
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, err => {
            if (err) return next(err)
            req.flash("success", "Welcome to YelpCamp!")
            res.redirect("/campgrounds")
        })
    } catch(e){
        req.flash("error",e.message)
        res.redirect("/register")
    }
}

const renderLogin = (req,res) => {
    res.render("users/login")
}

const login = (req,res) => {
    req.flash("success", "Welcome back")
    const redirectUrl = req.session.returnTo || "/campgrounds"
    delete req.session.returnTo
    res.redirect(redirectUrl)
}

const logout = (req, res) => {
    req.logOut()
    req.flash("success", "Godbye!")
    res.redirect("/campgrounds")
}

module.exports = {
    renderRegister,
    register,
    renderLogin,
    login,
    logout
}