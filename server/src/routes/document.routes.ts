import express, { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { HttpStatus } from "../lib/types";

export const router = express.Router();

/**
 * @route GET /api/v1/documents
 * @description Get all documents uploaded from the user's IP address
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const ip =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress || "Unknown";

    const documents = await prisma.document.findMany({
      where: { IP: ip.toString() },
      orderBy: { createdAt: "desc" },
    });

    res.status(HttpStatus.OK).json({ data: documents });
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: "Failed to fetch documents",
      details: (error as Error).message,
    });
  }
});
