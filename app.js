import express from "express";
import session from "express-session";
import passport from "passport";
import mongoose from "mongoose";

import { articlesRouter } from "./api/routes/articles.js";
import { userRouter } from "./api/routes/user.js";
import { adminRouter } from "./api/routes/admin.js";
import { logger } from "./middleware/logger.js";
import "./passport-config.js";

mongoose.connect(
  "mongodb+srv://node-news-api:GeicIuqZApNKbI5g@news-mongoose-uitoy.mongodb.net/test?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

const app = express();
const port = 3001;

// Init middleware
app.use(logger);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: "hahaNNN",
    cookie: {
      path: "/",
      httpOnly: true,
      maxAge: 60 * 60 * 1000
    },
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Articles API routes
app.use("/api/news", articlesRouter);

// User API routes
app.use("/api/user", userRouter);

// Admin API routes
app.use("/admin", adminRouter);

app.use((req, res, next) => {
  const error = new Error("Not found");
  res.status = 404;
  next(error);
});

app.use(function(error, req, res, next) {
  res.status(error.status || 500).json({ message: error.message });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
