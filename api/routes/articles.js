import express from "express";
import mongoose from "mongoose";

import { Article } from "../../api/models/Article.js";
import { sendResponse, checkAuth } from "../../middlewares/index.js";

const readArticles = async (req, res, next) => {
  Article.find()
    .exec()
    .then(articles => {
      req.data = articles;
      next();
    })
    .catch(() => {
      const error = new Error("NO ARTICLES WERE FOUND");
      next(error);
    });
};

const readArticle = (req, res, next) => {
  const articleId = req.params.id;
  Article.findById(articleId)
    .exec()
    .then(article => {
      req.data = article;
      next();
    })
    .catch(() => {
      const error = new Error(
        `NO ARTICLE WITH ID OF ${req.params.id} WAS FOUND`
      );
      next(error);
    });
};

const createArticle = (req, res, next) => {
  const { title, url } = req.body;

  if (!title || !url) {
    const error = new Error("PLEASE INCLUDE TITLE AND URL");
    next(error);
  } else {
    const newArticle = new Article({
      _id: new mongoose.Types.ObjectId(),
      ...req.body
    });
    newArticle
      .save()
      .then(() => {
        req.data = { message: "ARTICLE ADDED", articleData: newArticle };
        next();
      })
      .catch(() => {
        const error = new Error("NO ARTICLE WAS ADDED");
        next(error);
      });
  }
};

const updateArticle = (req, res, next) => {
  const articleId = req.params.id;
  Article.update({ _id: articleId }, { $set: { ...req.body } })
    .exec()
    .then(() => {
      req.data = { message: "ARCTICLE UPDATES", articleData: req.body };
      next();
    })
    .catch(() => {
      const error = new Error("NO ARTICLE WAS UPDATED");
      next(error);
    });
};

const deleteArticle = (req, res, next) => {
  const articleId = req.params.id;
  Article.remove({ _id: articleId })
    .exec()
    .then(() => {
      req.data = { message: `ARTICLE WITH ID ${articleId} WAS DELETED` };
      next();
    })
    .catch(() => {
      const error = new Error(`NO ARTICLE WITH ID ${articleId} WAS FOUND`);
      next(error);
    });
};

export const articlesRouter = express.Router();

// Get all articles
articlesRouter.get("/", [checkAuth, readArticles, sendResponse]);

// Get single article
articlesRouter.get("/:id", [checkAuth, readArticle, sendResponse]);

// Create article
articlesRouter.post("/", [checkAuth, createArticle, sendResponse]);

// Update article
articlesRouter.patch("/:id", [checkAuth, updateArticle, sendResponse]);

// Delete article
articlesRouter.delete("/:id", [checkAuth, deleteArticle, sendResponse]);
