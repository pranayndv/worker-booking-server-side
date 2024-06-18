// import multer from "multer";

// const storage = multer.memoryStorage();

// const singleUpload = multer({ storage }).single("file");

// export default singleUpload;
import fs from "fs";
import multer from "multer";

// Create the destination directory if it doesn't exist
const destinationDirectory = "./uploads";
if (!fs.existsSync(destinationDirectory)) {
  fs.mkdirSync(destinationDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(file);
    cb(null, destinationDirectory);
  },
  filename: function (req, file, cb) {
    console.log(file);
    cb(null, file.originalname);
  },
});

export const upload = multer({
  storage,
});
