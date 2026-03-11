import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const fileUploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "image",
    });

    await fs.unlink(localFilePath);
    // console.log(response);
    return response;
  } catch (error) {
    await fs.unlink(localFilePath);
    console.log("error", error);
    return null;
  }
};

const deleteFileOnCloudinary = async (public_id) => {
  if (!public_id) return null; // Check if public_id is provided

  try {
    const response = await cloudinary.api.delete_resources(public_id, {
      resource_type: "image",
    });
    return response;
  } catch (error) {
    console.error("Error deleting file:", error);
    return { success: false, error: error.message };
  }
};

export { fileUploadOnCloudinary, deleteFileOnCloudinary };
