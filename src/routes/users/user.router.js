const express = require("express");
const emailValidator = require("email-validator");
const jwt = require("jsonwebtoken");

const User = require("../../models/users.mongo");

const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
  let { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({
      msg: "Invalid request body",
    });
  }

  if (!emailValidator.validate(email))
    return res.status(400).json({
      msg: "Invalid email in request body",
    });

  try {
    let userExists = await User.find({
      $or: [{ userName: username }, { email: email }],
    });

    if (userExists.length > 0) {
      return res.status(400).json({
        msg: "Username or email already exists",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      msg: "Internal server error",
    });
  }

  let newUser = new User({
    userName: username,
    email: email,
    isPublic: false,
  });

  newUser.password = newUser.generateHash(password);

  try {
    await newUser.save();
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      msg: "Cannot save user",
    });
  }

  let userObj = {
    username: newUser.userName,
    email: newUser.email,
    id: newUser._id,
    isPublic: newUser.isPublic,
    followers: newUser.followers,
    following: newUser.following,
  };

  let jwtSecretKey = process.env.JWT_SECRET_KEY;
  let data = {
    time: Date(),
    id: userObj.id,
    username: userObj.username,
    email: userObj.email,
  };

  const token = jwt.sign(data, jwtSecretKey);
  userObj.token = token;
  res.status(200).json(userObj);
});

userRouter.post("/signin", async (req, res) => {
  let { email, password } = req.body;

  try {
    let user = await User.findOne({ email: email }).exec();

    if (!user) {
      return res.status(400).json({
        msg: "Email doesnot exist",
      });
    }

    if (!user.isValidPassword(password)) {
      return res.status(400).json({
        msg: "Invalid email/password",
      });
    }

    let token = jwt.sign(
      {
        time: Date(),
        id: user.id,
        username: user.userName,
        email: user.email,
      },
      process.env.JWT_SECRET_KEY
    );

    return res.status(200).json({
      id: user.id,
      username: user.userName,
      email,
      token,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      msg: "Invalid email or password",
    });
  }
});

module.exports = userRouter;
