import mongoose from "mongoose";
const isValidMongoodbId = ( id )  => {
    const isvalid = mongoose.Types.ObjectId.isValid(id);
// remember here you need to write the t in capital.
// remember here .schema makes this statement not a function.
console.log(mongoose.Types);
    if ( !isvalid ) throw new Error ( ' this id is not valid ' );
}
export default isValidMongoodbId ; 