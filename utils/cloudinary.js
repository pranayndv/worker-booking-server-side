import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    //upload the file on cloudinary
    const uploadOptions = { folder: "SHF" }; // Customize folder name if needed

    // Use cloudinary.uploader.upload to upload the image directly from the URL
    const result = await cloudinary.uploader.upload(imageUrl, uploadOptions);

    // file has been uploaded successfull
    console.log("file is uploaded on cloudinary ", response.url);
    fs.unlinkSync(localFilePath);
    return result;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed
    return null;
  }
};

export { uploadOnCloudinary };
