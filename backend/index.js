const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.route.js");
const problemRoutes = require("./routes/problem.route.js");
const compilerRoutes = require("./routes/compiler.route.js");


const { DBConnection } = require("./database/db.js");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

const cors = require("cors");
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/prob", problemRoutes);
app.use("/api/compile", compilerRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  DBConnection();
});
