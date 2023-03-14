const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  userName: String,
  email: String,
  password: String,
  followers: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  following: [{ type: mongoose.Types.ObjectId, ref: "User" }],
  isPublic: Boolean,
});

userSchema.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

userSchema.methods.isValidPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
