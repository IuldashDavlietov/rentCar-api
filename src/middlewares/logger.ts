/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
// $ npm i morgan
// $ npm i -D @types/morgan
// app.use(logger):

import fs from "node:fs";
import path from "node:path";
import morgan from "morgan";

const now = new Date();
const today = now.toISOString().split("T")[0];

// Relative to where the app starts, so it is the same folder under tsx and dist.
const logDirectory = path.resolve("logs");

if (!fs.existsSync(logDirectory)) {
  console.log("Logs folder has been created ");
  fs.mkdirSync(logDirectory, { recursive: true });
} else console.log("Logs folder is exist");

const logStream = fs.createWriteStream(path.join(logDirectory, `${today}.log`), { flags: "a+" });

export default morgan("combined", {
  stream: logStream,
});
