import slugify from "slugify";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";
import isValidMongoodbId from "../utils/validateMongooId.js";
import cloudinaryUploadImg from "../utils/cloudinary.js";
import multer from "multer";
import fs from "fs";
// * create Product.
const createProduct = asyncHandler(async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    // remember in this case we have added the field slug to this document in the database.
    const newProduct = await Product.create(req.body);
    res.json(newProduct);
  } catch (error) {
    throw new Error(error);
  }
});
// * update Product.
const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updateProduct = await Product.findOneAndUpdate(
      { _id: id },
      req.body,
      { new: true }
    );
    // remember here for example the problem was that the field of the filter i mean its name doesnt match the one written in the database so i need to match between them.
    res.json(updateProduct);
  } catch (error) {
    throw new Error(error);
  }
});
// * delete Product.
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleteProduct = await Product.findOneAndDelete({ _id: id });
    // remember here for example the problem was that the field of the filter i mean its name doesnt match the one written in the database so i need to match between them.
    res.json(deleteProduct);
  } catch (error) {
    throw new Error(error);
  }
});
// * get Product.
const getProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const getProduct = await Product.findById(id);
    res.json(getProduct);
  } catch (error) {
    throw new Error(error);
  }
});
// * get All Products.
const getAllProducts = asyncHandler(async (req, res) => {
  // console.log(req.query);
  // remember this caused the req.query obj to be called twice.
  // remember this is used to write what we want in my case the query in the terminal.
  try {
    // const allProducts = await Product.find({
    //   brand:req.query.brand,
    //   title:req.query.title,
    //   price:req.query.price,
    // });
    // * filtering.
    const queryObj = { ...req.query };
    console.log(queryObj);
    const excludesFields = ["page", "sort", "limit", "fields"];
    // remember this is the excludesfield we use it to delete the elements from the queryobj.
    console.log(excludesFields);
    excludesFields.forEach((el) => delete queryObj[el]);
    // remember here we remove those elements since they are not a part of the search criteria.
    // remember here for each element in the excludesfields we delete the one that correspands to it in the queryobj.
    // remember this is the bracket method it is used to access every element in the queryObj that has the same name as the one which is el.
    console.log(queryObj);
    // remember or we can do like this.
    // const allProducts = await Product.where("price").equals(req.query.price);
    let querystr = JSON.stringify(queryObj);
    // remember this is used to transform the querystr object to a json string.
    querystr = querystr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // remember in this case we are replacing any occurence of those patterns with this pattern and the $pattern then we turn this to an object for another time then after we can use it in mongoose for searching.
    // remember here we are using a regular expressin that takes all the words that contain gte or gt or lte or lt and the match which means the words found are gonna be replaced by the matched and the two dollar signs.
    console.log(JSON.parse(querystr));
    let query = Product.find(JSON.parse(querystr));
    // remember here this function is used to parse this string to an object.
    // remember here we need to use the word let not constant since we can reassign query.
    // * sorting.
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      console.log(sortBy);
      //  remember in this case we are first spliting the sorting parameters based on the separator comma then we join them using the whitespace.
      query = query.sort(sortBy);
    } else {
      query = query.sort("createdAt");
    }
    // * limiting the fields.
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      console.log(fields);
      query = query.select(fields);
      //  remember here in this case we are first selecting the fields then we select the
    } else {
      query = query.select("-__v");
    }
    // * pagination.
    const page = req.query.page;
    const limit = req.query.limit;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    // remember query = query.skip(skip).limit(limit); in this case it s like saying if i am in the second page then the number of documents to skip is skip and the number of limit which means the number of documents that appear is limit.
    if (req.query.page) {
      const productCount = await Product.countDocuments();
      console.log(productCount);
      if (skip >= productCount) throw new Error(" this page doesnt exist ");
    }
    console.log(page, limit, skip);
    // remember in this case skip is the number of products i wanna skip so the others will appear.
    // remember for example if i have 100 documents in my database and i am in the first page so the number of skip should be 0 and if i am in the second page the number of skip should be 20 and so on using this algorithm we can precize the number of documents to pass.
    const allProducts = await query;
    res.json(allProducts);
  } catch (error) {
    throw new Error(error);
  }
});
// * add to wish list.
const addToWishList = asyncHandler(async (req, res) => {
  console.log("the user attached is:", req.user);
  const { _id } = req.user;
  const { product_id } = req.body;
  try {
    let user = await User.findById(_id);
    const alreadyAdded = user.wishlist.find(
      (id) => id.toString() === product_id
    );
    // remember here in this case we go around all the ids or the elements in the array of the wishlist and those elements we need to convert them to strings and compare them with the string product_id.
    // remember here in this case we dont need to use the await.
    if (alreadyAdded) {
      user = await User.findByIdAndUpdate(
        _id,
        {
          $pull: { wishlist: product_id },
        },
        { new: true }
      );
      res.json(user);
    } else {
      user = await User.findByIdAndUpdate(
        _id,
        {
          $push: { wishlist: product_id },
        },
        { new: true }
      );
      res.json(user);
    }
  } catch (error) {
    throw new Error(error);
  }
});
// * ratings.
const rating = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { stars, product_id, comments } = req.body;
  try {
    const product = await Product.findById(product_id);
    let alreadyRated = product.ratings.find(
      (userId) => userId.postedby.toString() === _id.toString()
    );
    // remember here in this case we are searching in the product for the user and then if we find him we will store him in the alreadyrated.
    if (alreadyRated) {
      const updateRating = await Product.updateOne(
        { ratings: { $elemMatch: alreadyRated } },
        { $set: { "ratings.$.star": stars, "ratings.$.comments": comments } },
        { new: true }
      );
      // remember here for example we are trying to match between the ratings and the alreadyrated person
    } else {
      const rateProduct = await Product.findByIdAndUpdate(
        product_id,
        {
          $push: {
            ratings: { star: stars, postedby: _id, comments: comments },
          },
        },
        { new: true }
      );
    }
    const allRatings = await Product.findById(product_id);
    // remember this line of the code retrieve a product from the database based on its id.
    let totalRatings = allRatings.ratings.length;
    let ratingSum = allRatings.ratings
      .map((item) => item.star)
      .reduce((prev, curr) => prev + curr, 0);
    // remember in this case the allRatings.ratings will retrieve the array of ratings.
    // remember then we apply to it the map function which will creates another array which contains the output of the callback function which is with the map.
    // remember then we pass them to another array function which will reduce the array in one output in this case we start with the value of the prev which is initialized to 0 then in the first iteration it will be prev+curr then in the second iteration the prev will be the result and so on until the array is finished.
    let actualRating = Math.round(ratingSum / totalRatings);
    // remember in this case the ratingSum/totalRatings will be the average of the rating.
    // remember also Math.round turns the rating to the nearest whole number.
    let finalProduct = await Product.findByIdAndUpdate(
      product_id,
      {
        totalRatings: actualRating,
      },
      { new: true }
    );
    res.json(finalProduct);
  } catch (error) {
    throw new Error(error);
  }
});
// * upload images.
const uploadImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // console.log("this is me cloudinary:" , process.env.a);
  isValidMongoodbId(id);
  console.log("the files we are getting are " , req.files);
  // remember the problem here is not in the files.
  try {
    const uploader = (path) => cloudinaryUploadImg(path, "images");
    // remember in this case the uploader takes the image files and upload them to cloudinary image handler then it places them in a directory named images.
    // remember here for example the path is the path of sharp.
    const urls = [];
    // remember in this case we have initialized the urls array to be empty so it can after be filled by the urls.
    const files = req.files;
    // remember here in this case the files is an array of all the images i wanna upload.
    for (const file of files) {
      const { path } = file;
      // console.log(path);
      console.log("this is me the path");
      // remember in this case the path is sharp path.
      // remember here each file contains information about the temporary path here we extract them.
      const newPath = await uploader(path);
      console.log("this is the new path" , newPath);
      // remember we take the temporary file and upload it in the cloudinary directory which is images.
      // remember here newPath contains a path or url returns by the cloudinary since we have used his uploader function.
      // remember newPath in this case will represents the new path of this image in cloudinary storage.
      urls.push(newPath);
      fs.unlinkSync(path);
      // remember here then we push the newPath to the urls.
    }
    const findProduct = await Product.findByIdAndUpdate(
      id,
      {
        images: urls.map((file) => {
          return file;
        }),
      },
      { new: true }
    );
    // remember in this case we are trying first to select the product by its id then we are gonna make the updates in this case the field we wanna update is the array of the images where we are gonna replace it with another array of the mapped images in this case we map the urls array which results to creating a new array this one is stored in the images.
    res.json(findProduct);
  } catch (error) {
    throw new Error(error);
  }
});
// remember so the utility of this function is we first use the middlewares like uploadPhoto and imageResize then we call this function which first takes the id of this product.
// remember then after we select this product then for each accepted file we send it to cloudinary based on the path of the sharp in this case.
// remember then after we send them this will returns a promise with the new path cloudinary gives like "https://new-cloudinary-url.com/image1.jpg".
// remember then after we store them in urls array then we map them.
// remember in result the images array will stores the urls gived by the cloudinary.

export {
  createProduct,
  getProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  addToWishList,
  rating,
  uploadImages,
};
