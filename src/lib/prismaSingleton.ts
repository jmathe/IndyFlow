// src/lib/prismaSingleton.ts

import { Prisma, PrismaClient } from "@/generated/prisma";
import logger from "@/lib/logger";

/**
 * Ensures a single global PrismaClient instance across the application.
 * Configures event-based logging for SQL queries and errors.
 */
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

// To know if we are in production or not
const isProduction: boolean = process.env.NODE_ENV === "production";

// If no PrismaClient instance exists yet in global state
if (!globalForPrisma.prisma) {
  logger.debug("Initializing new PrismaClient instance");

  // Instantiate PrismaClient with event-based logging config
  const client = new PrismaClient({
    log: isProduction
      ? [{ level: "error", emit: "event" }]
      : [
          { level: "query", emit: "event" },
          { level: "error", emit: "event" },
        ],
  });

  // Log all SQL queries (type-safe via Prisma.QueryEvent)
  client.$on("query", (e: Prisma.QueryEvent) => {
    logger.debug(
      `Prisma query: ${e.query} | params: ${JSON.stringify(
        e.params
      )} | duration: ${e.duration}ms`
    );
  });

  // Log error events (type-safe via Prisma.LogEvent)
  client.$on("error", (e: Prisma.LogEvent) => {
    logger.error(`Prisma error: ${e.message} | target: ${e.target}`);
  });

  globalForPrisma.prisma = client;
} else {
  logger.debug("Reusing existing PrismaClient instance");
}

export const prisma: PrismaClient = globalForPrisma.prisma!;
