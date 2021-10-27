const express = require("express")
const router = express.Router()
const passport = require("passport")

const users = require("../controllers/users")

router.get("/logout", users.logout)
router.route("/register").get(users.renderRegister).post(users.register)
router
    .route("/login")
    .get(users.renderLogin)
    .post(
        passport.authenticate("local", {
            failureFlash: true,
            failureRedirect: "/login",
        }),
        users.login
    )

module.exports = router
