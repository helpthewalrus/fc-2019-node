import mongoose from "mongoose";

const articleSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  author: String,
  title: String,
  description: String,
  url: String,
  urlToImage: String,
  publishedAt: Date
});

export const Article = mongoose.model("Article", articleSchema);
