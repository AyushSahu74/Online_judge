const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = (filepath, input) => {
    const jobId = path.basename(filepath).split(".")[0];
    const filename = `${jobId}.exe`;
    const outPath = path.join(outputPath, filename);
  
    return new Promise((resolve, reject) => {
      // Create a temporary file to store the input data
    //   const fs = require('fs'); // Import the 'fs' module for file operations
      const tempInputFile = path.join(outputPath, `${jobId}.in`); // Create a temporary input file
  
      fs.writeFile(tempInputFile, input, (err) => {
        if (err) {
          reject({ error: "Error creating temporary input file", stderr: err });
          return;
        }
  
        // Execute the C++ program with redirection for input and output
        exec(
          `g++ ${filepath} -o ${outPath} && cd ${outputPath} && .\\${jobId}.exe < ${tempInputFile} `,
          (error, stdout, stderr) => {
            fs.unlink(tempInputFile, (unlinkErr) => { // Clean up the temporary file
              if (unlinkErr) {
                console.error("Error deleting temporary input file:", unlinkErr);
              }
  
              if (error) {
                reject({ error, stderr });
              } else if (stderr) {
                reject(stderr);
              } else {
                resolve(stdout);
              }
            });
          }
        );
      });
    });
  };

module.exports = {
    executeCpp,
};