const express = require("express");

const userRouter = require("./routes/users/user.router");

const app = express();

app.use(express.json());
app.use("/user", userRouter);

// app.get("/", (req, res) => {
//   res.json({
//     msg: "Hello",
//   });
// });

module.exports = app;
