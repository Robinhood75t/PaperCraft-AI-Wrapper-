const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: true
        },
        userEmail: {
            type: String,
            required: true
        },
        userPassword: {
            type: String,
            required: true
        },
    },
    { timestamps: true}
);


const userModel = mongoose.model("userModel",userSchema);

module.exports = userModel;