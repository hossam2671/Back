const mongoose = require("mongoose");
const replySchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comment",
    },
    date: Date,
    content: String,
    likes: [
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

const reply = mongoose.model("reply", replySchema);
module.exports = reply;