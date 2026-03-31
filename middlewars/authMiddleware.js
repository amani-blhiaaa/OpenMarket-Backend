import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

// * authMiddleware.
const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;

   console.log("Auth middleware hit"); // Should always log if middleware is hit
  
  // Log the entire authorization header
  if (req?.headers?.authorization) {
    // console.log("Authorization header:", req.headers.authorization);

    // Check if authorization header starts with Bearer
    if (req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
      //  console.log("Extracted Token:", token);
      if (token ) console.log("this is token from the authmiddleware:" , token);
      try {
        if (token) {
          // Verify the token
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          // console.log("Decoded Token:", decoded);
          
          // Fetch user from database
          const user = await User.findById(decoded?.id);
          if (!user) {
            throw new Error("User not found");
          }
          req.user = user;
          // console.log(user);
          next(); // Proceed to the next middleware or route
        } else {
          // console.log("Token is missing");
          res.status(401).json({ message: "Token is missing or invalid" });
        }
      } catch (error) {
        // console.error("Token verification failed:", error.message);
        res.status(401).json({ message: "Not authorized, token expired or invalid" });
      }
    } else {
      // console.log("Authorization header does not start with Bearer");
      res.status(401).json({ message: "No Bearer token found" });
    }
  } else {
    // console.log("No Authorization header found");
    res.status(401).json({ message: "No token is attached with this request" });
  }
});

// * isAdmin.
const isAdmin = asyncHandler(async (req, res, next) => {
  //  console.log(req.user);
  const { email } = req.user;
  const adminUser = await User.findOne({ email: email });
  if (adminUser.role !== "admin") {
    throw new Error(" this user is not an admin ");
  } else {
    console.log("hello it s me the admin");
    next();
  };
});
// remember here for example first we check if the authorization is sent in the header then if yes we check if it starts with bearer then after we find that the authorization is an array in this case after the split so we take the token one which is in the first index.
export { authMiddleware, isAdmin };
