const express = require("express");
//const dotenv = require('dotenv').config();
const Posts = require("./routes/posts");
const Email = require("./routes/email");

if (process.env.NODE_ENV !== "PROD") {
  process.env.NODE_ENV = "DEV";
  require("dotenv").config();
}

const getPostsFromDatabase = Posts.queryDatabase;

const PORT = process.env.PORT || 8000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  res.send("Hello World!");
});

app.get("/posts", async (req, res) => {
  try {
    const posts = await getPostsFromDatabase();
    console.log("posts", posts);
    const url = `https://emmalu.notion.site/${posts[0].title.replace(
      / /g,
      "-"
    )}-${posts[0].id}`;
    console.log("url", url);
    res.json(posts);
  } catch (err) {
    res
      .status(err)
      .send("There's been an error querying the data. Please try again later.");
  }
});

app.post("/email", async (req, res) => {
  try {
    const email = req.body.email;
    const response = await Email.addToDatabase(email);
    res.send({
      statusCode: 200,
      message: response,
      body: "Email Added Successfully!",
    });
    res.redirect("/");
    res.end();
  } catch (err) {
    return {
      statusCode: 400,
      body: err.toString(),
    };
  }
});

app.listen(PORT);
console.log(`API is listening on: ${PORT}`);
console.log(`The node ENV is: ${process.env.NODE_ENV}`);
