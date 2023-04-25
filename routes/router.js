const express = require("express");
const router = express.Router();
const { generateAcessToken, decodeAccessToken } = require("../src/token/jwt");
const { DateFormat } = require("../src/format/date");
const moment = require("moment");
const {
  Company,
  Student,
  Tag,
  Internship,
  InternshipTag,
  formatResults,
} = require("../src/db/queries");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const company = new Company();
const student = new Student();
const tag = new Tag();
const internship = new Internship();
const date = new DateFormat();

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

    await student.insert(name);

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

/* Survey Page */

router.get("/survey", (req, res) => {
  res.render("survey.pug");
});

router.post("/survey", async (req, res) => {
  try {
    const {
      description,
      company: compName,
      tags,
      startDate,
      endDate,
    } = req.body;

    const { token } = req.cookies;

    if (token == null) throw new Error("No token");

    const { name: stuName } = decodeAccessToken(token);

    const { id: stuId } = await student.insert(stuName);

    const { id: compId } = await company.insert(compName);

    await internship.insert(
      date.formatToISO(startDate),
      date.formatToISO(endDate),
      description,
      stuId,
      compId
    );

    res.redirect("/");
  } catch (err) {
    res.flash("msg", err.message);
    res.redirect("/login");
  }
});

router.post("/filter/company", async (req, res) => {
  try {
    let filterName = req.body.name;

    const { id } = await company.findCompanyByName(filterName);
    const results = await internship.findByCompanyId(id);

    const newResults = await formatResults(results);

    res.render("filter.pug", { newResults });
  } catch (err) {
    req.flash("msg", "Company don't exist");
    res.redirect("/");
  }
});

router.get("/survey/edit", async (req, res) => {
  try {
    const { id } = req.query;

    const results = await internship.findById(id);
    const [a] = await formatResults([results]);
    a.id = id;

    res.render("surveyEdit.pug", { a });
  } catch (err) {
    req.flash("msg", err.message);
    res.redirect("/login");
  }
});

router.post("/survey/edit", async (req, res) => {
  const formResult = req.body;

  const { id: companyId } = await company.insert(formResult.company);
  formResult.company = companyId;
  formResult.startDate = date.formatToISO(formResult.startDate);
  formResult.endDate = date.formatToISO(formResult.endDate);

  const result = await internship.updateInternship(formResult);
  res.redirect("/");
});

module.exports = router;
