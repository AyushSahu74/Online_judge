const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.route.js");
const problemRoutes = require("./routes/problem.route.js");
const compilerRoutes = require("./routes/compiler.route.js");

// Assuming DBConnection is exported from a file named db.js
const { DBConnection } = require("./database/db.js");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: "5mb" })); // to parse req.body
// limit shouldn't be too high to prevent DOS
app.use(express.urlencoded({ extended: true })); // to parse form data(urlencoded)

app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/prob", problemRoutes);
app.use("/api/compile", compilerRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  DBConnection();
});
