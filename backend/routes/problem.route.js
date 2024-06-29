const express = require("express");

const problemController = require("../controllers/problem.controller.js");
const { problemset, addproblem, problem } = problemController;

const protectRoute = require("../middleware/protectRoute.js");
const protectRouteadmin = require("../middleware/protectRouteadmin.js");
const router = express.Router();

router.post("/problemset", problemset);
router.post("/addproblem", protectRouteadmin, addproblem);
router.get("/problem/:slug", problem);

module.exports = router;
