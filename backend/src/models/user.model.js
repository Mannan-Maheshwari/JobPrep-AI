const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [true, "Username already exists!"],
        required: true
    },
    email: {
        type: String,
        unique: [true, "email already exists"],
        required: true
    },
    password: {
        type: String,
        length: 8,
        required: true
    }
})

const userModel = mongoose.model("users",userSchema);

module.exports = userModel;