const express = require("express");

const compilerController = require("../controllers/compiler.controller.js");
const { run_compiler, submit_compiler } = compilerController;

const router = express.Router();

router.post("/run", run_compiler);
router.post("/submit", submit_compiler);

module.exports = router;
