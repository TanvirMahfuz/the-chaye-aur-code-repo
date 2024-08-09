const Router = require("express").Router;
const verifyJWT = require("../middlewares/auth.middleware.js");
const {
    registerUser,
    logInUser,
    logOut,
    regenerateAccessToken,
} = require("../controllers/user.controller.js");
const upload = require("../middlewares/multer.middleware.js");

const router = Router();

router.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 },
    ]),
    registerUser
);
router.route("/login").post(logInUser);
// secured routes
router.route("/logout").post(verifyJWT, logOut);
router.route("/refresh-token").post(regenerateAccessToken);
module.exports = router;
