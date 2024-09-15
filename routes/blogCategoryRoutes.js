import { Router } from "express";
import { createBlogCategory, deleteBlogCategory, getAllBlogCategories, getBlogCategory, updateBlogCategory } from "../controller/blogCategoryCtrl.js";
import { authMiddleware , isAdmin } from "../middlewars/authMiddleware.js";
const BlogCategoryRouter = Router();
BlogCategoryRouter.post("/create" , authMiddleware , isAdmin , createBlogCategory );
BlogCategoryRouter.put("/update/:_id" , authMiddleware , isAdmin , updateBlogCategory );
BlogCategoryRouter.delete("/delete/:_id" , authMiddleware , isAdmin , deleteBlogCategory);
BlogCategoryRouter.get("/categories" , getAllBlogCategories);
// remember here in this case we need to place the categories before the :_id.
BlogCategoryRouter.get("/:_id" , getBlogCategory);
export default BlogCategoryRouter;