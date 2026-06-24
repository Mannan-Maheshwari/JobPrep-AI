const {Router} = require('express');
const authController = require("../controllers/auth.controllers");
const authMiddleware = require("../middlewares/auth.middleware");

const authRouter = Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
authRouter.post("/register",authController.registerUserController);
authRouter.post("/login",authController.loginUser);
authRouter.get("/logout",authController.logoutUser);

authRouter.get("/get-me",authMiddleware.authUser,authController.getMe);

module.exports = authRouter;