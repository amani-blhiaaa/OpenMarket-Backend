import { Router } from "express";
import { updateBlog , createBlog , getBlog, getAllBlogs, deleteBlog, likeBlog, disLikeBlog, uploadImages2 } from "../controller/blogCtrl.js";
import { authMiddleware , isAdmin } from "../middlewars/authMiddleware.js";

import { blogImgResize, uploadPhoto } from "../middlewars/uploadImages.js";
// remember never forget to use the .js.
const blogRouter = Router();
blogRouter.post("/create" , authMiddleware , isAdmin , createBlog );
blogRouter.post("/upload/:id", authMiddleware , isAdmin , uploadPhoto.array("images" ,10) , blogImgResize , uploadImages2 )
blogRouter.put("/update/:_id" , authMiddleware , isAdmin , updateBlog );
blogRouter.get("/allBlogs" , getAllBlogs );
// remember here we need to place the allblogs before the get by id if we dont do this we will face problem of casting string to objectid which is impossible in our case.
blogRouter.get("/:_id" , getBlog );
blogRouter.delete("/:_id" , authMiddleware , isAdmin , deleteBlog );
blogRouter.put("/like" , authMiddleware , likeBlog );
blogRouter.put("/dislike" , authMiddleware , disLikeBlog );
export default blogRouter;