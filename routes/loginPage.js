const express = require("express");
const router = express.Router();

router.get("/login", (req, res) => {
  res.send("Login Page");
});

router.post("/login", (req, res) => {
  try {
  } catch (err) {
    res.redirect("/login");
  }
});

module.exports = router;
