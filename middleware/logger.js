import moment from "moment";

export const logger = (req, res, next) => {
  console.log(`URL: ${req.protocol}://${req.get("host")}${req.originalUrl}
  TIME: ${moment().format()}`);
  next();
};
