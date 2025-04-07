import express, { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { multerS3Upload } from "../lib/bucket";
import { HttpStatus } from "../lib/types";
import { uploadLimiter } from "../lib/limiter";
import { extractTextFromS3 } from "../lib/textract";
import { extractDocumentData } from "../lib/OpenAPI";

export const router = express.Router();

/**
 * @route POST /api/v1/docs
 * @description Upload file to S3 and save metadata in Prisma
 */
// router.post(
//   "/",
//   uploadLimiter,
//   multerS3Upload.single("file"),
//   async (req: Request, res: Response) => {
//     try {
//       if (!req.file) {
//         console.warn("No file uploaded");
//         res.status(HttpStatus.BAD_REQUEST).json({ error: "No file uploaded" });
//         return;
//       }

//       const ip = req.ip || req.socket.remoteAddress || "Unknown";
//       const file = req.file as Express.MulterS3.File;

//       // Extract text from the document using AWS Textract
//       const extractedText = await extractTextFromS3(
//         process.env.AWS_BUCKET_NAME!,
//         file.key
//       );

//       // Extract structured data using OpenAI with both text and document URL
//       const extractedData = await extractDocumentData(
//         extractedText,
//         file.location
//       );

//       // Create document record with both raw text and structured data
//       const document = await prisma.document.create({
//         data: {
//           fileName: file.key,
//           fileType: file.mimetype,
//           fileSize: file.size,
//           url: file.location,
//           content: extractedText,
//           extractedData: extractedData,
//           IP: ip,
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         },
//       });

//       res.status(HttpStatus.CREATED).json({
//         message: "File uploaded and processed successfully",
//         document,
//       });
//     } catch (error) {
//       console.error("Upload Error:", error);
//       res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
//         error: "Failed to upload file",
//         details: (error as Error).message,
//       });
//     }
//   }
// );

/**
 * @route POST /api/v1/docs
 * @description Upload file to S3 and save metadata in Prisma
 */

router.post(
  "/upload",
  uploadLimiter,
  multerS3Upload.single("file"),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        res.status(HttpStatus.BAD_REQUEST).json({ error: "No file uploaded" });
        return;
      }

      const ip = req.ip || req.socket.remoteAddress || "Unknown";
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
          status: "PENDING",
        },
      });

      res.status(HttpStatus.CREATED).json({
        message: "File uploaded successfully",
        documentId: document.id,
        url: file.location,
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

/**
 * @route POST /api/v1/docs/extract/:documentId
 * @description Extract text from S3 and update document in Prisma
 */

router.post("/extract/:documentId", async (req: Request, res: Response) => {
  const { documentId } = req.params;

  try {
    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      res.status(HttpStatus.NOT_FOUND).json({ error: "Document not found" });
      return;
    }

    await prisma.document.update({
      where: { id: documentId },
      data: { status: "EXTRACTING" },
    });

    const extractedText = await extractTextFromS3(
      process.env.AWS_BUCKET_NAME!,
      document.fileName
    );

    await prisma.document.update({
      where: { id: documentId },
      data: {
        content: extractedText,
        status: "EXTRACTED",
      },
    });

    res.status(HttpStatus.OK).json({
      message: "Text extracted successfully",
      extractedText,
    });
  } catch (error) {
    await prisma.document.update({
      where: { id: documentId },
      data: { status: "FAILED" },
    });

    console.error("Error extracting text:", error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: "Failed to extract text",
      details: (error as Error).message,
    });
  }
});

/**
 * @route POST /api/v1/docs/process/:documentId
 * @description Process document with OpenAI and update document in Prisma
 */

router.post("/process/:documentId", async (req: Request, res: Response) => {
  const { documentId } = req.params;

  try {
    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document || !document.content) {
      res
        .status(HttpStatus.NOT_FOUND)
        .json({ error: "Document or text not found" });
      return;
    }

    await prisma.document.update({
      where: { id: documentId },
      data: { status: "PROCESSING" },
    });

    const processedData = await extractDocumentData(
      document.content,
      document.url || ""
    );

    await prisma.document.update({
      where: { id: documentId },
      data: {
        extractedData: processedData,
        status: "PROCESSED",
      },
    });

    res.status(HttpStatus.OK).json({
      message: "Document processed successfully",
      processedData,
    });
  } catch (error) {
    await prisma.document.update({
      where: { id: documentId },
      data: { status: "FAILED" },
    });

    console.error("Error processing document:", error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: "Failed to process document",
      details: (error as Error).message,
    });
  }
});

/**
 * @route GET /api/v1/docs/status/:documentId
 * @description Get document status by ID
 */

router.get("/status/:documentId", async (req: Request, res: Response) => {
  const { documentId } = req.params;

  try {
    const document = await prisma.document.findUnique({
      where: { id: documentId },
      select: { status: true },
    });

    if (!document) {
      res.status(HttpStatus.NOT_FOUND).json({ error: "Document not found" });
      return;
    }

    res.status(HttpStatus.OK).json({ status: document.status });
  } catch (error) {
    console.error("Error fetching document status:", error);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: "Failed to fetch document status",
      details: (error as Error).message,
    });
  }
});

/**
 * @route GET /api/v1/docs/usage
 * @description Get upload usage statistics
 */

router.get("/usage", async (req: Request, res: Response) => {
  const ip = req.ip || req.socket.remoteAddress || "Unknown";
  const uploadCount = await prisma.document.count({ where: { IP: ip } });

  res.status(HttpStatus.OK).json({
    uploadsUsed: uploadCount,
    uploadsRemaining: Math.max(0, 3 - uploadCount),
  });
});
