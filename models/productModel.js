import mongoose from "mongoose"; // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      // remember trim here is used to prevent saving the field with spaces either leading or trailing.
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      // remember here slug is user friendly used in the url for the optimization of the search action it is like wireless-bluetooth-headphones instead of wireless bluetooth headphones.
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    brand: {
      type: String,
      // enum: ["apple", "samsung", "lenovo"],
      // remember the enum option restrics the field brand to be only apple or samsung or lenovo.
    },
    category: {
      // type: mongoose.Schema.Types.ObjectId,
      // ref: "category",
      type: String,
      required: true,
      // remember here the category is a refrence to another category document.
      // remember here in this case the category stores a reference to a document we can use it in case if we want to make a product belongs to a category then after it is possible to use the method populate to retrieve this product.
    },
    quantity: {
      type: Number,
      required: true,
      seledct: false,
    },
    sold: {
      type: Number,
      default: 0,
      select: false,
      // remember this is used in case we want to make this field hidden.
    },
    images: {
      type: Array,
    },
    color: {
      type: String,
      required: true,
      // enum: ["black", "white", "red"],
    },
    ratings: [
      {
        star: Number,
        comments: String,
        postedby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
    // remember When you add a new element to the ratings array, MongoDB generates a unique _id for that new subdocument, unless you explicitly define an _id.
    totalRatings: {
      type: String,
      default: 0,
    }
    // remember here ratings is an array of ratings each case stores a rating this rating is measured depending on the number of stars identified by the field star:number.
    // remember here in this case the postedby option is used to store the id of the one who has made this rating so rating will also stores a reference to the one who has made this rating.
    // remember here rating is linked to the one who has post it.
  },
  { timestamps: true }
);

//Export the model
export default mongoose.model("Product", productSchema);
