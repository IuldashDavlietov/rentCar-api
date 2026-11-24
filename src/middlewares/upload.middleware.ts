/* -------------------------------------------------------
    | FULLSTACK TEAM | NODEJS / EXPRESS |
------------------------------------------------------- */
// Middleware: upload
// npm i multer
// npm i -D @types/multer

// Multer: UploadFile:
// https://expressjs.com/en/resources/middleware/multer.html
import multer from "multer";

export default multer({
  storage: multer.diskStorage({
    destination: "./upload/",
    filename: (req, file, returnCallback) => {
      returnCallback(null, file.originalname);
    },
  }),
});
