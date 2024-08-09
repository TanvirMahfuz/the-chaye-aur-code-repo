const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/apiError");
const jwt = require("jsonwebtoken");
const User = require("../models/ytvid/user.model");
const verifyJWT = asyncHandler(async (req, _, next) => {
    try {
        const accessToken =
            req.cookies?.accessToken ||
            req.header("Authorization")?.split(" ")[1];
        if (!accessToken) {
            throw new ApiError(401, "You are not logged in");
        }
        const decodedToken = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET
        );
        const user = await User.findById(decodedToken?._id).select(
            "-password -refresh_token"
        );
        if (!user) {
            throw new ApiError(401, "You are not logged in");
        }
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, "You are not logged in");
    }
});
module.exports = verifyJWT;
