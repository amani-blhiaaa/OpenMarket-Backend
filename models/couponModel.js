import mongoose from "mongoose";// Erase if already required

// Declare the Schema of the Mongo model
var couponSchema = new mongoose.Schema({
    name:{
        type:String,
        required:false,
        unique:true,
        uppercase:true,
    },
    expiry:{
        type:Date,
        required:true,
    },
    discount:{
        type:Number,
        required:true,
    },
});

//Export the model
export default mongoose.model("Coupon" , couponSchema);