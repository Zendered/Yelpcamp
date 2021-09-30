const Campground = require("../models/campground")
const Review = require("../models/review")


const isLoggedIn = (req,res,next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash("error", "You must be signed in first")
        return res.redirect("/login")
    }
    next()
}

const isAuthor = async (req,res,next) => {
    const {id} = req.params
    const campground = await Campground.findById(id)
    if (!campground.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that!")
        return res.redirect(`/campgrounds/${id}`)
    } 
    next()
}
const isReviewAuthor = async (req,res,next) => {
    const {id, reviewId} = req.params
    const campground = await Review.findById(reviewId)
    if (!campground.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that!")
        return res.redirect(`/campgrounds/${id}`)
    } 
    next()
}

module.exports = { isLoggedIn,isAuthor, isReviewAuthor}