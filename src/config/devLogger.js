import winston from "winston";
import { customLevelOptions } from "./customLevels.js";

winston.addColors(customLevelOptions.colors);

export const devLogger = winston.createLogger({
  levels: customLevelOptions.levels,
  level: "debug",
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ colors: customLevelOptions.colors }),
        winston.format.timestamp(),
        winston.format.printf(({ level, message, timestamp }) => {
          return `${timestamp} [${level}]: ${message}`;
        })
      ),
    }),
    new winston.transports.File({
      filename: "errors.log",
      level: "warn",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
  ],
});
