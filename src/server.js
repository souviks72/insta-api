const http = require("http");
require("dotenv").config();

const { mongoConnect } = require("./services/mongoose");

const app = require("./app");
const { timeStamp } = require("console");
const PORT = process.env.PORT || 8080;

const server = http.createServer(app);

async function startServer() {
  await mongoConnect();
  server.listen(PORT, () => {
    console.log(`Server is listening on PORT: ${PORT}`);
  });
}

startServer();

/*
POST{   https://www.digitalocean.com/community/tutorials/api-authentication-with-json-web-tokensjwt-and-passport
    userID,
    timeStamp,
    text,
    imageURL,
    tags:[tag],
    Likes:[userID],
    Comments: [{
        userID,
        timeStamp,
        comment
    }]
}

USER{
    userID(ObjectID),
    fname,
    lname,
    userName,
    email,
    passwordHash,
    followers:[userId],
    following: [userId],
    isPublic: boolean
}
*/
