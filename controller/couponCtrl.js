import Coupon from "../models/couponModel.js";
import isValidMongoodbId from "../utils/validateMongooId.js";
import asyncHandler from "express-async-handler";
// * create a coupon.
const createCoupon = asyncHandler(async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.json(coupon);
  } catch (error) {
    throw new Error(error);
  }
});
// * update a coupon.
const updateCoupon = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  isValidMongoodbId(_id);
  try {
    const updateCoupon = await Coupon.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
    res.json(updateCoupon);
  } catch (error) {
    throw new Error(error);
  }
});
// * update a coupon.
const getAllCoupons = asyncHandler(async (req, res) => {
    try {
      const getAllCoupons = await Coupon.find();
      res.json(getAllCoupons);
    } catch (error) {
      throw new Error(error);
    }
});
// * delete a coupon.
const deleteCoupon = asyncHandler(async (req, res) => {
    const { _id } = req.params;
    try {
      const deleteCoupon = await Coupon.findByIdAndDelete(_id);
      res.json(deleteCoupon);
    } catch (error) {
      throw new Error(error);
    }
});
export { createCoupon , updateCoupon , getAllCoupons, deleteCoupon,};
