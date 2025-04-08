import express, { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { HttpStatus } from "../lib/types";

export const router = express.Router();

/**
 * @route GET /api/v1/records
 * @description Get all documents uploaded from the user's IP address
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const ip =
      req.headers["x-forwarded-for"] || req.socket.remoteAddress || "Unknown";

    const documents = await prisma.document.findMany({
      where: { IP: ip.toString() },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        fileName: true,
        fileType: true,
        fileSize: true,
        status: true,
        createdAt: true,
        url: true,
      },
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

/**
 * @route GET /api/v1/records/:id
 * @description Get document details by ID
 */
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const document = await prisma.document.findUnique({
      where: { id },
      select: {
        id: true,
        fileName: true,
        fileType: true,
        fileSize: true,
        url: true,
        content: true,
        extractedData: true,
        status: true,
        createdAt: true,
      },
    });

    if (!document) {
      res.status(HttpStatus.NOT_FOUND).json({ error: "Document not found" });
      return;
    }

    res.status(HttpStatus.OK).json({ data: document });
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: "Failed to fetch document details",
      details: (error as Error).message,
    });
  }
});

/**
 * @route DELETE /api/v1/records/:id
 * @description Delete a document by ID
 */
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const ip = req.ip || req.socket.remoteAddress || "Unknown";

    // Ensure the document belongs to the requester's IP
    const document = await prisma.document.findUnique({ where: { id } });
    if (!document || document.IP !== ip) {
      res.status(HttpStatus.UNAUTHORIZED).json({ error: "Unauthorized" });
      return;
    }

    await prisma.document.delete({ where: { id } });
    res
      .status(HttpStatus.OK)
      .json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res
      .status(HttpStatus.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to delete document" });
  }
});
