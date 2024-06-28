const { generateFile } = require("../lib/utils/generateFile.js");
const { executeCpp } = require("../lib/utils/executeCpp.js");

const run_compiler = async (req, res) => {
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
};

const submit_compiler = async (req, res) => {
    
};

module.exports = {
  run_compiler,
  submit_compiler,
};
