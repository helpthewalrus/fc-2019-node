import express from "express";

import { router } from "./routes/api/articles.js";
import { logger } from "./middleware/logger.js";

const app = express();
const port = 3001;

// Init middleware
app.use(logger);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Articles API routes
app.use("/api/news", router);

app.use((req, res, next) => {
  const error = new Error("Not found");
  res.status = 404;
  next(error);
});

app.use(function(error, req, res, next) {
  console.log(error);
  res.json({ message: error.message });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
