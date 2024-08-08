const asyncHandler = require("../utils/asyncHandler");
const User = require("../models/ytvid/user.model");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const uploadOnCloudinary = require("../utils/cloudinary");

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

  const {fullName, username, email, password} = JSON.parse(req.body.data);
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
    $or: [{username}, {email}],
  }); // a database call to check if the user already exited or not

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
  const createdUser = User.findOne({_id: user._id}).select(
    "-password -refresh_token"
  );
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong");
  }
  //return res.status(201).json(ApiResponse(201, createdUser));
  res.status(200).json({
    message: "User registered successfully",
  });
});

module.exports = registerUser;
