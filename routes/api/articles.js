import express from "express";
import fs from "fs";
import uuid from "uuid";

const router = express.Router();
const FILENAME = "./news.json";

// Get all articles
router.get("/", (req, res, next) => {
  fs.readFile(FILENAME, "utf-8", (err, data) => {
    if (err) {
      next(new Error(`NO SUCH FILE (${FILENAME}) FOUND`));
    }
    res.type("json").send(data);
  });
});

// Get single article
router.get("/:id", (req, res, next) => {
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
});

// Create article
router.post("/", (req, res, next) => {
  const newArticle = {
    id: uuid.v4(),
    author: req.body.author,
    title: req.body.title,
    description: req.body.description,
    url: req.body.url,
    urlToImage: req.body.urlToImage,
    publishedAt: req.body.publishedAt
  };

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
});

// Update article
router.put("/:id", (req, res, next) => {
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
});

// Delete article
router.delete("/:id", (req, res, next) => {
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
});

export { router };
