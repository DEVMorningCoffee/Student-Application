const express = require("express");
const flash = require("connect-flash");
const session = require("express-session");
const cors = require("cors");
const cookieParser = require("cookie-parser");
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

app.get("/", (req, res) => {
  const msg = req.flash("msg");
  res.send(msg);
});

app.use("/", require("./routes/router"));
app;

app.listen(PORT, () => {
  console.log(`You are listening on port: ${PORT}`);
});
