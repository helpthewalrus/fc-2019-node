import express from "express";

import {
  getArticlesUtility,
  getArticleUtility,
  createArticleUtility,
  updateArticleUtility,
  deleteArticleUtility
} from "../../utilities/utilities.js";

const router = express.Router();

// Get all articles
router.get("/", getArticlesUtility);

// Get single article
router.get("/:id", getArticleUtility);

// Create article
router.post("/", createArticleUtility);

// Update article
router.put("/:id", updateArticleUtility);

// Delete article
router.delete("/:id", deleteArticleUtility);

export { router };
