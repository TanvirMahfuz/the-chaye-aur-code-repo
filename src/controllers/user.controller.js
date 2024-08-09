const asyncHandler = require("../utils/asyncHandler");
const User = require("../models/ytvid/user.model");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const uploadOnCloudinary = require("../utils/cloudinary");
const jwt = require("jsonwebtoken");

async function generateAccessAndRefreshToken(userId) {
    try {
        const user = await User.findById(userId);
        const accessToken = user.genAccToken();
        const refreshToken = user.genrefToken();
        user.refresh_token = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        console.error(error);
    }
}
const options = {
    httpOnly: true,
    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    secure: true,
};
const registerUser = asyncHandler(async (req, res) => {
    // 1. Get user from request body
    // validation
    // 2. Check if user already exists : username email
    // 3. check for images
    // 4. avatar
    // 5. upload to cloudinary
    // 6. create user object
    // 7. save user
    // 8. modify response

    const { fullName, username, email, password } = JSON.parse(req.body.data);
    // used JSON.parse here, because data is coming from postman so it is a string. it will be different when the data will come from the web
    // used object destructuring here.
    // the variable name is same as the received object
    console.log(fullName, username, email, password);
    if (
        [fullName, username, email, password].some((field) => {
            field?.trim() == "";
        })
        // the some method traverses the array and checks for empty values. it returns a boolean
    ) {
        throw new ApiError(400, "All fields required");
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }],
    }); // a database call to check if the user already exited or not. mongoose will search by username and email since they are both unique

    if (existedUser) {
        throw new ApiError(409, "User already exists");
    }
    console.log(req.files);
    const avatartLocalpath = req.files?.avatar[0]?.path;
    const coverImageLocalpath = req.files?.coverImage[0]?.path;
    //req.file method becomes available when we use multer middleware
    // req.file return a object. each object key is the field name and consists of an array of objects that contain the file info
    console.log(avatartLocalpath, coverImageLocalpath);
    if (!avatartLocalpath) {
        throw new ApiError(400, "All field required");
    }
    const avatar = await uploadOnCloudinary(avatartLocalpath);
    const coverImage = await uploadOnCloudinary(coverImageLocalpath);
    // console.log(avatar, coverImage);
    if (!avatar) {
        throw new ApiError(400, "All field required");
    }
    const user = await User.create({
        full_name: fullName, // different db an varname
        username,
        email,
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
    });
    const createdUser = User.findOne({ _id: user._id }).select(
        "-password -refresh_token"
    );
    // the select method will return the user object without password and refresh_token
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong");
    }
    //return res.status(201).json(ApiResponse(201, createdUser));
    res.status(200).json({
        message: "User registered successfully",
    });
});
const logInUser = asyncHandler(async (req, res) => {
    // 1. req.body -> username or email, password
    // const { username, email, password } = JSON.parse(req.body.data);
    const { username, email, password } = req.body;
    if (!username && !email) {
        throw new ApiError(400, "send username or password");
    }
    let searchparams = username ? { username } : { email };
    console.log(searchparams);
    // 2. find the user
    const user = await User.findOne(searchparams);
    if (!user) {
        throw new ApiError(404, "user not found");
    }
    // 3. check for password
    const isPassCorrecto = await user.isPasswordCorrect(password);
    if (!isPassCorrecto) {
        throw new ApiError(401, "Invalid user credentials");
    }

    // 4. access and refresh token
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        user._id
    );
    // 5. send cookies
    const loggedInUser = await User.findOne(searchparams).select(
        "-password -refresh_token"
    );

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json({
            success: true,
            message: "User logged in successfully",
            user: loggedInUser,
        });
});
const logOut = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: { refresh_token: "undefined" },
        },
        { new: true }
    );
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json({
            success: true,
            message: "User logged out successfully",
        });
});
const regenerateAccessToken = asyncHandler(async (req, res, next) => {
    const incomingRefreshToken =
        req.cookies?.refreshToken || req.body?.refreshToken;
    if (!incomingRefreshToken) {
        throw new ApiError(401, "You are not logged in");
    }
    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.ACCESS_TOKEN_SECRET
        );
        const user = await User.findById(decodedToken?._id);
        if (!user) {
            throw new ApiError(401, "You are not logged in");
        }
        if (incomingRefreshToken !== user?.refresh_token) {
            throw new ApiError(401, "You are not logged in");
        }
        const { accessToken, refreshToken } =
            await generateAccessAndRefreshToken(user._id);
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({
                success: true,
                message: "User logged in successfully",
                user: loggedInUser,
            });
    } catch (error) {
        throw new ApiError(401, "You are not logged in");
    }
});
module.exports = { registerUser, logInUser, logOut, regenerateAccessToken };
