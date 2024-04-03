const express = require("express");
const route = express.Router();
const user = require("../models/User");
const post = require("../models/Post");
const comment = require("../models/comment");
const reply = require("../models/Reply");
const multer = require("multer");
const path = require("path");
const cors = require("cors");


//middlewares
route.use(express.static(path.join(__dirname, "./upload")));
route.use(express.static("./upload"));
route.use(cors());

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
route.get("/getUser", async (req, res) => {
  const userData = await user
    .findById(req.query.id)
    .populate("posts")
    .populate("follwing")
    .populate("follwers");
  res.status(200).json(userData);
});

// get suggested
route.get("/getSuggested", async (req, res) => {
  const userData = await user.findById(req.query.id);
  const following = userData.follwing.map((id) => id.toString());
  const users = await user
    .find()
    .populate("posts")
    .populate("follwing")
    .populate("follwers");
  const suggested = users.filter(
    (user) =>
      !following.includes(user._id.toString()) &&
      user._id.toString() !== req.query.id
  );
  res.status(200).json(suggested);
});

//follow
route.put("/follow", async (req, res) => {
  const follower = await user.findByIdAndUpdate(req.body.following, {
    $push: { follwers: req.body.follower },
  });
  const follwing = await user.findByIdAndUpdate(req.body.follower, {
    $push: { follwing: req.body.following },
  });
  res.status(200).json(follwing);
});

//unfollow
route.put("/unfollow", async (req, res) => {
  const follower = await user.findByIdAndUpdate(req.body.following, {
    $pull: { follwers: req.body.follower },
  });
  const follwing = await user.findByIdAndUpdate(req.body.follower, {
    $pull: { follwing: req.body.following },
  });
  res.status(200).json(follwing);
});

// add post
route.post("/addPost", upload.single("img"), async (req, res) => {
  // const {user,content} = req.body
  const postData = await post.create({
    user: req.body.user,
    content: req.body.content,
    img: req.file.filename,
    date: new Date(),
  });
  const userData = await user.findByIdAndUpdate(req.body.user, {
    $push: { posts: postData._id },
  });
  res.status(200).json(postData);
});

// get post
route.get("/getPost", async (req, res) => {
  const userData = await user.findById(req.query.id).populate("follwing");
  const posts = [].concat(...userData.follwing.map((obj) => obj.posts));
  const allPosts = [...posts, ...userData.posts].flat();
  const postObjects = await Promise.all(
    allPosts.map((postId) => post.findById(postId))
  );
  postObjects.sort((b, a) => new Date(a.date) - new Date(b.date));
  res.status(200).json(postObjects);
});

// get one post
route.get("/getOnePost", async (req, res) => {
  const postData = await post.findById(req.query.post);
  res.status(200).json(postData);
});

//like
route.put("/like", async (req, res) => {
  const { user } = req.body;
  const postData = await post.findById(req.body.post);
  if (!postData.likes.includes(user)) {
    const postData2 = await post.findByIdAndUpdate(req.body.post, {
      $push: { likes: user },
    });
    res.status(200).json(postData2);
  }
});

//unlike
route.put("/unlike", async (req, res) => {
  const { user } = req.body;
  const postData = await post.findByIdAndUpdate(req.body.post, {
    $pull: { likes: user },
  });
  res.status(200).json(postData);
});

//Add Comment
route.post("/addComment", async (req, res) => {
  const CommentData = await comment.create({
    post: req.body.post,
    content: req.body.content,
    user: req.body.user,
    date: new Date(),
  });
  const postData = await post.findByIdAndUpdate(req.body.post, {
    $push: { comments: CommentData._id },
  });
  res.status(200).json(postData);
});

// get Comment
route.get("/getComment", async (req, res) => {
  const commentData = await comment
    .findById(req.query.comment)
    .populate("user");
  res.status(200).json(commentData);
});

// like Comment
route.put("/likeComment", async (req, res) => {
  const { user } = req.body;
  const postData = await comment.findByIdAndUpdate(req.body.comment, {
    $push: { likes: user },
  });
  res.status(200).json(postData);
});

// unlike Comment
route.put("/unlikeComment", async (req, res) => {
  const { user } = req.body;
  const postData = await comment.findByIdAndUpdate(req.body.comment, {
    $pull: { likes: user },
  });
  res.status(200).json(postData);
});

// add reply
route.post("/addReply", async (req, res) => {
  const replyData = await reply.create({
    comment: req.body.comment,
    content: req.body.content,
    user: req.body.user,
    date: new Date(),
  });
  const commentData = await comment.findByIdAndUpdate(req.body.comment, {
    $push: { replies: replyData._id },
  });
  res.status(200).json(commentData);
});

// save post
route.put("/save", async (req, res) => {
  const userData = await user.findByIdAndUpdate(req.body.user, {
    $push: { saved: req.body.post },
  });
  res.status(200).json(userData);
});
// unsave post
route.put("/unsave", async (req, res) => {
  const userData = await user.findByIdAndUpdate(req.body.user, {
    $pull: { saved: req.body.post },
  });
  res.status(200).json(userData);
});
//get All Post
route.get("/explore", async (req, res) => {
  const postData = await post.find({});
  postData.sort((a, b) => {
    const sumA = a.likes.length + a.comments.length;
    const sumB = b.likes.length + b.comments.length;
    return sumB - sumA;
  });
  res.status(200).json(postData);
});
// delete post
route.delete("/delete", async (req, res) => {
  const userData = await user.findByIdAndUpdate(req.query.user, {
    $pull: { posts: req.query.post },
  });
  const postData = await post.findByIdAndDelete(req.query.post);
  res.status(200).json(postData);
});

//edit post
route.put("/editPost", async (req, res) => {
  const postdata = await post.findByIdAndUpdate(req.body.post, {
    content: req.body.content,
  });
  res.status(200).json(postdata);
});
// get user Posts based on engagements
route.get("/getTopPosts", async (req, res) => {
  console.log(req.query);
  const userData = await user.findById(req.query.id);
  const postData = await Promise.all(
    userData.posts.map((postId) => post.findById(postId))
  );
  postData.sort((b, a) => new Date(a.date) - new Date(b.date));
  console.log(postData);
  res.status(200).json(postData);
});

//get user Post
route.get("/userPosts", async (req,res)=>{
  const userData = await user.findById(req.query.id).populate("posts")
  res.status(200).json(userData.posts)
})
//get user Saved Post
route.get("/userSavedPosts", async (req,res)=>{
  const userData = await user.findById(req.query.id).populate("saved")
  res.status(200).json(userData.saved)
})

// get followed by
route.get("/followedBy" , async (req,res)=>{
  const myData = await user.findById(req.query.mine).populate("follwing")
  const userData = await user.findById(req.query.user).populate("follwers")
  const myFollowingIds = myData.follwing.map(following => following._id.toString())
  const userDataFollowersIds = userData.follwers.map(follower => follower._id.toString())
  const mutualIds = userDataFollowersIds.filter(id => myFollowingIds.includes(id))
  const mutualFollowers = userData.follwers.filter(follower=>mutualIds.includes(follower._id.toString()))
  res.status(200).json(mutualFollowers)
})


module.exports = route;
