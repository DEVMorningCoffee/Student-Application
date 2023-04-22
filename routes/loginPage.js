const express = require("express");
const router = express.Router();
const { generateAcessToken } = require("../src/token/jwt");

router.get("/login", (req, res) => {
  res.json(req.flash("msg"));
});

router.post("/login", (req, res) => {
  try {
    const { name } = req.body;

    // Empty name
    if (!name) {
      throw new Error("Please enter a name");
    }

    // JWT
    const token = generateAcessToken(name);

    res.cookie("token", token, { httpOnly: true });

    req.flash("msg", `Welcome ${name}`);
    res.redirect("/");
  } catch (err) {
    req.flash("msg", err.message);
    res.redirect("/login");
  }
});

module.exports = router;
