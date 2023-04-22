const express = require("express");
const flash = require("connect-flash");
const session = require("express-session");
const cors = require("cors");
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

app.get("/", (req, res) => {
  res.send("Home Page");
});

app.use("/", require("./routes/loginPage"));

app.listen(PORT, () => {
  console.log(`You are listening on port: ${PORT}`);
});
