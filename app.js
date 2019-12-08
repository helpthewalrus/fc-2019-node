import express from "express";
import session from "express-session";
import passport from "passport";
import mongoose from "mongoose";

import { articlesRouter, userRouter, adminRouter } from "./api/routes/index.js";
import { logger } from "./middlewares/index.js";
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
  const error = new Error("NOT FOUND");
  error.status = 404;
  next(error);
});

app.use(function(error, req, res, next) {
  res.status(error.status || 500).json({ message: error.message });
});

app.listen(port, () => console.log(`EXAMPLE APP LISTENING ON PORT ${port}!`));
