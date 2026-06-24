const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const blacklistModel = require("../models/blacklist.model");

/**
 * @name registerUserController
 * @description it registers a new user and expects username, email, password.
 * @access public
 */
async function registerUserController(req,res){
    
    const {username,email,password} = req.body;

    if(!username || !email || !password){
        return res.status(400).json({
            message:"All fields are required!"
            });
    }

    const isUserAlreadyExists = await userModel.findOne({
        $or:[{username},{email}]
    });

    if(isUserAlreadyExists){
        return res.status(400).json({
            message:"User already exists with email or username"
        });
    }

    const hash = await bcrypt.hash(password,10);

    const newUser = await userModel.create({
        username,
        email,
        password:hash
    });
    
    const token = jwt.sign(
        {id:newUser._id, username:newUser.username},
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
    )

    res.cookie("token",token);

    res.status(201).json({
        message:"User registered successfully",
        user:{
            id:newUser._id,
            username:newUser.username,
            email:newUser.email
        },
    });

}

/**
 * @name loginUser
 * @description it logins a user expects exisiting email and password.
 * @access public
 */

async function loginUser(req, res){

    const {email,password} = req.body;

    const user = await userModel.findOne({email})

    if(!user){
        return res.status(400).json({
            message: "User does not exist"
        })
    }

    const isPasswordvalid = await bcrypt.compare(password, user.password);
    
    if(!isPasswordvalid){
        return res.status(400).json({
            message: "invalid email or password"
        })
    }
    
    const token = jwt.sign(
        {id:user._id, username:user.username},
        process.env.JWT_SECRET,
        {expiresIn:"1d"}
    )

    res.cookie("token", token)
    res.status(200).json({
        message: "User logged in successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })

}

/**
 * @name logoutUser
 * @description it logs out a user and invalidates their token and add token to blacklist.
 * @access public
 */
async function logoutUser(req, res){

    const token = req.cookies.token

    if(token){
        await blacklistModel.create({token})
    }

    res.clearCookie("token");
    res.status(200).json({
        message: "User logged out successfully"
    });
}

/**
 * @name getMe
 * @description it returns the details of the logged in user.
 * @access private
 */
async function getMe(req,res){
    const user = await userModel.findById(req.user.id).select("-password");

    res.status(200).json({
        message: "User details fetched successfully",
        user
    });
}


module.exports = {
    registerUserController,
    loginUser,
    logoutUser,
    getMe
}