import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure the directory exists
const uploadDirectory = path.join(process.cwd(), "public/temp");
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDirectory);
  },
  filename: function (req, file, cb) {
    // Create a unique filename to avoid conflicts
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

export const upload = multer({ storage });
