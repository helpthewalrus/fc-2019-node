import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import { checkAuth } from "../../middleware/checkAuth.js";

export const adminRouter = express.Router();

adminRouter.get("/", [
  checkAuth,
  (req, res, next) => {
    res.status(200).json({ message: "Admin panel is loaded" });
  }
]);
