import { writeFile, mkdir } from "fs/promises";
import { environment } from "@raycast/api";
import { dirname } from "path";
import { homedir } from "os";

/**
 * Logger for This specific extension
 * (Only works in development mode)
 * @param logPath - The path to the log file, make sure that this is in a writable directory
 * @param logFilename - The name of the log file
 */
export default class Logger {
  private logPath: string;
  private logFilename: string;

  constructor(logPath: string, logFilename: string) {
    // Expand ~ to home directory
    this.logPath = logPath.startsWith("~") ? logPath.replace("~", homedir()) : logPath;
    this.logFilename = logFilename;
  }

  public async log(content: any, fileName: string = this.logFilename) {
    if (content === undefined) return;

    if (environment.isDevelopment !== true) return;

    const timeStamp = new Date().toISOString();

    try {
      const fullPath = this.logPath + fileName;
      // Create directory if it doesn't exist
      await mkdir(dirname(fullPath), { recursive: true });
      await writeFile(fullPath, JSON.stringify({ timeStamp, content }, null, 2));
    } catch (logError) {
      console.error("Failed to write log file:", logError);
    }
  }
}
