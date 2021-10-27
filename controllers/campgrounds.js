const Campground = require("../models/campground")
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const mapBoxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({ accessToken: mapBoxToken })
const { cloudinary } = require("../cloudinary")

const index = async (req, res) => {
    const campground = await Campground.find({})
    res.render("campgrounds/index", { campground })
}

const renderNewForm = (req, res) => {
    res.render("campgrounds/new")
}

const createNewCampground = async (req, res) => {
    const geoData = await geocoder
        .forwardGeocode({
            query: req.body.campground.location,
            limit: 1,
        })
        .send()
    const newCampground = new Campground(req.body.campground)
    newCampground.geometry = geoData.body.features[0].geometry
    newCampground.images = req.files.map((f) => ({
        url: f.path,
        filename: f.filename,
    }))
    newCampground.author = req.user._id
    await newCampground.save()
    console.log(newCampground)
    req.flash("success", "Successfuly made a new campground!")
    res.redirect(`/campgrounds/${newCampground._id}`)
}

const showCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("author")
    if (!campground) {
        req.flash("error", "Cannot find campground!")
        return res.redirect("/campgrounds")
    }
    res.render("campgrounds/show", { campground })
}

const renderEditCampground = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    res.render("campgrounds/edit", { campground })
}

const UpdateCampground = async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(
        id,
        { ...req.body.campground },
        { runValidators: true }
    )
    const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }))
    campground.images.push(...imgs)
    await campground.save()
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({
            $pull: { images: { filename: { $in: req.body.deleteImages } } },
        })
    }
    req.flash("success", "Success update campground")
    res.redirect(`/campgrounds/${campground._id}`)
}

const deleteCampground = async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    req.flash("success", "Successfully deleted a campground!")
    res.redirect("/campgrounds")
}

module.exports = {
    index,
    renderNewForm,
    createNewCampground,
    showCampground,
    renderEditCampground,
    UpdateCampground,
    deleteCampground,
}
