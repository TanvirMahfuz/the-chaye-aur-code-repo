const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const object = {
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true,
    },
    password: {
        type: String,
        required: [true, "password is required"],
        unique: true,
        trim: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    full_name: {
        type: String,
        required: true,
        trim: true,
        index: true,
    },
    avatar: {
        type: String, //cloudinary url
        required: true,
    },
    cover_image: {
        type: String, //cloudinary url
    },
    watch_history: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Vidoes",
        },
    ],
    refresh_token: {
        type: String,
    },
};
userSchema = new mongoose.Schema(object, { timestamps: true });
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};
userSchema.methods.genAccToken = function () {
    return jwt.sign(
        { _id: this._id, email: this.email, username: this.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
};
userSchema.methods.genrefToken = function () {
    return jwt.sign(
        { _id: this._id, email: this.email },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
};
const Users = mongoose.model("Users", userSchema);

module.exports = Users;
