const express = require("express");
const route = express.Router();
const user = require("../models/User");
const multer = require("multer");
const path = require("path");

route.use(express.static(path.join(__dirname, "./images")));
route.use(express.static("./images"));

const fileStorage = multer.diskStorage({
    destination: (req, file, callbackfun) => {
        callbackfun(null, "./images");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname.replaceAll(" ", ""));
    },
});
const upload = multer({ storage: fileStorage });

//get user by id
route.get("/getUser",async (req,res)=>{
    const userData = await user.findById(req.query.id)
    res.status(200).json(userData)
})

// get suggested
route.get("/getSuggested" , async (req,res)=>{
    const userData = await user.findById(req.query.id)
    const following = userData.follwers.map(id => id.toString())
    const users = await user.find()
    const suggested = users.filter(user => !following.includes(user._id.toString()) && user._id.toString() !== req.query.id)
    res.status(200).json(suggested)
})

//follow
route.put("/follow",async (req,res)=>{
    const follower = await user.findByIdAndUpdate(req.body.follower,{$push:{follwing:req.body.following}})
    const follwing = await user.findByIdAndUpdate(req.body.following,{$push:{follwers:req.body.follower}})
    res.status(200).json(follwing)
})

module.exports = route;