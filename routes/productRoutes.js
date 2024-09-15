import { Router } from "express";
import {
  addToWishList,
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  rating,
  updateProduct,
  uploadImages,
} from "../controller/productCtrl.js";
import { isAdmin, authMiddleware } from "../middlewars/authMiddleware.js";
import { productImgResize, uploadPhoto } from "../middlewars/uploadImages.js";


const productRouter = Router();
productRouter.post("/create", authMiddleware, isAdmin, createProduct);
// remember here since from the authmiffleware we construct the req.user and this one we use it in the isadmin so we need to start with it.
productRouter.get("/products", getAllProducts);
productRouter.get("/test", authMiddleware , (req ,res) => {
    res.json({ message: "Auth middleware passed", user: req.user });
});
productRouter.get("/:id", getProduct);
productRouter.post("/upload/:id" , authMiddleware , isAdmin , uploadPhoto.array('images' , 10 ) , productImgResize, uploadImages);
// remember here in this case first we should upload the images then after resizing them then after we upload them in the normal way.
// remember here the problem was that in the postman where i made mistakes in the name of the request i mean exactly i have forgot the upload in the request.
productRouter.put("/addToWishListt", authMiddleware, addToWishList);
productRouter.put("/rating" , authMiddleware , rating);
productRouter.put("/:id", authMiddleware, isAdmin , updateProduct);
productRouter.delete("/:id", authMiddleware, isAdmin ,deleteProduct);

// productRouter.get("/products" , getAllProducts );
// productRouter.get("/products", getAllProducts);
// remember here if we want to use produsts method we are asked to make it before the dynamic ones to not mix between the static and the dynamic in this case if we place create after the dynamic it wont cause a problem since this one use the post method.
// remember in general the method type p
export default productRouter;
