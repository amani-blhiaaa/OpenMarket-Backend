import { Router } from "express";
import { createBrand, deleteBrand, getAllBrands, getBrand, updateBrand } from "../controller/brandCtrl.js";
import { authMiddleware , isAdmin } from "../middlewars/authMiddleware.js";
const BrandRouter = Router();
BrandRouter.post("/create" , authMiddleware , isAdmin , createBrand );
BrandRouter.put("/update/:_id" , authMiddleware , isAdmin , updateBrand );
BrandRouter.delete("/delete/:_id" , authMiddleware , isAdmin , deleteBrand );
BrandRouter.get("/brands" , getAllBrands );
// remember here in this case we need to place the categories before the :_id.
BrandRouter.get("/:_id" , getBrand );
export default BrandRouter;