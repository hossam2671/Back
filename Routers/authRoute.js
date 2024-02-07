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

//check if username exist
route.post("/checkUserName" , async (req,res)=>{
    const userData = await user.findOne({userName:req.body.userName})
    if(userData){
        console.log(userData)
        res.status(200).json(userData)
    }
    else{
        res.status(400).json({userData:false})   
    }
})

module.exports = route;