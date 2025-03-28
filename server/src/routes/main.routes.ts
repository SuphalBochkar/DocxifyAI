import express, { Request, Response } from "express";
import { documentRouter } from "./document.routes";

export const router = express.Router();

/**
 * @route GET /api/v1/health
 * @description Health check endpoint
 * @access Public
 */
router.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    message: "Server is healthy",
    time: new Date().toISOString(),
  });
});

/**
 * @route GET /api/v1/version
 * @description Get API version information
 * @access Public
 */
router.get("/version", (req: Request, res: Response) => {
  res.status(200).json({
    version: "1.0.0",
    name: "Document AI Support API",
  });
});

/**
 * @route GET /api/v1/documents
 * @description Get all documents
 * @access Public
 */
router.use("/documents", documentRouter);
