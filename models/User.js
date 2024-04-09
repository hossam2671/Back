const mongoose = require("mongoose");
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    userName: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post",
      },
    ],
    saved: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post",
      },
    ],
    joinedAt:Date,
    img:{type: String, default:"yvxiyhwzugcjcoaaevcy"},
    bio:String,
    gender:{
        type:String,
        enum: ["male", "female"],
    },
    follwers: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
      ],
    follwing: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
      ],
  },
  {
    versionKey: false,
    strict: false,
  }
);

const user = mongoose.model("user", userSchema);
module.exports = user;
