import {
  readData,
  writeData,
  addNewArticle,
  findArticle,
  modifyArticle
} from "../utils/dataUtils.js";

const FILENAME = "./news.json";

export const readMiddleware = async (req, res, next) => {
  const data = await readData(FILENAME).catch(err => next(err));
  req.data = data;
  next();
};

export const writeMiddleware = async (req, res, next) => {
  await writeData(FILENAME, req.combinedData).catch(err => next(err));
  req.data = { message: `Article ${req.articleStatus}` };
  next();
};

export const sendResponseMiddleware = (req, res) =>
  res
    .status(200)
    .type("json")
    .send(req.data);

export const sendArticleMiddleware = (req, res, next) => {
  const foundArticle = findArticle(req);
  if (foundArticle) {
    req.data = foundArticle;
    next();
  } else {
    const error = new Error(
      `No article with the id of ${req.params.id} was found`
    );
    next(error);
  }
};

export const createArticleMiddleware = (req, res, next) => {
  const { title, url } = req.body;

  if (!title || !url) {
    const error = new Error("Please include title and url");
    next(error);
  } else {
    const combinedData = addNewArticle(req);
    req.combinedData = combinedData;
    req.articleStatus = "added";
    next();
  }
};

export const modifyArticleMiddleware = (req, res, next) => {
  const parsedData = modifyArticle(req);

  if (parsedData) {
    req.combinedData = parsedData;
    switch (req.method) {
      case "DELETE":
        req.articleStatus = "deleted";
        break;

      default:
        req.articleStatus = "updated";
        break;
    }
    next();
  } else {
    const error = new Error(
      `No article with the id of ${req.params.id} was found`
    );
    next(error);
  }
};
