import jwt from "jsonwebtoken"

const generateKey = ( id ) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "1d"});
};
// remember here in this case for each user we create a token this one is stored in the cookies and each time we wanna make a request this token is checked.
export default generateKey;