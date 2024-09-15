import multer from "multer";
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs'
// Get the current directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const multerStorage = multer.diskStorage({
  destination: function (req, file, cb) {

    ;
    cb(null , path.join(__dirname, "../public/images"));
  },
  //   remember in this case we construct where this uploads are gonna be saved.
  // remember here null means that there is no error and the second parameter is the one who constructs the url where this uploaded image will be saved in this case it takes the current directory name and add to it the two /uploads/images.
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    //  remember in this case the Date.now retrieve the current date in millie second i mean the number of seconds since January 1, 1970.
    // remember here by default the math.random generates a random floating number between 0 and 1 when we do *1e9 it makes the range of the numbers between 0 to 1,000,000,000 and then we use the math.round.
    cb(null, file.fieldname + "-" + uniqueSuffix + ".jpeg");
    //  remember in this case the output will be profilePic-13940084297-348937.jpeg.
    //  remember here in this case the field name is the one we extract it from the form of the html.
    // remember  <form action="/upload" method="POST" enctype="multipart/form-data">
    // remember  <input type="file" name="profilePic" />
    // remember  <button type="submit">Upload</button>
    // remember </form> in this case the fieldname is profilePic.
    // remember When the form is submitted, Multer extracts the file field name and uses it to construct the file name as defined in your filename function.
    // remember in this case the best practise i mean in the html form is to make the name consistent not dynamic.
  },
});
// remember as for the filename function it defines how the uploaded file will be named.
// remember
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb({ message: "unsupported file format" }, false);
  }
};
// remember The file object has a property called mimetype, which represents the MIME type of the file. A MIME type is a string that identifies the type of file based on its content.
// remember in this case if the file is an image which means that its mime starts with image then in this case the condition is true when it s true the callback function in the place of the error we will have null which means no error otherwise if not then in this case it is false then the second condition is the one which will be executed in this case and the place where the error we have the message this is not an image.

const uploadPhoto = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fieldSize: 2000000 },
  // remember here in this case the limits option sets restrictions on various aspects of the uploaded file in this case we set for the size which is defined by bytes.
});
// remember this is a middleware we have defined using multer.
// remember here in this case we have passed an object to multer to how configurate the upload.
// remember here we first have specified the storage which means where to store the upload image in this case in the multerstorage which we have defined before.
// remember multerStorage is likely defined elsewhere in your code (as shown in your earlier example), where you use multer.diskStorage to specify the destination and filename for uploaded files.
const productImgResize = async (req, res, next) => {
  if (!req.files) return next();
  try {
    await Promise.all(
      req.files.map(async (file) => {
        await sharp(file.path)
          .resize(300, 300)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`public/images/products/${file.filename}`);
          fs.unlinkSync(`public/images/products/${file.filename}`);
      })
      // remember here in reality i dont need to put the images in products or blogs since we after pass them to cloudinary using the multer path but we do this since we need to store the new images that we have already updated.
    );
    //  remember here i have done this to delete the images from the sharp destination.
    next();
  } catch (error) {
    console.error('Error resizing product images:', error);
    res.status(500).json({ message: 'Failed to process images' });
  }
};

const blogImgResize = async (req, res, next) => {
  if (!req.files) return next();
    // remember in this case if the request doesnt contain any files we pass the control to the next function in the order in the routing system.
  try {
    await Promise.all(
          // remember in this case promise.all is used to create an array of promises when all the promises are finished it returns a single promise.
      req.files.map(async (file) => {
              // remember here in this case we are gonna created a new array where each element of it is the result of the promise, the elements of the new array are the result of the callback function.
        await sharp(file.path)
              // remember when we work with sharp we provide the full path which is specified after using the multerstorage function.
          .resize(300, 300)
                  // remember here the length is 300 and the width is the same.
          .toFormat("jpeg")
                  // remember here we convert the format fo jpeg.
          .jpeg({ quality: 90 })
                  // remember here the bigger is the best is but at the same time the more larger file size.
          .toFile(`public/images/blogs/${file.filename}`);
          fs.unlinkSync(`public/images/blogs/${file.filename}`);
      })
      // remember here in reality i dont need to put the images in products or blogs since we after pass them to cloudinary using the multer path but we do this since we need to store the new images that we have already updated.
    );
    //  remember here i have done this to delete the images from the sharp destination.
    next();
  } catch (error) {
    console.error('Error resizing product images:', error);
    res.status(500).json({ message: 'Failed to process images' });
  }
};
// remember this function is used to resize the images uploaded in a standard foramt, and this is done before saving them in their specific storage using the multerstorage function.

export { uploadPhoto , blogImgResize , productImgResize };
