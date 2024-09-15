import { Router } from "express";
import { createProdCategory, deleteProdCategory, getAllProdCategory, getProdCategory, updateProdCategory,  } from "../controller/prodCategoryCtrl.js";
import { authMiddleware , isAdmin } from "../middlewars/authMiddleware.js";
const ProdCategoryRouter = Router();
ProdCategoryRouter.post("/create" , authMiddleware , isAdmin , createProdCategory );
ProdCategoryRouter.put("/update/:_id" , authMiddleware , isAdmin , updateProdCategory );
ProdCategoryRouter.delete("/delete/:_id" , authMiddleware , isAdmin , deleteProdCategory);
ProdCategoryRouter.get("/categories" , getAllProdCategory);
// remember here in this case we need to place the categories before the :_id.
ProdCategoryRouter.get("/:_id" , getProdCategory);
export default ProdCategoryRouter;