const mongoose = require("mongoose");

const SubmissionSchema = new mongoose.Schema({
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Problem",
  },
  username: { type: String, required: true },
  verdict: { type: String, required: true },
  code: { type: String },
  time: { type: Number },
  memoryUsage: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

const ProblemSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // Convert to lowercase for consistency
      trim: true,       // Remove leading/trailing whitespaces
      minlength: 3,     // Minimum length for readability
    },
    title: {
      type: String,
      required: true,
    },
    desc: { type: String },
    input: { type: String },
    whoSolved: [{ type: String }],
    output: { type: String },
    constraints: { type: String },
    timelimit: { type: Number, default: 5.0 },
    statement: { type: String, required: true },
    createdBy: { type: String, required: true },
    difficulty: { type: String, default: "easy" },
    tags: [{ type: String }],
    submissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Submission" }],
    testcase: [
      {
        input: { type: String },
        output: { type: String },
        sample: { type: Boolean },
        explanation: { type: String },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Problem", ProblemSchema);
// module.exports = {
//   Problem: mongoose.model("Problem", ProblemSchema),
//   Submission: mongoose.model("Submission", SubmissionSchema),
// };
