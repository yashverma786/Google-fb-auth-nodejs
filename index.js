const express = require("express");
const passport = require("passport");
const { Strategy } = require("passport-google-oauth20");
var GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = reuire("passport-facebook").Strategy;

const app = express();

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "572598184405-rdc50lnhrtnv85qeol1bfsv5iu2a0vur.apps.googleusercontent.com",
      clientSecret: "VabcUizAktqRdbwzsbA5Zusw",
      callbackURL: "http://localhost:4000/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log("profile", profile);
      console.log("accessToken", accessToken);
      console.log("refreshToken", refreshToken);

      // User.findOrCreate({ googleId: profile.id }, function (err, user) {
      //    return cb(err, user);
      //  });
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:3000/auth/fb/auth",
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log("profile", profile);
      console.log("accessToken", accessToken);
      console.log("refreshToken", refreshToken);
      // User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      //   return cb(err, user);
      // });
    }
  )
);

app.get("/login/fb", passport.authenticate("facebook"));

app.use("/failed/login", (req, res, next) => {
  res.send("login failed");
});
app.use(
  "/fb/auth",
  passport.authenticate("facebook", {
    failureRedirect: "/failed/login",
    successRedirect: "/profile",
  }),
  function (req, res) {
    //  console.log(req.user);
    res.send("logged in to facebook");
  }
);

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/google/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

app.get("/google/login", (req, res) => {
  res.send("login failed");
});

app.get("/", (req, res) => {
  res.send("hello");
});

app.listen(4000, () => {
  console.log("running on port 4000");
});
