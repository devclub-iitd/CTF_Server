import logger from "./logger";
import dotenv from "dotenv";
import fs from "fs";

if (fs.existsSync(".env")) {
    logger.debug("Using .env file to supply config environment variables");
    dotenv.config({ path: ".env" });
} else {
    logger.warn("Please create a .env file for environment variables");
}
export const ENVIRONMENT = process.env.NODE_ENV;

export const MONGODB_URI: string = process.env["MONGODB_URI"] || "mongodb://localhost:27017/ctf";

export const JWT_SECRET: string = process.env["JWT_SECRET"] || "";

if (!MONGODB_URI) {
    logger.error("No mongo connection string. Set MONGODB_URI environment variable.");
    process.exit(1);
}
