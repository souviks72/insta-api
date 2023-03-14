const express = require("express");

const User = require("../../models/users.mongo");

const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
  let newUser = new User({
    userName: req.body.userName,
    email: req.body.email,
  });

  newUser.password = newUser.generateHash(req.body.password);

  await newUser.save();

  res.json(newUser);
});

module.exports = userRouter;
