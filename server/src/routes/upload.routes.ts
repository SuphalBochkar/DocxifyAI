import express, { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { multerS3Upload } from "../lib/bucket";
import { HttpStatus } from "../lib/types";

export const router = express.Router();

/**
 * @route POST /api/v1/upload
 * @description Upload file to S3 and save metadata in Prisma
 */

router.post(
  "/",
  multerS3Upload.single("file"),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        console.warn("No file uploaded");
        res.status(HttpStatus.BAD_REQUEST).json({ error: "No file uploaded" });
        return;
      }

      const ip =
        req.ip ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        "Unknown";

      const file = req.file as Express.MulterS3.File;
      const document = await prisma.document.create({
        data: {
          fileName: file.key,
          fileType: file.mimetype,
          fileSize: file.size,
          url: file.location,
          IP: ip,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      res.status(HttpStatus.CREATED).json({
        message: "File uploaded successfully",
        document,
      });
    } catch (error) {
      console.error("Upload Error:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: "Failed to upload file",
        details: (error as Error).message,
      });
    }
  }
);
