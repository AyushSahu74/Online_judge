const { createSlug } = require("../lib/utils/createSlug");
const Problem = require("../models/Problems");
const User = require("../models/Users");

const problemset = async (req, res) => {
  const {page} = req.body || 1;
  const limit = 10;

  try {
    const problems = await Problem.find(
      {},
      { title: 1, slug: 1, difficulty: 1 }
    )
      .skip((page - 1) * limit)
      .limit(limit);
    res.status(200).json(problems);
  } catch (error) {
    console.log("Error in Problemset controller", error.message);
    res.status(500).json({ error: "Error loading problems" });
  }
};

const addproblem = async (req, res) => {
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
    } = req.body;
    const slug = createSlug(title);

    if (!slug || !title || !statement) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingProblem = await Problem.findOne({ slug });
    if (existingProblem) {
      return res.status(409).json({ message: "Problem already exist" });
    }
    const user = await User.findById(req.user._id);
    const problem = await Problem.create({
      slug,
      title,
      desc,
      input,
      output,
      constraints,
      timelimit,
      statement,
      createdBy: user.username,
      difficulty,
      tags,
      testcase,
    });

    res.status(201).json(problem);
  } catch (error) {
    console.error("Error in addproblem controller", error.message);
    res.status(500).json({ message: "Error adding problem" }); // Generic error message for now
  }
};

const problem = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug || !slug.trim()) {
      return res.status(400).json({ message: "Invalid slug" });
    }

    const problem = await Problem.findOne({ slug });

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    res.status(200).json(problem);
  } catch (error) {
    console.error("Error in problem controller", error.message);
    res.status(500).json({ message: "Error fetching problem" }); // Generic error message for now
  }
};

module.exports = {
  problemset,
  addproblem,
  problem,
};
