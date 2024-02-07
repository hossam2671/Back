const express = require("express");
const route = express.Router();
const user = require("../models/User");

//SignUp
route.post("/signUp",async (req,res)=>{
    const {userName,name,password,email} = req.body
    const userData = await user.create({
        name:name,
        userName:userName,
        email:email,
        password:password
    })
    res.status(200).json(userData);
})

module.exports = route;