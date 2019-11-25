import express from "express";
import fs from "fs";
import uuid from "uuid";

const router = express.Router();

// Get all articles
router.get("/", (req, res) => {
  fs.readFile("./news.json", "utf-8", (err, data) => {
    if (err) {
      throw err;
    }
    res.type("json").send(data);
  });
});

// Get single article
router.get("/:id", (req, res) => {
  fs.readFile("./news.json", "utf-8", (err, data) => {
    if (err) {
      throw err;
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
router.post("/", (req, res) => {
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

  fs.readFile("./news.json", "utf-8", (err, data) => {
    if (err) {
      throw err;
    }

    const combinedData = [...JSON.parse(data), newArticle];
    const stringifiedData = JSON.stringify(combinedData);
    console.log(stringifiedData);

    fs.writeFile("./news.json", stringifiedData, err => {
      if (err) {
        throw err;
      }
      res.status(200).json({ message: "Article added" });
    });
  });
});

// Update article
router.put("/:id", (req, res) => {
  fs.readFile("./news.json", "utf-8", (err, data) => {
    if (err) {
      throw err;
    }
    const parsedData = JSON.parse(data);
    const foundIndex = parsedData.findIndex(
      article => article.id === +req.params.id
    );

    if (foundIndex !== -1) {
      parsedData[foundIndex] = { ...parsedData[foundIndex], ...req.body };
      fs.writeFile("./news.json", JSON.stringify(parsedData), err => {
        if (err) {
          throw err;
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
router.delete("/:id", (req, res) => {
  fs.readFile("./news.json", "utf-8", (err, data) => {
    if (err) {
      throw err;
    }
    const parsedData = JSON.parse(data);
    const foundIndex = parsedData.findIndex(
      article => article.id === +req.params.id
    );

    if (foundIndex !== -1) {
      parsedData.splice(foundIndex, 1);
      fs.writeFile("./news.json", JSON.stringify(parsedData), err => {
        if (err) {
          throw err;
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
