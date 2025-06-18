import logger from "../utils/logger.js";

export const addLogger = (req, res, next) => {
  req.logger = logger;

  res.on("finish", () => {
    req.logger.info(
      `${req.method} ${req.url} - ${
        res.statusCode
      } - ${new Date().toLocaleTimeString()}`
    );
  });

  next();
};
