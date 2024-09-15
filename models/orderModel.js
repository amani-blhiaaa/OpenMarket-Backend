import mongoose from "mongoose";

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema(
  {
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        count: Number,
        color: String,
      },
    ],
    payementIntent: {},
    orderStatus: {
      type: String,
      default: "not processed",
      enum: [
        "not processed",
        "cash on delivery",
        "processing",
        "dispatched",
        "cancelled",
        "delivered",
      ],
    },
    orderedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

//Export the model
export default mongoose.model("Order", orderSchema);
