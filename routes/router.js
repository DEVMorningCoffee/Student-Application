const express = require("express");
const router = express.Router();
const { generateAcessToken } = require("../src/token/jwt");
const { Company, Student } = require("../src/db/queries");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/* Login Page */

router.get("/login", (req, res) => {
  res.render("login.pug", {
    message: req.flash("msg"),
  });
});

router.post("/login", async (req, res) => {
  try {
    const { name } = req.body;

    // Empty name
    if (!name) {
      throw new Error("Please enter a name");
    }

    const student = new Student();
    student.insert(name);
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

/* Survey Page */

router.get("/survey", (req, res) => {
  res.render("survey.pug");
});

router.post("/survey", (req, res) => {
  try {
    const { duty, company: name, tags } = req.body;
    const company = new Company();
    company.insert(name);
    res.json(req.body);
  } catch (err) {
    res.json(err);
  }
});
