import { Router } from "express";
import { authMiddleware, isAdmin } from "../middlewars/authMiddleware.js";
import {
  createCoupon,
  deleteCoupon,
  getAllCoupons,
  updateCoupon,
} from "../controller/couponCtrl.js";
const couponRouter = Router();
couponRouter.post("/create", authMiddleware, isAdmin, createCoupon);
// remember because only admin can create coupon.
couponRouter.put("/update", authMiddleware, isAdmin, updateCoupon);
couponRouter.get("/coupons", authMiddleware, isAdmin, getAllCoupons);
couponRouter.put("/update/:_id", authMiddleware, isAdmin, updateCoupon);
couponRouter.delete("/delete/:_id", authMiddleware, isAdmin, deleteCoupon);
export default couponRouter;
