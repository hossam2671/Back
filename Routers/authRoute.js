const express = require("express");
const route = express.Router();
const user = require("../models/User");
const bcrypt = require("bcryptjs");

//SignUp
route.post("/signUp",async (req,res)=>{
    const {userName,name,password,email} = req.body
    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = await user.create({
        name:name,
        userName:userName,
        email:email,
        password:hashedPassword
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
//check if email exist
route.post("/checkEmail" , async (req,res)=>{
    const userData = await user.findOne({email:req.body.email})
    if(userData){
        console.log(userData)
        res.status(200).json(userData)
    }
    else{
        res.status(400).json({userData:false})   
    }
})

route.post("/login",async (req,res)=>{
    const {email,password} = req.body
    const userData = await user.findOne({email:email})
    if(!userData){
        res.status(400).json({message:"Sorry, your email was incorrect. Please double-check your email."})
    }
    else{
        if(!await bcrypt.compare(password, userData.password)){
            res.status(400).json({message:"Sorry, your password was incorrect. Please double-check your password."})
        }
        else{
            res.status(200).json(userData)
        }
    }
})

module.exports = route;