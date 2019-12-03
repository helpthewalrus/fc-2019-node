import uuid from "uuid";

export class Article {
  constructor({ author, title, description, url, urlToImage, publishedAt }) {
    this.id = uuid.v4();
    this.author = author;
    this.title = title;
    this.description = description;
    this.url = url;
    this.urlToImage = urlToImage;
    this.publishedAt = publishedAt;
  }
}
