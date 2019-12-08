import express from "express";
import { checkAuth, sendResponse } from "../../middlewares/index.js";

export const adminRouter = express.Router();

const adminRequest = (req, res, next) => {
  req.data = { message: "Admin panel is loaded" };
  req.status = 200;
  next();
};

adminRouter.get("/", [checkAuth, adminRequest, sendResponse]);
