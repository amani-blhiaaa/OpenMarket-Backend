import mongoose from "mongoose";


// Declare the Schema of the Mongo model
var blogSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    numViews:{
        type:Number,
        default:0,
    },
    isLiked:{
        type:Boolean,
        default:false,
    },
    isDisliked:{
        type:Boolean,
        default:false,
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }],
    dislikes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }],
    image:{
        type:String,
        default:"https://www.shutterstock.com/shutterstock/photos/1029506242/display_1500/stock-photo-blogging-blog-concepts-ideas-with-white-worktable-1029506242.jpg",
    },
    author:{
        type:String,
        default:"admin",
    }
} , {
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
    timestamps: true,
});
// remember here in the populate the name of the ref must matches the name of the model which is used in exporting, if we dont do in the exporting that the name is User and in the mongoose.model("user" , userschema) here in this case the name of the model will be user not User.
// remember here the virtuals are required but not stored in the database, we have seen them with fouzi.
//Export the model
export default mongoose.model("Blog" , blogSchema);