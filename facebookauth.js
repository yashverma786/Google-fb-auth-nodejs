const express = require("express");
const passport = require("passport");
const FacebookStrategy = reuire("passport-facebook").Strategy;

const app = express();

passport.use(
  new FacebookStrategy(
    {
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:3000/auth/fb/auth",
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        console.log("profile", profile);
        console.log("accessToken", accessToken);
        console.log("refreshToken", refreshToken);
        await User.findOne(
          { facebookId: profile.id, email: profile.email },
          function (err, user) {
            if (err) {
              return done(err);
            }
            if (user) {
              console.log("user found");
              console.log(user);
              return done(null, user);
            } else {
              var newUser = new User();
              newUser.uid = profile.id;
              newUser.token = token;
              newUser.name =
                profile.name.givenName + " " + profile.name.familyName;
              newUser.email = profile.emails[0].value;
              newUser.gender = profile.gender;
              newUser.pic = profile.photos[0].value;

              newUser.save(function (err) {
                if (err) throw err;

                // if successful, return the new user
                return done(null, newUser);
              });
            }
            return cb(err, user);
          }
        );
      } catch (error) {
        done(error, false, error.message);
      }
    }
  )
);

app.get(
  "/login/fb",
  passport.authenticate("facebook", { scope: ["profile", "email"] })
);

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

app.listen(4000, () => {
  console.log("running on port 4000");
});
