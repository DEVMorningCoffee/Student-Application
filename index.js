const express = require("express");
const flash = require("connect-flash");
const session = require("express-session");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { decodeAccessToken } = require("./src/token/jwt");
const moment = require("moment");
const {
  Company,
  Student,
  Tag,
  Internship,
  InternshipTag,
} = require("./src/db/queries");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: true,
  })
);
app.use(flash());
app.use(cors());
app.use(cookieParser());

// Setup Pug
app.set("view engine", "pug");
app.use(express.static("public"));

app.get("/", async (req, res) => {
  try {
    const { token } = req.cookies;

    if (token == null) throw new Error("No token");

    const { name: stuName } = decodeAccessToken(token);

    const student = new Student();
    const { id: stuId } = await student.find(stuName);

    const internship = new Internship();
    let results = await internship.findSurvey(stuId);

    const company = new Company();

    let newResults = [];
    for (let i = 0; i < results.length; i++) {
      const { name: compName } = await company.findCompany(
        results[i].companyId
      );

      const startDate = moment(results[i].startDate).utc().format("DD-MM-YYYY");
      const endDate = moment(results[i].endDate).utc().format("DD-MM-YYYY");
      const description = results[i].description;

      newResults[i] = { stuName, compName, startDate, endDate, description };
    }

    res.render("home.pug", { newResults });
  } catch (error) {
    req.flash("msg", error.message);
    res.redirect("/login");
  }
});

app.use("/", require("./routes/router"));
app;

app.listen(PORT, () => {
  console.log(`You are listening on port: ${PORT}`);
});
