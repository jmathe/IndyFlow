// src/utils/logger.ts

/**
 * Defines available log levels ordered by verbosity.
 * @enum {number}
 */
export enum LogLevel {
  /** Detailed debug messages */
  DEBUG = 0,
  /** General operational information */
  INFO = 1,
  /** Lightweight warnings indicating unexpected behavior */
  WARN = 2,
  /** Critical errors requiring immediate attention */
  ERROR = 3,
}

/**
 * Initializes log level based on environment variables:
 * - In production, only INFO, WARN and ERROR are shown
 * - In development, DEBUG can be enabled via DEBUG=true
 * - Otherwise, only WARN and ERROR are shown
 */
const envLevel: LogLevel =
  process.env.NODE_ENV === "production"
    ? LogLevel.INFO
    : process.env.DEBUG === "true"
    ? LogLevel.DEBUG
    : LogLevel.WARN;

/**
 * Singleton logger with methods for each log level.
 * The current level filters which messages are output.
 */
class Logger {
  /** Current verbosity level */
  private level: LogLevel = envLevel;

  /**
   * Dynamically change the log level.
   * @param {LogLevel} level The new log level to apply
   */
  setLevel(level: LogLevel): void {
    this.level = level;
  }

  /**
   * Log a message at DEBUG level.
   * Executes only if current level <= DEBUG.
   * @param {...any} args Data to log
   */
  debug(...args: any[]): void {
    if (this.level <= LogLevel.DEBUG) {
      console.debug("[DEBUG]", ...args);
    }
  }

  /**
   * Log a message at INFO level.
   * Executes only if current level <= INFO.
   * @param {...any} args Data to log
   */
  info(...args: any[]): void {
    if (this.level <= LogLevel.INFO) {
      console.info("[INFO]", ...args);
    }
  }

  /**
   * Log a message at WARN level.
   * Executes only if current level <= WARN.
   * @param {...any} args Data to log
   */
  warn(...args: any[]): void {
    if (this.level <= LogLevel.WARN) {
      console.warn("[WARN]", ...args);
    }
  }

  /**
   * Log a message at ERROR level.
   * Executes only if current level <= ERROR.
   * @param {...any} args Data to log
   */
  error(...args: any[]): void {
    if (this.level <= LogLevel.ERROR) {
      console.error("[ERROR]", ...args);
    }
  }
}

// Export the singleton for global use in the application
export default new Logger();
