import mongoose from "mongoose"; // Erase if already required
import bcrypt from "bcrypt";
import crypto from "crypto";
import { type } from "os";
const { ObjectId } = mongoose.Schema.Types; 
// remember for example we have used the node readme here to read the readme file of the bcrypt you just need to use the shortcut ctrl shift r.
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        index:true,
// remember here is the index used as an index of page.
    },
    email:{
        type:String,
        required:true,
    },
    mobile:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        default:"user",
    },
    cart:{
        type:Array,
        default: [],
    },
    isBlocked:{
        type:Boolean,
        default: false,
    },
    address:[String],
    wishlist:[{ type:ObjectId , ref:"Product"}],
    refreshToken:{
        type:String,
    },
// remember here in this case address is an array of reference to document of collection address.
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    }, {
    timestamps: true,
    }
// remember here for example timestamps is used to set the updatedat and createdat automatically without need to se those two dields in the schema manually.
);
// remember here the whole schema was created when typing !mdbgum
userSchema.pre("save" , async function (next) {
// remember here next is used to pass the control to the next middleware it is used in the first place to pass the control to the mongoose to save the changes but this is all after passing by all the middlewares.
    if ( !this.isModified("password") ){
       next();
    }
    const salt = await bcrypt.genSalt(10);
// remember here we have generated the salt number that is added to the password after.
    this.password = await bcrypt.hash(this.password, salt);
// remember here we have changed the value of the password to be the combination of those two.
    next();
})
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};
userSchema.methods.createPasswordResetToken = async function ( ) {
    const resetToken = crypto.randomBytes(32).toString("hex");
    // remember in this case we generate 32 bytes and each byte has 255 possiblities then the generated possibility for each byte is transformed to its so we get them in 64 characters.
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest("hex");
    this.passwordResetExpires = Date.now()+30 * 60 * 1000;
    // remember here in this case we have set the expire date for the password which is the moment we have created plus 30 minutes.
    // remember here in this case in the database when storing the passwordresettoken we first precise the method used in the hashing of the input which is in this case the resettoken then after if we want to change the format of this passwordresettoken we use the .digest.
    return resetToken;
};
// remember here we have add to this schema a function that takes the enterd pass and compares it with the one that has the name or email the user has entered so if we find this user in the database then after we will call this function.
// remember this middleware is executed before the document is saved in the database.
// remember pre here means that this fuction should be executd before this document is saved in the database.
//Export the model
export default mongoose.model('User', userSchema);
// remember here the problem is not in declaring the const user then export it but it is in the name of the model which needs to correspand to the one we import here even i have declared this User and import it with the same writting but the problem stills and this must the one in the database.
// remember here in this case the user refers to the name of the collection in the database that will be created based on the userSchema.