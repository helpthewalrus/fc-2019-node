import express from "express";

import {
  readMiddleware,
  writeMiddleware,
  sendResponseMiddleware,
  sendArticleMiddleware,
  createArticleMiddleware,
  modifyArticleMiddleware
} from "../../middleware/api-middlewares.js";

export const router = express.Router();

// Get all articles
router.get("/", [readMiddleware, sendResponseMiddleware]);

// Get single article
router.get("/:id", [
  readMiddleware,
  sendArticleMiddleware,
  sendResponseMiddleware
]);

// Create article
router.post("/", [
  readMiddleware,
  createArticleMiddleware,
  writeMiddleware,
  sendResponseMiddleware
]);

// Update article
router.put("/:id", [
  readMiddleware,
  modifyArticleMiddleware,
  writeMiddleware,
  sendResponseMiddleware
]);

// Delete article
router.delete("/:id", [
  readMiddleware,
  modifyArticleMiddleware,
  writeMiddleware,
  sendResponseMiddleware
]);
