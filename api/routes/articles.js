import express from "express";

import {
  readMiddleware,
  sendResponseMiddleware,
  sendArticleMiddleware,
  createArticleMiddleware,
  deleteArticleMiddleware,
  updateArticleMiddleware
} from "../../middleware/api-middlewares.js";

export const articlesRouter = express.Router();

// Get all articles
articlesRouter.get("/", [readMiddleware, sendResponseMiddleware]);

// Get single article
articlesRouter.get("/:id", [sendArticleMiddleware, sendResponseMiddleware]);

// Create article
articlesRouter.post("/", [createArticleMiddleware, sendResponseMiddleware]);

// Update article
articlesRouter.patch("/:id", [updateArticleMiddleware, sendResponseMiddleware]);

// Delete article
articlesRouter.delete("/:id", [
  deleteArticleMiddleware,
  sendResponseMiddleware
]);
