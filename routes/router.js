const express = require("express");
const router = express.Router();
const { generateAcessToken, decodeAccessToken } = require("../src/token/jwt");
const moment = require("moment");
const {
  Company,
  Student,
  Tag,
  Internship,
  InternshipTag,
} = require("../src/db/queries");
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

router.post("/survey", async (req, res) => {
  try {
    const { duty, company: compName, tags, startDate, endDate } = req.body;
    const newTagsArr = [...tags];

    const { token } = req.cookies;

    if (token == null) throw new Error("No token");

    const { name: stuName } = decodeAccessToken(token);

    const student = new Student();
    const { id: stuId } = await student.insert(stuName);

    const company = new Company();
    const { id: compId } = await company.insert(compName);

    const internship = new Internship();
    const { id: internId } = await internship.insert(
      moment(startDate).toISOString(),
      moment(endDate).toISOString(),
      duty,
      stuId,
      compId
    );

    const tag = new Tag();
    const internshipTag = new InternshipTag();

    for (const val of newTagsArr) {
      const { id: tagId } = await tag.insert(val);
      await internshipTag.insert(internId, tagId);
    }

    res.redirect("/");
  } catch (err) {
    res.flash("msg", err.message);
    res.redirect("/login");
  }
});
