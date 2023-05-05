const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
    res.redirect("/catalog");
});

router.get("/loop", function (req, res) {
    res.redirect("/loop2");
});

router.get("/loop2", function (req, res) {
    res.redirect("/loop");
});

module.exports = router;
