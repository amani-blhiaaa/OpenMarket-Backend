import mongoose from "mongoose";

// Declare the Schema of the Mongo model
var BlogCategorySchema = new mongoose.Schema(
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
export default mongoose.model("BlogCategory", BlogCategorySchema);