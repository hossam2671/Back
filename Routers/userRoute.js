const express = require("express");
const route = express.Router();
const user = require("../models/User");
const post = require("../models/Post");
const multer = require("multer");
const path = require("path");
const cors = require("cors")

//middlewares
route.use(express.static(path.join(__dirname, "./upload")));
route.use(express.static("./upload"));
route.use(cors())

// multer
const fileStorage = multer.diskStorage({
    destination: (req, file, callbackfun) => {
      callbackfun(null, "./upload");
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
    const following = userData.follwing.map(id => id.toString())
    const users = await user.find()
    const suggested = users.filter(user => !following.includes(user._id.toString()) && user._id.toString() !== req.query.id)
    res.status(200).json(suggested)
})

//follow
route.put("/follow",async (req,res)=>{
    const follower = await user.findByIdAndUpdate(req.body.following,{$push:{follwing:req.body.follower}})
    const follwing = await user.findByIdAndUpdate(req.body.follower,{$push:{follwers:req.body.following}})
    res.status(200).json(follwing)
})

//unfollow
route.put("/unfollow",async (req,res)=>{
    const follower = await user.findByIdAndUpdate(req.body.following,{$pull:{follwing:req.body.follower}})
    const follwing = await user.findByIdAndUpdate(req.body.follower,{$pull:{follwers:req.body.following}})
    res.status(200).json(follwing)
})

// add post
route.post("/addPost", upload.single('img'),async (req,res)=>{
    // const {user,content} = req.body
    const postData = await post.create({
        user:req.body.user,
        content:req.body.content,
        img:req.file.filename,
        date:new Date()
    })
    const userData = await user.findByIdAndUpdate(req.body.user,{$push:{posts:postData._id}})
    res.status(200).json(postData)
})

// get post
route.get("/getPost" , async(req,res)=>{
  const userData = await user.findById(req.query.id).populate("follwing")
  const posts = [].concat(...userData.follwing.map(obj => obj.posts))
  const allPosts = [...posts,...userData.posts].flat()
  const postObjects = await Promise.all(allPosts.map(postId => post.findById(postId)));
  postObjects.sort((b , a) => new Date(a.date) - new Date(b.date));
  res.status(200).json(postObjects)
})

// get one post
route.get("/getOnePost",async (req,res)=>{
  const postData = await post.findById(req.query.post)
  res.status(200).json(postData)
})

//like
route.put("/like",async (req,res)=>{
  const {user} = req.body
  const postData = await post.findByIdAndUpdate(req.body.post,{$push:{likes:user}})
  res.status(200).json(postData)
})

//unlike
route.put("/unlike",async (req,res)=>{
  const {user} = req.body
  const postData = await post.findByIdAndUpdate(req.body.post,{$pull:{likes:user}})
  res.status(200).json(postData)
})

module.exports = route;