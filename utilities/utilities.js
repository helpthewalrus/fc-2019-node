import fs from "fs";
import uuid from "uuid";

import { Article } from "../components/Article.js";

const FILENAME = "./news.json";

// Get all articles
const getArticlesUtility = (req, res, next) => {
  fs.readFile(FILENAME, "utf-8", (err, data) => {
    if (err) {
      next(new Error(`NO SUCH FILE (${FILENAME}) FOUND`));
    }
    res.type("json").send(data);
  });
};

// Get chosen article
const getArticleUtility = (req, res, next) => {
  fs.readFile(FILENAME, "utf-8", (err, data) => {
    if (err) {
      next(`NO SUCH FILE (${FILENAME}) FOUND`);
    }
    const parsedData = JSON.parse(data);
    const found = parsedData.find(article => article.id === +req.params.id);

    if (found) {
      return res.type("json").send(found);
    }

    return res.status(400).json({
      message: `No article with the id of ${req.params.id} was found`
    });
  });
};

// Create article
const createArticleUtility = (req, res, next) => {
  const { author, title, description, url, urlToImage, publishedAt } = req.body;

  const newArticle = new Article(
    uuid.v4(),
    author,
    title,
    description,
    url,
    urlToImage,
    publishedAt
  );

  if (!newArticle.title || !newArticle.url) {
    return res.status(400).json({ message: "Please include title and url" });
  }

  fs.readFile(FILENAME, "utf-8", (err, data) => {
    if (err) {
      next(`NO SUCH FILE (${FILENAME}) FOUND`);
    }

    const combinedData = [...JSON.parse(data), newArticle];
    const stringifiedData = JSON.stringify(combinedData);

    fs.writeFile(FILENAME, stringifiedData, err => {
      if (err) {
        next(`NO SUCH FILE (${FILENAME}) FOUND`);
      }
      res.status(200).json({ message: "Article added" });
    });
  });
};

// Update article
const updateArticleUtility = (req, res, next) => {
  fs.readFile(FILENAME, "utf-8", (err, data) => {
    if (err) {
      next(`NO SUCH FILE (${FILENAME}) FOUND`);
    }
    const parsedData = JSON.parse(data);
    const foundIndex = parsedData.findIndex(
      article => article.id === +req.params.id
    );

    if (foundIndex !== -1) {
      parsedData[foundIndex] = { ...parsedData[foundIndex], ...req.body };
      fs.writeFile(FILENAME, JSON.stringify(parsedData), err => {
        if (err) {
          next(`NO SUCH FILE (${FILENAME}) FOUND`);
        }
        return res.status(200).json({ message: "Article updated" });
      });
    } else {
      res.status(400).json({
        message: `No article with the id of ${req.params.id} was found`
      });
    }
  });
};

// Delete article
const deleteArticleUtility = (req, res, next) => {
  fs.readFile(FILENAME, "utf-8", (err, data) => {
    if (err) {
      next(`NO SUCH FILE (${FILENAME}) FOUND`);
    }
    const parsedData = JSON.parse(data);
    const foundIndex = parsedData.findIndex(
      article => article.id === +req.params.id
    );

    if (foundIndex !== -1) {
      parsedData.splice(foundIndex, 1);
      fs.writeFile(FILENAME, JSON.stringify(parsedData), err => {
        if (err) {
          next(`NO SUCH FILE (${FILENAME}) FOUND`);
        }
        return res.status(200).json({ message: "Article deleted" });
      });
    } else {
      res.status(400).json({
        message: `No article with the id of ${req.params.id} was found`
      });
    }
  });
};

export {
  getArticlesUtility,
  getArticleUtility,
  createArticleUtility,
  updateArticleUtility,
  deleteArticleUtility
};
