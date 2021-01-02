import express from "express";
import compression from "compression";
import bodyParser from "body-parser";
import lusca from "lusca";
import logger from "./util/logger";
import dotenv from "dotenv";
import fs from "fs";
import * as apiController from "./controllers/api";

// Create Express server
const app = express();

// Express configuration
app.set("port", process.env.PORT || 3000);

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));

// Environment config
if (fs.existsSync(".env")) {
    logger.debug("Using .env file to supply config environment variables");
    dotenv.config({ path: ".env" });
} else {
    logger.debug("Using .env.example file to supply config environment variables");
    dotenv.config({ path: ".env.example" });  // you can delete this after you create your own .env file!
}

/**
 * API examples routes.
 */
app.get("/api/execute-stream", apiController.executeStream);

export default app;
