import cloudinary from "../config/cloudinary.js";

const uploadMultipleFiles = async (files) => {
  const urls = await Promise.all(
    files.map(
      (file) =>
        new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { folder: "products" }, // Server handles signing automatically
            (error, result) => {
              if (error) return reject(error);
              resolve(result.secure_url);
            }
          ).end(file.buffer);
        })
    )
  );
  return urls;
};

export default uploadMultipleFiles;
