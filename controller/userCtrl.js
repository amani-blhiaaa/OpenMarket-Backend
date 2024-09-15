import { Error } from "mongoose";
import generateKey from "../config/jwtToken.js";
import User from "../models/userModel.js"; // Import your user model
import asyncHandler from "express-async-handler";
import isValidMongoodbId from "../utils/validateMongooId.js";
import refreshToken from "../config/refreshToken.js";
import jwt from "jsonwebtoken";
import sendEmail from "./emailCtrl.js";
import Product from "../models/productModel.js";
import Cart from "../models/cartModel.js";
import crypto from "crypto";
import Coupon from "../models/couponModel.js";
import mongoose from "mongoose";
import Order from "../models/couponModel.js";
import uniqid from "uniqid";
// * create user.
const createUser = asyncHandler(async (req, res) => {
  // remember here we have used the handler.
  const email = req.body.email;
  // remember here i need to precise that the field i am searching depending on it is email.
  // remember here if we have an async function then inside we must have await i mean promise and if we want to use the predefined function of the database we must first specify which database to deal with.
  const findUser = await User.findOne({ email: email });

  if (!findUser) {
    // remember here in this case if there is no user that has the same email as this user we create a one.
    const newUser = await User.create(req.body);
    res.status(201).json({
      msg: "User created successfully",
      success: true,
      user: newUser,
    });
  } else {
    throw new Error("user already exist");
  }
});
// * login user.
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //   const token = generateKey( req.params._id );
  // console.log( email , password );
  // ? we need first check for the existence of the user.
  const findUser = await User.findOne({ email: email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    const token = generateKey(findUser.id);
    const refreshToken2 = refreshToken(findUser.id);
    const updateUser = await User.findByIdAndUpdate(
      findUser.id,
      { refreshToken: refreshToken2 },
      { new: true }
    );
    // remember here in the function of the database we need to specify the database name.
    // remember here in this case after we generate the refresh token we add it as field in the db.
    res.cookie("refreshToken", refreshToken2, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    // remember here in this case we have used the cookie function which is used to store a cookie in the user s computer cookie is a small piece of data which is sent every time when we sent a request to the server.
    // remember the first argument is the name of the cookie we need it to identify each time from the computer the data we want to send.
    // remember the second argument is the value of this cookie in this case it is refrechToken2.
    // remember the third argument is the options.
    // remember Exactly! When a cookie is marked as HTTP-only, it’s like putting the cookie in a special box that only the server has the key to. No other scripts, including any that hackers might try to run, can see, touch, or change the cookie. This keeps the cookie safe from being stolen or messed with by anything on the website.
    // remember in this case we can t do document.cookie. this This helps protect against cross-site scripting (XSS) attacks, where malicious scripts might try to steal cookies from a user's browser.
    // remember here the maxage is counted in millieseconds.
    res.json({
      _id: findUser?._id,
      mobile: findUser?.mobile,
      email: findUser?.email,
      token: token,
    });
    // remember here every time i login a token is generated for a new time for the simple token i mean the one of one day.
    // remember here ?. is the optional operator it is used to extract the information from the findUser if it is defined then it extracts them in a normal way otherwise it returns underfind and not an error.
  } else {
    throw new Error("login impossible");
  }
});
// * logout from the count.
const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken)
    throw new Error(" no refresh token in the cookies");
  const refreshToken = cookie.refreshToken;
  const userToken = await User.findOne({ refreshToken: refreshToken });
  if (!userToken) {
    res.clearCookie("refreshToken", { httpOnly: true, secure: true });
    res.sendStatus(204);
    // remember this stands for forbideen.
  }
  await User.findOneAndUpdate(
    { refreshToken: refreshToken },
    { refreshToken: "" }
  );
  // remember here in this case in the update the criteria i mean the refreshToken should be an object.
  res.clearCookie("refreshToken", { httpOnly: true, secure: true });
  res.sendStatus(204);
});
// * handle refresh token.
const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  console.log(cookie);
  if (!cookie?.refreshToken) throw new Error("there is no refresh token");
  const refreshToken = cookie.refreshToken;
  const userToken = await User.findOne({ refreshToken: refreshToken });
  if (!userToken) throw new Error(" no user has been found ");
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || userToken.id !== decoded.id) {
      // remember this happened when we match in the bd the ids in a bad way.
      throw new Error(" there is something wrong with this token ");
    }
    const accessToken = generateKey(userToken?.id);
    res.json({ accessToken });
  });
  // remember here if the token is correct then it will be decoded otherwise it will cause to an error.
  // remember here the verification is done to ensure that this user exists with a full token.
});
// * get all users.
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const AllUsers = await User.find();
    res.json(AllUsers);
  } catch (error) {
    throw new Error(error);
  }
});
// remember here we have used this try catch blocks eventhough there exists the handler of express just to customize the error handling.
// * get a single user.
const getUserId = asyncHandler(async (req, res) => {
  const { id } = req.user;
  try {
    const getUser = await User.findById(id);
    // remember here in this example we pass the id without curly brackets since it is not an object and we are using findById.
    res.json(getUser);
  } catch (error) {
    throw new Error(error);
  }
  // remember here in this case the re-thrown error will be catched by the asynchandler.
});
// * delete a user.
const deleteUserId = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleteUser = await User.findByIdAndDelete(id);
    res.json(deleteUser);
  } catch (error) {
    throw new Error(error);
  }
});
// * update a user.
const updateUserId = asyncHandler(async (req, res) => {
  console.log(req.user);
  const { id } = req.user;
  try {
    const updateUser = await User.findByIdAndUpdate(
      id,
      {
        name: req?.body?.name,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
      },
      { new: true }
    );
    res.json(updateUser);
  } catch (error) {
    throw new Error(error);
  }
});
// * block user.
const blockUserId = asyncHandler(async (req, res) => {
  const { id } = req.params;
  isValidMongoodbId(id);
  //  const user = await User.findById( id );
  // if (!user) { return res.status(404).json({ message: 'not found' })}
  // remember the problem here was in the declaration of the id we cant use _id.
  try {
    const blockUser = await User.findByIdAndUpdate(
      id,
      { isBlocked: true },
      { new: true }
    );
    // if (!blockUser) {
    //     return res.status(404).json({ message: 'User not found' });
    // }
    res.json({
      message: "you blocked this user",
    });
  } catch (error) {
    throw new Error(error);
  }
});
// * unblock user.
const unBlockUserId = asyncHandler(async (req, res) => {
  const { id } = req.params;
  isValidMongoodbId(id);
  try {
    const unBlockUser = await User.findByIdAndUpdate(
      id,
      { isBlocked: false },
      { new: true }
    );
    res.json({
      message: "you unblocked this user",
    });
  } catch (error) {
    throw new Error(error);
  }
});
// * reset password.
const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  // remember here the password is the new one we want to reset.
  // remember here why we have putted the password as an object??.
  isValidMongoodbId(_id);
  const user = await User.findById(_id);
  if (password) {
    user.password = password;
    const passwordSaved = await user.save();
    // remember we have done this since when we do the user.password and make the changes those changes are only applied in the memory but if we do the user.save in this case we are saving the changes in the database.
    res.json(passwordSaved);
  } else {
    res.json(user);
  }
});
// * forgot password.
const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new Error(" there is no user with this email");
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetUrl = ` hi , please follow this link to reset your password , this link is valid till 10 minutes from now. <a href = 'http://localhost:5000/api/user/reset-password/${token}'> click here </a>`;
    const data = {
      to: email,
      text: ` hi dear ${user.name}`,
      subject: "forgot password link",
      html: resetUrl,
    };
    sendEmail(data);
    res.json({ token, data });
    // remember here always in the res.json we send one object.
  } catch (error) {
    throw new Error(error);
  }
});
// * reser password.
const reserPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gte: Date.now() },
  });
  // remember here in this case this means that this token has not been already expired.
  if (!user) throw new Error(" token has expired , please try later ");
  user.password = password;
  // remember here we are setting the password for the user for another time.
  user.passwordResetExpires = undefined;
  user.passwordResetToken = undefined;
  await user.save();
  // remember here you can set the password once after clicking on the link since the passwordresetexpires and token will be undefined after using them for the first time.
  // remember since we have made all the necessary changes we need then to save them because if we dont do this the changes will be available only in the memory not the database.
  res.json(user);
});
// * login admin.
const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //   const token = generateKey( req.params._id );
  // console.log( email , password );
  // ? we need first check for the existence of the user.
  const findAdmin = await User.findOne({ email: email });
  if (findAdmin.role !== "admin") throw new Error("not authorized");
  if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
    const token = generateKey(findAdmin.id);
    const refreshToken2 = refreshToken(findAdmin.id);
    const updateAdmin = await User.findByIdAndUpdate(
      findAdmin.id,
      { refreshToken: refreshToken2 },
      { new: true }
    );
    // remember here in the function of the database we need to specify the database name.
    // remember here in this case after we generate the refresh token we add it as field in the db.
    res.cookie("refreshToken", refreshToken2, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    // remember here in this case we have used the cookie function which is used to store a cookie in the user s computer cookie is a small piece of data which is sent every time when we sent a request to the server.
    // remember the first argument is the name of the cookie we need it to identify each time from the computer the data we want to send.
    // remember the second argument is the value of this cookie in this case it is refrechToken2.
    // remember the third argument is the options.
    // remember Exactly! When a cookie is marked as HTTP-only, it’s like putting the cookie in a special box that only the server has the key to. No other scripts, including any that hackers might try to run, can see, touch, or change the cookie. This keeps the cookie safe from being stolen or messed with by anything on the website.
    // remember in this case we can t do document.cookie. this This helps protect against cross-site scripting (XSS) attacks, where malicious scripts might try to steal cookies from a user's browser.
    // remember here the maxage is counted in millieseconds.
    res.json({
      _id: findAdmin?._id,
      mobile: findAdmin?.mobile,
      email: findAdmin?.email,
      token: token,
    });
    // remember here every time i login a token is generated for a new time for the simple token i mean the one of one day.
    // remember here ?. is the optional operator it is used to extract the information from the findUser if it is defined then it extracts them in a normal way otherwise it returns underfind and not an error.
  } else {
    throw new Error("login impossible");
  }
});
// * get wishlist.
const getWishlist = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.user;
    const findUser = await User.findById(_id).populate("wishlist");
    // remember is used to automatically replace the specified paths in a document with the actual referenced documents.
    res.json(findUser);
  } catch (error) {
    throw new Error(error);
  }
});
// * save user address.
const saveUserAddress = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  isValidMongoodbId(_id);
  try {
    const updateUser = await User.findByIdAndUpdate(
      _id,
      {
        address: req?.body?.address,
      },
      { new: true }
    );
    res.json(updateUser);
  } catch (error) {
    throw new Error(error);
  }
});
const userCart = asyncHandler(async (req, res) => {
  const { cart } = req.body;
  const { _id } = req.user;
  const user = await User.findById(_id);
  isValidMongoodbId(_id);

  try {
    let products = [];
    const alreadyExistCart = await Cart.findOne({ orderedBy: user._id });

    if (alreadyExistCart) {
      await alreadyExistCart.remove;
    }

    for (let i = 0; i < cart.length; i++) {
      let obj = {};
      obj.product = cart[i]._id;
      obj.count = cart[i].count;
      obj.color = cart[i].color;

      let getPrice = await Product.findById(cart[i]._id).select("price").exec();
      obj.price = getPrice.price;

      products.push(obj);

      // Debugging price and product
    }

    // Now, calculate cart total
    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
      cartTotal += products[i].price * products[i].count;
    }
    // Debugging cartTotal and totalAfterDiscount
    console.log("Cart Total:", cartTotal);

    let newCart = await new Cart({
      products,
      cartTotal,
      orderedBy: user._id,
    }).save();

    res.json(newCart);
  } catch (error) {
    throw new Error(error);
  }
});

// * get user cart.
const getUserCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { name } = req.user;
  isValidMongoodbId(_id);

  try {
    // Find the user's cart by their _id
    const cart = await Cart.findOne({ orderedBy: _id }).populate(
      "products.product"
    );

    if (!cart) {
      throw new Error(`${name}, you don't have a cart`);
    }

    // Log the cart and cartTotal to confirm they exist
    console.log("User Cart:", cart);
    console.log("Cart Total:", cart.cartTotal);

    // Return a custom message along with the cart
    res.json({
      [`${name}, this is your cart`]: cart,
      totalCart: cart.cartTotal, // Include totalCart directly
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});
// * empty cart.
const emptyCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  isValidMongoodbId(_id);
  try {
    // const user = await User.findOne({_id});
    // if ( user ) console.log("this user exists");
    const cart = await Cart.findOneAndDelete({ orderedBy: _id });
    // remember there isnt findOneAndRemove.
    // if ( cart ) console.log("this cart exists");
    res.json(cart);
  } catch (error) {
    throw new Error(`${req.user.name} doesnt have a cart`);
  }
});
// * apply couponne.
const applyCoupon = asyncHandler(async (req, res) => {
  const { coupon } = req.body;
  const { _id } = req.user;
  const validCoupon = await Coupon.findOne({ name: coupon });
  if (validCoupon === null) {
    throw new Error("invalid coupon");
  }
  const user = await User.findOne({ _id });
  let { products, cartTotal } = await Cart.findOne({ orderedBy: _id }).populate(
    "products.product"
  );
  let totalAfterDiscount = (
    cartTotal -
    (cartTotal * validCoupon.discount) / 100
  ).toFixed(2);
  await Cart.findOneAndUpdate(
    { orderedBy: _id },
    { cartTotal: totalAfterDiscount },
    { new: true }
  );
  res.json(totalAfterDiscount);
});
// * create order.
const createOrder = asyncHandler(async (req, res) => {
  const { COD, couponapplied } = req.body;
  const { _id } = req.user;
  isValidMongoodbId(_id);
  try {
    if (!COD) throw new Error("CAsh not found");
    const user = await User.findById(_id);
    let userCart = await Cart.findOne({ orderedBy: _id }).populate(
      "products.product"
    );
    let finalAmount = 0;
    if (couponapplied && userCart.totalAfterDiscount) {
      finalAmount = userCart.totalAfterDiscount;
    } else {
      finalAmount = userCart.cartTotal;
    }
    console.log("this is me the user cart ", userCart.products);
    let newOrder = await new Order({
      products: userCart.products,
      payementIntent: {
        id: uniqid(),
        method: "cod",
        amount: finalAmount,
        status: "cash on delivery",
        created: Date.now(),
        currency: "usd",
        name: "yusummu",
        expiry: 15 - 10 - 2024,
        discount: 14,
      },
      orderedBy: _id,
      orderStatus: "cash on delivery",
    }).save();
    let update = userCart.products.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product._id },
          update: { $inc: { quantity: -item.count, sold: +item.count } },
        },
      };
    });
    const updated = await Product.bulkWrite(update, {});
    res.json("this is me");
  } catch (error) {
    throw new Error(error);
  }
});
// * get orders.
const getOrders = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  isValidMongoodbId(_id);
  try {
    const userOrders = await Order.findOne({ orderedBy: _id }).populate(
      "products"
    );
    res.json(userOrders);
  } catch (error) {
    throw new Error(error);
  }
});
// * update orders status.
const updateOrders = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  isValidMongoodbId(id);
try {
  const findOrder = await Order.findByIdAndUpdate(
    id,
    {
      orderStatus: status,
      payementIntent:{
        status: status
      }
    },
    { new: true }
  );
  res.json(findOrder);
} catch (error) {
  throw new Error(error);
}
});

export {
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
};
// remember here in this case we are exporting the function createUser not its result so we must not use () ;
