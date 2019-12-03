import express from "express";

import {
  readMiddleware,
  sendResponseMiddleware,
  sendArticleMiddleware,
  createArticleMiddleware,
  deleteArticleMiddleware,
  updateArticleMiddleware
} from "../../middleware/api-middlewares.js";

export const router = express.Router();

// Get all articles
router.get("/", [readMiddleware, sendResponseMiddleware]);

// Get single article
router.get("/:id", [sendArticleMiddleware, sendResponseMiddleware]);

// Create article
router.post("/", [createArticleMiddleware, sendResponseMiddleware]);

// Update article
router.patch("/:id", [updateArticleMiddleware, sendResponseMiddleware]);

// Delete article
router.delete("/:id", [deleteArticleMiddleware, sendResponseMiddleware]);
