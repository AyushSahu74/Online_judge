const express = require("express");
const app = express();
const { DBConnection } = require("./database/db.js");
const User = require("./models/Users.js");
const Problem = require("./models/Problems.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const { generateFile } = require("./lib/utils/generateFile.js");
const { executeCpp } = require("./lib/utils/executeCpp.js");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
dotenv.config();

const cors = require("cors");
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());

DBConnection();

app.get("/", (req, res) => {
  res.send("Welcome");
});

app.post("/register", async (req, res) => {
  console.log(req.body);
  try {
    const { firstname, lastname, username, email, password } = req.body;

    if (!(firstname, lastname, username, email, password)) {
      return res
        .status(400)
        .json({ message: "Please enter all required fields!" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "User already exists!Choose a different email." });
    }
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(409).json({ message: "Username already taken." });
    }

    const hashPassword = bcrypt.hashSync(password, 10);
    console.log(hashPassword);

    const user = await User.create({
      firstname,
      lastname,
      username,
      email,
      password: hashPassword,
    });

    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    user.token = token;
    user.password = undefined;

    const options = {
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.status(201).cookie("token", token, options).json({
      message: "Registration Succesfull",
      success: true,
      token,
    });
  } catch (error) {
    console.log(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      return res.status(400).json({ message: "Please enter full details" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const entered_password = await bcrypt.compare(password, user.password);
    if (!entered_password) {
      return res.status(401).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { id: encodeURIComponent(user._id) },
      process.env.SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );
    user.token = token;
    user.password = undefined;

    const options = {
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    res.status(200).cookie("token", token, options).json({
      message: "Log in successful!",
      success: true,
      token,
    });
  } catch (error) {
    console.log(error);
  }
});

function createSlug(title) {
  title = title.toLowerCase();
  title = title.trim();
  title = title.replace(/\s+/g, "-");
  title = title.replace(/[^a-z0-9\-]+/g, "");
  title = title.substring(0, 45);
  return title;
}

app.post("/addproblems", async (req, res) => {
  try {
    const {
      title,
      desc,
      input,
      output,
      constraints,
      timelimit,
      statement,
      createdBy,
      difficulty,
      tags,
      testcase,
    } = req.body; // Destructure title and other data
    const slug = createSlug(title); // Generate the slug

    if (!slug || !title || !statement) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingProblem = await Problem.findOne({ slug }); // Check for duplicate slug
    if (existingProblem) {
      return res.status(409).json(slug);
    }

    const problem = await Problem.create({
      slug,
      title,
      desc,
      input,
      output,
      constraints,
      timelimit,
      statement,
      createdBy,
      difficulty,
      tags,
      testcase,
    });

    res.status(201).json(problem); // Respond with the created problem
  } catch (error) {
    console.error("Error adding problem:", error);
    res.status(500).json({ message: "Error adding problem" }); // Generic error message for now
  }
});

app.get("/problemset", async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Get page number from query parameter (default 1)
  const limit = 10; // Number of problems per page

  try {
    const problems = await Problem.find(
      {},
      { title: 1, slug: 1, difficulty: 1 }
    ) // Select specific fields
      .skip((page - 1) * limit) // Skip problems for previous pages
      .limit(limit); // Limit the number of problems returned
    res.json(problems);
  } catch (error) {
    res.status(500).send("Error fetching problems");
  }
});

app.get("/problem/:slug", async (req, res) => {
  try {
    const { slug } = req.params; // Extract slug from request parameters

    // Validate slug (optional, but recommended for security)
    if (!slug || !slug.trim()) {
      return res.status(400).json({ message: "Invalid slug" });
    }

    const problem = await Problem.findOne({ slug }); // Find problem by slug

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    res.json(problem); // Respond with the found problem
  } catch (error) {
    console.error("Error fetching problem:", error);
    res.status(500).json({ message: "Error fetching problem" }); // Generic error message for now
  }
});

app.get("/users/:username", async (req, res) => {
  try {
    const { username } = req.params; // Extract username from request parameters

    // Validate username (optional, but recommended for security)
    if (!username || !username.trim()) {
      return res.status(400).json({ message: "Invalid username" });
    }

    const user = await User.findOne({ username }); // Find user by username

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Consider security implications before returning all user data (optional)
    // You might want to exclude sensitive fields like password or tokens.
    res.json(user); // Respond with the found user
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Error fetching user" }); // Generic error message for now
  }
});

app.get("/user_info", async (req, res) => {
  // Try to retrieve the token from the cookie
  const token = req.cookies.token;
  // If no token is found, return an error
  if (!token) {
    return res.status(401).send("Unauthorized: Missing token");
  }

  try {
    // Verify the token using the SECRET_KEY
    const _id = jwt.verify(token, process.env.SECRET_KEY);
    // Extract the user ID from the decoded token
    const user = await User.findById(_id.id).select("username");

    // Return the user ID in the response
    return res.status(200).json(user);
  } catch (err) {
    // Handle errors during verification (e.g., invalid token)
    console.error("Error verifying token:", err);
    return res.status(401).send("Unauthorized: Invalid token");
  }
});

app.get("/logout", async (req, res) => {
  try {
    res.clearCookie("token"); // Assuming your token is stored in a cookie named 'token'

    // Redirect to login or another appropriate page
    return res.status(200).json({ message: "Logout successfull" });
  } catch (err) {
    console.error("Error during logout:", err);
    res.status(500).send("Internal server error");
  }
});

app.post("/run", async (req, res) => {
  // const language = req.body.language;
  // const code = req.body.code;

  const { language = "cpp", code, input } = req.body;
  if (code === undefined) {
    return res.status(404).json({ success: false, error: "Empty code!" });
  }
  try {
    const filePath = await generateFile(language, code);
    const output = await executeCpp(filePath, input);
    res.json({ filePath, output });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error_" + error.message });
  }
});

app.listen(8000, () => {
  console.log("Server 8000");
});
