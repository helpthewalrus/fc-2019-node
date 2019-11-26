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

app.use(function(error, req, res, next) {
  console.log(error);
  res.json({ message: error.message });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
