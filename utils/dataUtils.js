import { promises as fs } from "fs";
import { Article } from "../components/Article.js";

export const readData = async filePath => {
  return await fs.readFile(filePath, "utf-8").catch(() => {
    throw new Error("FILE CAN'T BE READ");
  });
};

export const writeData = async (filePath, data) => {
  return await fs
    .writeFile(filePath, JSON.stringify(data, null, 2))
    .catch(() => {
      throw new Error("CAN'T WRITE FILE");
    });
};

export const findArticle = request => {
  const parsedData = JSON.parse(request.data);
  return parsedData.find(article => article.id === +request.params.id);
};

export const findArticleIndex = (parsedData, request) => {
  return parsedData.findIndex(article => article.id === +request.params.id);
};

export const addNewArticle = request => {
  const newArticle = new Article(request.body);
  return [...JSON.parse(request.data), newArticle];
};

export const modifyArticle = request => {
  const parsedData = JSON.parse(request.data);
  const foundIndex = findArticleIndex(parsedData, request);
  if (foundIndex !== -1) {
    switch (request.method) {
      case "DELETE":
        parsedData.splice(foundIndex, 1);
        break;

      default:
        parsedData[foundIndex] = { ...parsedData[foundIndex], ...request.body };
        break;
    }
    return parsedData;
  }
  return false;
};
