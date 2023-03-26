const express = require("express");
const bodyParser = require("body-parser");
const userRouter = require("./routes/users/user.router");

const app = express();
require("./middlewares/auth");

app.use(express.json());
app.use("/user", userRouter);

// app.get("/", (req, res) => {
//   res.json({
//     msg: "Hello",
//   });
// });

module.exports = app;
