import winston from "winston";
import { homedir } from "os";
import { environment, getPreferenceValues } from "@raycast/api";

class Logger {
  private static instance: winston.Logger | null = null;
  private static logPath: string;
  private static logFilename: string;

  static getInstance(): winston.Logger {
    if (Logger.instance !== null) return Logger.instance;

    const preferences = getPreferenceValues<Preferences>();
    Logger.logPath = preferences.logPath.startsWith("~")
      ? preferences.logPath.replace("~", homedir())
      : preferences.logPath;

    Logger.logFilename = "raycast-deployhq";

    Logger.instance = winston.createLogger({
      level: "info",
      format: winston.format.combine(winston.format.timestamp(), winston.format.prettyPrint()),
      transports: [
        new winston.transports.File({
          filename: `${Logger.logPath}${Logger.logFilename}-debug.log`,
          level: "debug",
        }),
        new winston.transports.File({
          filename: `${Logger.logPath}${Logger.logFilename}-info.log`,
          level: "info",
        }),
        new winston.transports.File({
          filename: `${Logger.logPath}${Logger.logFilename}-error.log`,
          level: "error",
        }),
      ],
    });
    return Logger.instance;
  }
}

export const logger = Logger.getInstance();
