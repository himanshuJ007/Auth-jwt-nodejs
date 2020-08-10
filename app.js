"use strict";
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const Signup = require("./model/signup");
const path = require("path");
const connectDB = require("./model/connection");
var jsonParser = require("body-parser").json;
app.use(jsonParser());
connectDB();

app.use(express.static(path.join(__dirname,"public")))

app.get("/home", verifyToken, (req, res) => {
  console.log("inside home");
  jwt.verify(req.token, "secretkey", (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.sendFile(path.join(__dirname, "public/html", "homePage.html"));
      res.json({
        message: "Home_Page...",
        authdata: authData,
      });
    }
  });
});

// // FORMAT OF TOKEN
// // Authorization: Bearer <access_token>

// Verify Token
function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers["authorization"];
  // Check if bearer is undefined
  if (typeof bearerHeader !== "undefined") {
    // Split at the space
    const bearer = bearerHeader.split(" ");
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }
}

app.get("/register", async (req, res) => {
  res.sendFile(path.join(__dirname, "public/html", "signup.html"));
});

app.post("/register", async (req, res) => {
  // First Validate The Request
  console.log(req.body);
  if (
    req.body.UserName == null ||
    req.body.Email == null ||
    req.body.Password == null
  ) {
    res.sendFile(path.join(__dirname, "public/html", "signup.html"));
    return res.send("Please Enter All Details");
  }

  // Check if this user already exisits
  let user = await Signup.findOne({ Email: req.body.Email });
  if (user) {
    return res.status(400).send("That user already exisits!");
  } else {
    // Insert the new user if they do not exist yet
    user = new Signup({
      UserName: req.body.UserName,
      Email: req.body.Email,
      Password: req.body.Password,
    });
    if (await user.save()) {
      res.sendFile(path.join(__dirname, "public/html", "login.html"));

      res.send(user);
    } else {
      res.sendFile(path.join(__dirname, "public/html", "signup.html"));
      res.send("Error");
    }
  }
});

app.get("/login", async (req, res) => {
  if (
    req.body.Email == null ||
    req.body.Password == null
  ) {
    res.sendFile(path.join(__dirname, "public/html", "login.html"));
    return res.send("Please Enter All Details");
  }
  let user = await Signup.findOne({ Email: req.body.Email });
  if (user) {
    if (user.Password == req.body.Password) {
      jwt.sign({ user }, "secretkey", (err, token) => {
        res.json({
          Message: "Welcome",
          token: token,
          user: user,
        });
        res.sendFile(path.join(__dirname, "public/html", "homePage.html"));
        res.redirect("/home");
      });
    } else {
      res.sendFile(path.join(__dirname, "public/html", "login.html"));
      res.json("Invalid Username And Password");
    }
  } else {
    res.sendFile(path.join(__dirname, "public/html", "login.html"));
    res.json("Invalid Username And Password");
  }
});

app.listen(5000, () => console.log("Server started on port 5000"));
