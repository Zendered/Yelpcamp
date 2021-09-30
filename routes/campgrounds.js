const express = require("express")
const {storage} = require("../cloudinary")
const campgrounds = require("../controllers/campgrounds")

const multer = require("multer")
const upload = multer({storage})
const router = express.Router()

const catchAsync = require("../middlewares/catchAsync")
const {validateCampground} = require("../middlewares/validations")
const {isLoggedIn, isAuthor} = require("../middlewares/authentications")

router.get("/new", isLoggedIn, campgrounds.renderNewForm)
router.route("/")
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array("image"), validateCampground, catchAsync(campgrounds.createNewCampground))

router.route("/:id")
    .get( catchAsync(campgrounds.showCampground))
    .put( isLoggedIn, isAuthor, upload.array("image"), validateCampground, catchAsync(campgrounds.UpdateCampground))
    .delete( isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

router.get("/:id/edit", isLoggedIn, isAuthor , catchAsync(campgrounds.renderEditCampground))

module.exports = router