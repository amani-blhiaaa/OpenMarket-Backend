import cloudinary from "cloudinary";
import dotenv from "dotenv";
import expressAsyncHandler from "express-async-handler";
KOdotenv.config();
cloudinary.config({
  cloud_name: process.env.a,
  api_key: process.env.b,
  api_secret: process.env.c,
});
const cloudinaryUploadImg = async (fileToupload) => {
  return new Promise((resolve) => {
    cloudinary.uploader.upload(fileToupload, (result) => {
      resolve({ url: result.secure_url }, { resource_type: "auto" });
    });
  });
};

// remember in this case we have configured our cloudinary.

// remember here cloudinaryUploadImg is an asynchroneous function that takes as parameter the file we wanna upload.
// remember then it constructs a promise object and in this promise if this promise is successed we will return resolve.
// remember the promise upload the file using the method cloudinary.uploader.upload.
// remember in case of the success the resolve will contains the url and the resource type is automatic.
export default cloudinaryUploadImg;
