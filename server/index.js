const express = require("express");
const dotenv = require("dotenv");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const MongoStore = require("connect-mongo");
const { DBConnection } = require("./database/db");

dotenv.config();
const app = express();

require("./config/passport")(passport);

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

DBConnection();

app.use("/api/code", require("./routes/code"));
app.use("/api/problem", require("./routes/problem"));
app.use("/api/auth", require("./routes/auth"));

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/failed",
  }),
  (req, res) => {
    res.redirect("http://localhost:5173/");
  }
);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log("Server is listening"));
