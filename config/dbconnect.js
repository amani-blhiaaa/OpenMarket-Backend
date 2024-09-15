import mongoose from "mongoose";
const dbconnect = () => {
    try {
        const con = mongoose.connect(process.env.MONGODB_URL);
// remember here we put the process.env.url
        console.log("database connect");
    } catch ( e ) {
        console.log("database fail");
    }
}
export default dbconnect ;