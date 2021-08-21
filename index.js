const express = require("express");
const cors = require("cors");

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const Session = require("express-session");
const flash = require('connect-flash');

const db = require("./db");
const projectRouter = require("./routes/project-router");
const eventRouter = require("./routes/event-router");
const lectureRouter = require("./routes/lecture-router");
const galleryRouter = require("./routes/gallery-router");
const authRouter = require("./routes/auth-router");
const userProfileRouter = require("./routes/user-profile-router");
const User = require("./models/user");
const contactRouter = require("./routes/contact-router");
const userRouter = require("./routes/user-router");
const noticesRouter = require("./routes/notices-router");
const formsRouter = require("./routes/form-router");
const applicantRouter = require("./routes/applicant-router");

const app = express();
const apiPort = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

app.use(
  Session({ secret: "Thisissecret", resave: true, saveUninitialized: true })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api", authRouter);
app.use("/api", userProfileRouter);
app.use("/api", projectRouter);
app.use("/api", eventRouter);
app.use("/api", lectureRouter);
app.use("/api", galleryRouter);
app.use("/api", contactRouter);
app.use("/api", userRouter);
app.use("/api", noticesRouter);
app.use("/api", formsRouter);
app.use("/api", applicantRouter);
app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`));
