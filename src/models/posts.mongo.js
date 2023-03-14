const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  userID: mongoose.ObjectID,
  timeStamp: Date,
  text: String,
  imageURL: String,
  tags: [String],
  likes: [mongoose.ObjectID],
  comments: [
    {
      user: mongoose.ObjectID,
      timeStamp: Date,
      comment: String,
    },
  ],
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
