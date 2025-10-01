import winston from "winston";
import { homedir } from "os";
import { environment, getPreferenceValues } from "@raycast/api";

class LoggerSingleton {
  private static instance: winston.Logger | null = null;
  private static logPath: string;
  private static logFilename: string;

  static getInstance(): winston.Logger {
    if (LoggerSingleton.instance !== null) return LoggerSingleton.instance;

    const preferences = getPreferenceValues<Preferences>();
    LoggerSingleton.logPath = preferences.logPath.startsWith("~")
      ? preferences.logPath.replace("~", homedir())
      : preferences.logPath;

    LoggerSingleton.logFilename = "raycast-deployhq";

    LoggerSingleton.instance = winston.createLogger({
      level: "info",
      format: winston.format.combine(winston.format.timestamp(), winston.format.prettyPrint()),
      transports: !environment.isDevelopment
        ? [
            new winston.transports.Console({
              format: winston.format.simple(),
            }),
          ]
        : [
            new winston.transports.File({
              filename: `${LoggerSingleton.logPath}${LoggerSingleton.logFilename}.log`,
              level: "debug",
            }),
          ],
    });
    return LoggerSingleton.instance;
  }
}

export const Logger = LoggerSingleton.getInstance();
