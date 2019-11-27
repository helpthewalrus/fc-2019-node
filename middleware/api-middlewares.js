import fs from "fs";
import uuid from "uuid";

import { Article } from "../components/Article.js";

const FILENAME = "./news.json";

export const readMiddleware = (req, res, next) => {
  fs.readFile(FILENAME, "utf-8", (err, data) => {
    if (err) {
      next(new Error(`NO SUCH FILE (${FILENAME}) FOUND`));
    }
    req.data = data;
    next();
  });
};

export const writeMiddleware = (req, res, next) => {
  fs.writeFile(FILENAME, JSON.stringify(req.combinedData), err => {
    if (err) {
      next(`NO SUCH FILE (${FILENAME}) FOUND`);
    }
    res.status(200).json({ message: `Article ${req.articleStatus}` });
    next();
  });
};

export const sendArticlesMiddleware = (req, res) =>
  res.type("json").send(req.data);

export const sendArticleMiddleware = (req, res, next) => {
  const parsedData = JSON.parse(req.data);
  const found = parsedData.find(article => article.id === +req.params.id);

  if (found) {
    return res.type("json").send(found);
  }

  return res.status(400).json({
    message: `No article with the id of ${req.params.id} was found`
  });
};

export const createArticleMiddleware = (req, res, next) => {
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
  const combinedData = [...JSON.parse(req.data), newArticle];
  req.combinedData = combinedData;
  req.articleStatus = "added";
  next();
};

export const updateArticleMiddleware = (req, res, next) => {
  const parsedData = JSON.parse(req.data);
  const foundIndex = parsedData.findIndex(
    article => article.id === +req.params.id
  );

  if (foundIndex !== -1) {
    parsedData[foundIndex] = { ...parsedData[foundIndex], ...req.body };
    req.combinedData = parsedData;
    req.articleStatus = "updated";
    next();
  } else {
    res.status(400).json({
      message: `No article with the id of ${req.params.id} was found`
    });
  }
};

export const deleteArticleMiddleware = (req, res, next) => {
  const parsedData = JSON.parse(req.data);
  const foundIndex = parsedData.findIndex(
    article => article.id === +req.params.id
  );

  if (foundIndex !== -1) {
    parsedData.splice(foundIndex, 1);
    req.combinedData = parsedData;
    req.articleStatus = "deleted";
    next();
  } else {
    res.status(400).json({
      message: `No article with the id of ${req.params.id} was found`
    });
  }
};
