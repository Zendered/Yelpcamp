const express = require("express")
const router = express.Router({ mergeParams: true })
const reviews = require("../controllers/reviews")

const catchAsync = require("../middlewares/catchAsync")
const {validateReview} = require("../middlewares/validations")
const {isLoggedIn,isReviewAuthor} = require("../middlewares/authentications")

router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview))
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router