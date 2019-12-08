import express from "express";
import mongoose from "mongoose";
import passport from "passport";

import { User } from "../models/User.js";

import { sendResponse } from "../../middlewares/index.js";

export const userRouter = express.Router();

const userSignUp = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then(user => {
      if (user) {
        const error = new Error(`Email ${req.body.email} already exists`);
        next(error);
      }
      const newUser = new User({
        _id: new mongoose.Types.ObjectId(),
        email: req.body.email,
        password: req.body.password
      });
      newUser
        .save()
        .then(() => {
          req.data = { message: "User created" };
          next();
        })
        .catch(err => {
          const error = new Error(err.message);
          next(error);
        });
    });
};

const userLogin = (req, res, next) => {
  passport.authenticate("local", (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect("/api/user/login");
    }
    req.logIn(user, err => {
      if (err) {
        return next(err);
      }
      return res.redirect("/api/news");
    });
  })(req, res, next);
};

const needToLogIn = (req, res, next) => {
  req.data = { message: "Need to log in" };
  next();
};

const deleteUser = (req, res, next) => {
  User.deleteOne({ _id: req.params.userId })
    .exec()
    .then(() => {
      req.data = { message: `User was deleted` };
      next();
    })
    .catch(err => {
      const error = new Error(err.message);
      next(error);
    });
};

userRouter.post("/signup", [userSignUp, sendResponse]);

userRouter.post("/login", userLogin);

userRouter.get("/login", [needToLogIn, sendResponse]);

userRouter.get("/login/facebook", passport.authenticate("facebook"));

userRouter.get("/login/facebook/callback", [
  passport.authenticate("facebook", { failureRedirect: "/api/user/login" }),
  (req, res) => res.redirect("/api/news")
]);

userRouter.delete("/:userId", [deleteUser, sendResponse]);
