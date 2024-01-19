import fs from "fs";
import path from "path";

const _dirName = "";
const logger = (req, res, next) => {
  // Log request details to a file
  const logFilePath = path.join("./", "server.log");
  const logData = `${req.method} ${req.url}- ${new Date().toISOString()} \n`;

  fs.appendFile(logFilePath, logData, (err) => {
    if (err) {
      console.error("Error writing to log file:", err);
    }
  });

  next();
};
export default logger;
