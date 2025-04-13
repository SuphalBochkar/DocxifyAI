import express, { Request, Response } from "express";
import { router as recordsRouter } from "./records.routes";
import { router as docsRouter } from "./docs.routes";
import { router as testRouter } from "../other/test.routes";
import { router as opsRouter } from "./ops.routes";
import { HttpStatus } from "../lib/types";
import { router as chatRouter } from "./chat.routes";

export const router = express.Router();

/**
 * @route GET /api/v1/health
 * @description Health check endpoint
 */
router.get("/health", (req: Request, res: Response) => {
  res.status(HttpStatus.OK).json({
    status: "ok",
    message: "Server is healthy",
    time: new Date().toISOString(),
  });
});

/**
 * @route GET /api/v1/version
 * @description Get API version information
 */
router.get("/version", (req: Request, res: Response) => {
  res.status(HttpStatus.OK).json({
    version: "1.0.0",
    name: "Document AI Support API",
  });
});

/**
 * @route POST /api/v1/docs
 * @description Upload file to S3 and save metadata in Prisma
 */
router.use("/docs", docsRouter);

/**
 * @route GET /api/v1/records
 * @description Get all documents
 */
router.use("/records", recordsRouter);

/**
 * @route POST /api/v1/ops
 * @description ops routes for document validation and processing
 */
router.use("/ops", opsRouter);

/**
 * @route POST /api/v1/chat
 * @description chat routes for document chat
 */
router.use("/chat", chatRouter);

/**
 * @route GET /api/v1/test
 * @description Test routes
 */
router.use("/test", testRouter);
