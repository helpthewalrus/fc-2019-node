import express from "express";
import mongoose from "mongoose";
import passport from "passport";

import { User } from "../models/User.js";

import { sendResponseMiddleware } from "../../middleware/api-middlewares.js";

export const userRouter = express.Router();

userRouter.post("/signup", [
  (req, res, next) => {
    User.find({ email: req.body.email })
      .exec()
      .then(users => {
        if (users.length >= 1) {
          const error = new Error(`Email ${req.body.email} already exists`);
          next(error);
        } else {
          const user = new User({
            _id: new mongoose.Types.ObjectId(),
            email: req.body.email,
            password: req.body.password
          });
          user
            .save()
            .then(result => {
              req.data = { message: "User created" };
              next();
            })
            .catch(err => {
              const error = new Error(err.message);
              next(error);
            });
        }
      });
  },
  sendResponseMiddleware
]);

userRouter.post("/login", function(req, res, next) {
  passport.authenticate("local", function(err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect("/api/users/login");
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      return res.redirect("/api/news");
    });
  })(req, res, next);
});

userRouter.get("/login", function(req, res, next) {
  res.status(200).json({ message: "Need to login" });
});

userRouter.delete(
  "/:userId",
  (req, res, next) => {
    User.deleteOne({ _id: req.params.userId })
      .exec()
      .then(() => {
        req.data = { message: `User was deleted` };
        next();
      })
      .catch(err => {
        const error = new Error("No user was deleted");
        next(error);
      });
  },
  sendResponseMiddleware
);
