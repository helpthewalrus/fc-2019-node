import express from "express";
import mongoose from "mongoose";

import { articlesRouter } from "./api/routes/articles.js";
import { logger } from "./middleware/logger.js";

mongoose.connect(
  "mongodb+srv://node-news-api:GeicIuqZApNKbI5g@news-mongoose-uitoy.mongodb.net/test?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);

const app = express();
const port = 3001;

// Init middleware
app.use(logger);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Articles API routes
app.use("/api/news", articlesRouter);
app.use((req, res, next) => {
  const error = new Error("Not found");
  res.status = 404;
  next(error);
});

app.use(function(error, req, res, next) {
  res.status(500).json({ message: error.message });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
