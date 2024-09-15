import Blog from "../models/blogModel.js";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import isValidMongoodbId from "../utils/validateMongooId.js";
import cloudinaryUploadImg from "../utils/cloudinary.js";
import fs from "fs";
// console.log("this model has been imported" , User);
// * create blog.
const createBlog = asyncHandler(async (req, res) => {
  try {
    const newBlog = await Blog.create(req.body);
    res.json(newBlog);
  } catch (error) {
    throw new Error(error);
  };
});
// * update blog.
const updateBlog = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  isValidMongoodbId(_id);
  try {
    const updateBlog = await Blog.findByIdAndUpdate({ _id }, req.body, {
      new: true,
    });
    res.json(updateBlog);
  } catch (error) {
    throw new Error(error);
  };
});
// * get blog.
const getBlog = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  isValidMongoodbId(_id);
  try {
    const blog = await Blog.findById(_id).populate('likes').populate("dislikes");
    console.log('Populated blog:', blog);
    const updateUser = await Blog.findByIdAndUpdate(
      { _id },
      { $inc: { numViews: 1 } },
      { new: true }
    );
    // remember here in this case instead of getting the blog in a line and then in another line we update by the id we have done them together.
    res.json(blog);
    } catch (error) {
      console.error("Error in getBlog:", error);
      res.status(500).json({ message: error.message });
    };
});
// * get all blogs.
const getAllBlogs = asyncHandler(async (req, res) => {
  try {
    const allBlogs = await Blog.find();
    res.json(allBlogs);
    //   remember if we dont do the res.json of the finds we wont obtain them in the postman.
  } catch (error) {
    throw new Error(error);
  }
});
// * delete blog.
const deleteBlog = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  isValidMongoodbId(_id);
  try {
    const deleteBlog = await Blog.findByIdAndDelete({ _id });
    res.json(deleteBlog);
  } catch (error) {
    throw new Error(error);
  }
});
// * like.
const likeBlog = asyncHandler(async (req, res) => {
  const { _id } = req.body;
  isValidMongoodbId(_id);
  // find the blog which you wanna like.
  let blog = await Blog.findById(_id);
  res.json(blog);
  // find the login user.
  const loginUserId = req?.user?._id;
  // find if the user has already liked the blog.
  const isLiked = blog?.isLiked;
  // find if the user has already disliked the blog.
  const alreadyDisliked = blog?.dislikes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );
  // remember here in this case the userId represents a single element of the array of the dislikes.
  if (alreadyDisliked) {
    blog = await Blog.findByIdAndUpdate(
      _id,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      { new: true }
    );
  }
  if (isLiked) {
    blog = await Blog.findByIdAndUpdate(
      _id,
      {
        $pull: { likes: loginUserId },
        isLiked: false,
      },
      { new: true }
    );
  } else {
    blog = await Blog.findByIdAndUpdate(
      _id,
      {
        $push: { likes: loginUserId },
        isLiked: true,
      },
      { new: true }
    );
  }
  res.json(blog);
});
// * dislike.
const disLikeBlog = asyncHandler(async (req, res) => {
  const { _id } = req.body;
  isValidMongoodbId(_id);
  // find the blog which you wanna like.
  let blog = await Blog.findById(_id);
  console.log('ID received:', _id);
  // find the login user.
  const loginUserId = req?.user?._id;
  // find if the user has already liked the blog.
  const isDisLiked = blog?.isDisliked;
  // find if the user has already disliked the blog.
  const alreadyliked = blog?.likes?.find(
    (userId) => userId?.toString() === loginUserId?.toString()
  );
  // remember here in this case the userId represents a single element of the array of the dislikes.
  if (alreadyliked) {
    blog = await Blog.findByIdAndUpdate(
      _id,
      {
        $pull: { likes: loginUserId },
        isliked: false,
      },
      { new: true }
    );
  }
  if (isDisLiked) {
    blog = await Blog.findByIdAndUpdate(
      _id,
      {
        $pull: { dislikes: loginUserId },
        isDisliked: false,
      },
      { new: true }
    );
  } else {
    blog = await Blog.findByIdAndUpdate(
      _id,
      {
        $push: { dislikes: loginUserId },
        isDisliked: true,
      },
      { new: true }
    );
  }
   res.json(blog);
});
// * upload images.
const uploadImages2 = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // console.log("this is me cloudinary:" , process.env.a);
  isValidMongoodbId(id);
  console.log("the files we are getting are " , req.files);
  // remember the problem here is not in the files.
  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    // remember in this case the uploader takes the image files and upload them to cloudinary image handler then it places them in a directory named images.
    // remember here for example the path is the path of sharp.
    const urls = [];
    // remember in this case we have initialized the urls array to be empty so it can after be filled by the urls.
    const files = req.files;
    // remember here in this case the files is an array of all the images i wanna upload.
    for (const file of files) {
      const { path } = file;
      // console.log(path);
      // console.log("this is me the path");
      // remember in this case the path is sharp path.
      // remember here each file contains information about the temporary path here we extract them.
      const newPath = await uploader(path);
      console.log("this is me the new file" , file);
      // remember here the path is the one we get from multer.
      // remember in this case i wanna delete the path of this file so i have log the file to see its properties and to check for the one which is responsible for the path i mean the right name in this case i have found it and it is path.
      console.log("this is the new path" , newPath);
      // remember we take the temporary file and upload it in the cloudinary directory which is images.
      // remember here newPath contains a path or url returns by the cloudinary since we have used his uploader function.
      // remember newPath in this case will represents the new path of this image in cloudinary storage.
      urls.push(newPath);
      fs.unlinkSync(path);
      // remember here then we push the newPath to the urls.
    }
    const findBlog = await Blog.findByIdAndUpdate(
      id,
      {
        images: urls.map((file) => {
          return file;
        }),
      },
      { new: true }
    );
    // remember in this case we are trying first to select the product by its id then we are gonna make the updates in this case the field we wanna update is the array of the images where we are gonna replace it with another array of the mapped images in this case we map the urls array which results to creating a new array this one is stored in the images.
    res.json(findBlog);
  } catch (error) {
    throw new Error(error);
  }
});
export { createBlog, updateBlog, getBlog, getAllBlogs, deleteBlog, likeBlog, disLikeBlog, uploadImages2};
