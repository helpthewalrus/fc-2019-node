import passport from "passport";
import mongoose from "mongoose";
import LocalStrategy from "passport-local";
import FacebookStrategy from "passport-facebook";

import { User } from "./api/models/User.js";

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(
  new LocalStrategy({ usernameField: "email" }, function(
    email,
    password,
    done
  ) {
    User.findOne({ email: email }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect email." });
      }
      if (!user.checkPassword(password)) {
        return done(null, false, { message: "Incorrect password." });
      }
      return done(null, user);
    });
  })
);

passport.use(
  new FacebookStrategy(
    {
      clientID: "569006370550495",
      clientSecret: "df0fbafe33420c36ababbc02fb0c4634",
      callbackURL: "http://localhost:3001/api/user/login/facebook/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOne({ "facebook.id": profile.id }, function(err, user) {
        if (err) return done(err);
        if (user) return done(null, user);
        else {
          const newUser = new User({
            _id: new mongoose.Types.ObjectId()
          });

          newUser.facebook.id = profile.id;
          newUser.facebook.token = accessToken;
          newUser.facebook.name = profile.displayName;
          if (typeof profile.emails != "undefined" && profile.emails.length > 0)
            newUser.facebook.email = profile.emails[0].value;

          newUser.save(function(err) {
            if (err) throw err;
            return done(null, newUser);
          });
        }
      });
    }
  )
);
