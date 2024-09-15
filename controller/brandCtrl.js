import Brand from "../models/brandModel.js";
import asyncHandler from "express-async-handler";
import isValidMongoodbId from "../utils/validateMongooId.js";
// * create brand.
const createBrand = asyncHandler(async (req, res) => {
  try {
    const brand = await Brand.create(req.body);
    res.json(brand);
  } catch (error) {
    throw new Error(error);
  };
});
// * update brand.
const updateBrand = asyncHandler(async (req, res) => {
  // console.log(ProdCategory);
  const { _id } = req.params;
  console.log(_id);
  // remember in this case the _id must be in the endpoint i mean in /api/category/update/:id
  isValidMongoodbId(_id);
  try {
    // const newCategory = await ProdCategory.findByIdAndUpdate(_id , req.body , {
    //   new: true,
    // });
    const newBrand = await Brand.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
    if (!newBrand) console.log("this brand doesnt exist");
    res.json(newBrand);
  } catch (error) {
    throw new Error(error);
  };
});
// * delete brand.
const deleteBrand = asyncHandler(async (req, res) => {
  // console.log(ProdCategory);
  const { _id } = req.params;
  console.log(_id);
  // remember in this case the _id must be in the endpoint i mean in /api/category/update/:id
  isValidMongoodbId(_id);
  try {
    // const newCategory = await ProdCategory.findByIdAndUpdate(_id , req.body , {
    //   new: true,
    // });
    const deletedBrand = await Brand.findByIdAndDelete(_id);
    if (!deletedBrand) console.log("this brand doesnt exist");
    // ? here in this case i wanna just to know if the deletedcategory exists or considered as a one who not exist.
    res.json(deletedBrand);
  } catch (error) {
    throw new Error(error);
  };
});
// * get brand.
const getBrand= asyncHandler(async (req, res) => {
  // console.log(ProdCategory);
  const { _id } = req.params;
  console.log(_id);
  // remember in this case the _id must be in the endpoint i mean in /api/category/update/:id
  isValidMongoodbId(_id);
  try {
    // const newCategory = await ProdCategory.findByIdAndUpdate(_id , req.body , {
    //   new: true,
    // });
    const brand = await Brand.findById(_id);
    if (!brand) console.log("this brand doesnt exist");
    res.json(brand);
  } catch (error) {
    throw new Error(error);
  };
});
const getAllBrands = asyncHandler(async (req, res) => {
  try {
    const allBrands = await Brand.find();
    res.json(allBrands);
  } catch (error) {
    throw new Error(error);
  };
});
export { createBrand, updateBrand, deleteBrand, getBrand, getAllBrands};