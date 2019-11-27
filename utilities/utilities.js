import {
  readMiddleware,
  writeMiddleware,
  sendArticlesMiddleware,
  sendArticleMiddleware,
  createArticleMiddleware,
  updateArticleMiddleware,
  deleteArticleMiddleware
} from "../middleware/api-middlewares.js";

// Get all articles
const getArticlesUtility = [readMiddleware, sendArticlesMiddleware];

// Get chosen article
const getArticleUtility = [readMiddleware, sendArticleMiddleware];

// Create article
const createArticleUtility = [
  readMiddleware,
  createArticleMiddleware,
  writeMiddleware
];

// Update article
const updateArticleUtility = [
  readMiddleware,
  updateArticleMiddleware,
  writeMiddleware
];

// Delete article
const deleteArticleUtility = [
  readMiddleware,
  deleteArticleMiddleware,
  writeMiddleware
];

export {
  getArticlesUtility,
  getArticleUtility,
  createArticleUtility,
  updateArticleUtility,
  deleteArticleUtility
};
