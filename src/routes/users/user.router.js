const express = require("express");
const emailValidator = require("email-validator");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const User = require("../../models/users.mongo");

const userRouter = express.Router();

userRouter.post(
  "/signup",
  passport.authenticate("signup", { session: false }),
  async (req, res) => {
    let { username } = req.body;

    try {
      await User.findOneAndUpdate(
        { email: req.user.email },
        {
          userName: username,
          followers: [],
          following: [],
        }
      );
    } catch (err) {
      return res.status(500).json({
        message: "User created. Error adding username",
      });
    }

    req.user.userName = username;

    return res.status(201).json({
      user: req.user,
    });
  }
);

userRouter.post("/login", async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err || !user) {
        const error = new Error("An error occurred");
        return next(error);
      }

      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);

        const body = { _id: user._id, email: user.email };
        const token = jwt.sign({ user: body }, "SECRET_KEY");

        return res.json({ token });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

module.exports = userRouter;
