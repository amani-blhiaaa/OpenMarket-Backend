//import express from "express"
import { Router } from "express";
import {
  createUser,
  loginUser,
  getAllUsers,
  getUserId,
  deleteUserId,
  updateUserId,
  blockUserId,
  unBlockUserId,
  handleRefreshToken,
  logout,
  updatePassword,
  forgotPasswordToken,
  reserPassword,
  loginAdmin,
  getWishlist,
  saveUserAddress,
  userCart,
  getUserCart,
  emptyCart,
  applyCoupon,
  createOrder,
  getOrders,
  updateOrders,
} from "../controller/userCtrl.js";
import { authMiddleware, isAdmin } from "../middlewars/authMiddleware.js";
// remember here i need just the router packages so i dont need to import the whole express.
const authRouter = Router();
authRouter.post("/create_order" , authMiddleware , createOrder);

authRouter.post("/register", createUser);
authRouter.post("/loginAdmin", loginAdmin);
authRouter.post("/login", loginUser);
authRouter.post("/forgot_password_token", forgotPasswordToken);
authRouter.post("/create_the_cart", authMiddleware , userCart);
authRouter.post("/apply_coupon" , authMiddleware , applyCoupon);
authRouter.put("/reset_password/:token", reserPassword);
authRouter.get("/Users", getAllUsers);
authRouter.get("/orders" , authMiddleware ,getOrders);
authRouter.get("/user", authMiddleware, isAdmin, getUserId);
authRouter.get("/logout", logout);
authRouter.get("/get_the_cart" , authMiddleware ,getUserCart);
authRouter.delete("/delete_cart" , authMiddleware , emptyCart);
authRouter.delete("/:id", deleteUserId);
authRouter.put("/edit_user", authMiddleware, updateUserId);
authRouter.put("/update_order_status/:id" , authMiddleware , isAdmin , updateOrders);
authRouter.put("/block_user/:id", authMiddleware, isAdmin, blockUserId);
authRouter.put("/unblock_user/:id", authMiddleware, isAdmin, unBlockUserId);
// remember here for example the problem was in the function i was passing.
authRouter.get("/refresh", handleRefreshToken);
authRouter.put("/update_password", authMiddleware, updatePassword);
authRouter.get("/wishlist", authMiddleware, getWishlist);
authRouter.put("/address", authMiddleware, saveUserAddress);
// remember here we need to use the authmidleware because with its help we get the updatepassword.
export default authRouter;
