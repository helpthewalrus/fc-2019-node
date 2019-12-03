import mongoose from "mongoose";

import { Article } from "../api/models/article.js";

const FILENAME = "./news.json";

export const readMiddleware = async (req, res, next) => {
  Article.find()
    .exec()
    .then(articles => {
      req.data = articles;
      next();
    })
    .catch(err => {
      const error = new Error("No articles were found");
      next(error);
    });
};

export const writeMiddleware = async (req, res, next) => {
  await writeData(FILENAME, req.combinedData).catch(err => next(err));
  req.data = { message: `Article ${req.articleStatus}` };
  next();
};

export const sendResponseMiddleware = (req, res) => {
  res
    .status(200)
    .type("json")
    .send(req.data);
};

export const sendArticleMiddleware = (req, res, next) => {
  const articleId = req.params.id;
  Article.findById(articleId)
    .exec()
    .then(article => {
      req.data = article;
      next();
    })
    .catch(err => {
      const error = new Error(
        `No article with the id of ${req.params.id} was found`
      );
      next(error);
    });
};

export const createArticleMiddleware = (req, res, next) => {
  const { title, url } = req.body;

  if (!title || !url) {
    const error = new Error("Please include title and url");
    next(error);
  } else {
    const newArticle = new Article({
      _id: new mongoose.Types.ObjectId(),
      ...req.body
    });
    newArticle
      .save()
      .then(() => {
        req.data = { message: "Article added", articleData: newArticle };
        next();
      })
      .catch(() => {
        const error = new Error("No article was added");
        next(error);
      });
  }
};

export const updateArticleMiddleware = (req, res, next) => {
  const articleId = req.params.id;
  Article.update({ _id: articleId }, { $set: { ...req.body } })
    .exec()
    .then(() => {
      req.data = { message: "Article updated", articleData: req.body };
      next();
    })
    .catch(() => {
      const error = new Error("No article was updated");
      next(error);
    });
};

export const deleteArticleMiddleware = (req, res, next) => {
  const articleId = req.params.id;
  Article.remove({ _id: articleId })
    .exec()
    .then(() => {
      req.data = { message: `Article with id ${articleId} was deleted` };
      next();
    })
    .catch(() => {
      const error = new Error(
        `No article with the id of ${articleId} was found`
      );
      next(error);
    });
};
