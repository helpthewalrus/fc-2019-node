import express from "express";

import {
  readMiddleware,
  writeMiddleware,
  sendArticlesMiddleware,
  sendArticleMiddleware,
  createArticleMiddleware,
  updateArticleMiddleware,
  deleteArticleMiddleware
} from "../../middleware/api-middlewares.js";

const router = express.Router();

// Get all articles
router.get("/", [readMiddleware, sendArticlesMiddleware]);

// Get single article
router.get("/:id", [readMiddleware, sendArticleMiddleware]);

// Create article
router.post("/", [readMiddleware, createArticleMiddleware, writeMiddleware]);

// Update article
router.put("/:id", [readMiddleware, updateArticleMiddleware, writeMiddleware]);

// Delete article
router.delete("/:id", [
  readMiddleware,
  deleteArticleMiddleware,
  writeMiddleware
]);

export { router };
