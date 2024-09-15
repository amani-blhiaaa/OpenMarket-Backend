import mongoose from "mongoose";

// Declare the Schema of the Mongo model
var BrandSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  { timestamps: true }
);
console.log("hi this is me the prod category");
//Export the model
export default mongoose.model("Brand", BrandSchema);