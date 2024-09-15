import jwt from "jsonwebtoken"

const refreshToken = ( id ) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "3d"});
};
// remember here the expiresIn is the date when this token needs to be refreshed so the user must login for another time.
// remember here the id is the payload which means the data encoded in this case.
// remember here in this case for each user we create a token this one is stored in the cookies and each time we wanna make a request this token is checked.
export default refreshToken;