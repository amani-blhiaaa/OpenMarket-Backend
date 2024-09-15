import ProdCategory from "../models/prodCategoryModel.js";
import asyncHandler from "express-async-handler";
import isValidMongoodbId from "../utils/validateMongooId.js";
// * create category.
const createProdCategory = asyncHandler(async (req, res) => {
  try {
    const category = await ProdCategory.create(req.body);
    res.json(category);
  } catch (error) {
    throw new Error(error);
  };
});
// * update category.
const updateProdCategory = asyncHandler(async (req, res) => {
  // console.log(ProdCategory);
  const { _id } = req.params;
  console.log(_id);
  // remember in this case the _id must be in the endpoint i mean in /api/category/update/:id
  isValidMongoodbId(_id);
  try {
    // const newCategory = await ProdCategory.findByIdAndUpdate(_id , req.body , {
    //   new: true,
    // });
    const newCategory = await ProdCategory.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
    if (!newCategory) console.log("this category doesnt exist");
    res.json(newCategory);
  } catch (error) {
    throw new Error(error);
  };
});
// * delete category.
const deleteProdCategory = asyncHandler(async (req, res) => {
  // console.log(ProdCategory);
  const { _id } = req.params;
  console.log(_id);
  // remember in this case the _id must be in the endpoint i mean in /api/category/update/:id
  isValidMongoodbId(_id);
  try {
    // const newCategory = await ProdCategory.findByIdAndUpdate(_id , req.body , {
    //   new: true,
    // });
    const deletedCategory = await ProdCategory.findByIdAndDelete(_id);
    if (!deletedCategory) console.log("this category doesnt exist");
    // ? here in this case i wanna just to know if the deletedcategory exists or considered as a one who not exist.
    res.json(deletedCategory);
  } catch (error) {
    throw new Error(error);
  };
});
// * get category.
const getProdCategory = asyncHandler(async (req, res) => {
  // console.log(ProdCategory);
  const { _id } = req.params;
  console.log(_id);
  // remember in this case the _id must be in the endpoint i mean in /api/category/update/:id
  isValidMongoodbId(_id);
  try {
    // const newCategory = await ProdCategory.findByIdAndUpdate(_id , req.body , {
    //   new: true,
    // });
    const Category = await ProdCategory.findById(_id);
    if (!Category) console.log("this category doesnt exist");
    res.json(Category);
  } catch (error) {
    throw new Error(error);
  };
});
const getAllProdCategory = asyncHandler(async (req, res) => {
  // console.log(ProdCategory);
  try {
    const allCategory = await ProdCategory.find();
    if (!allCategory) console.log("this category doesnt exist");
    res.json(allCategory);
  } catch (error) {
    throw new Error(error);
  };
});
export { createProdCategory, updateProdCategory, deleteProdCategory, getProdCategory,getAllProdCategory};
