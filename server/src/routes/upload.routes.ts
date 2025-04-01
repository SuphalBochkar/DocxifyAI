import express, { Request, Response } from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import { prisma } from "../lib/prisma";

export const router = express.Router();

// AWS S3 Configuration
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

// Multer Storage with S3
// const upload = multer({
//   storage: multerS3({
//     s3,
//     bucket: process.env.AWS_BUCKET_NAME as string,
//     metadata: (req, file, cb) => {
//       cb(null, { fieldName: file.fieldname });
//     },
//     key: (req, file, cb) => {
//       cb(null, `${Date.now()}-${file.originalname}`);
//     },
//   }),
// });

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME as string,
    // acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
    contentDisposition: "inline",
  }),
});

/**
 * @route POST /api/v1/upload
 * @description Upload file to S3 and save metadata in Prisma
 */

router.post("/", upload.single("file"), async (req: Request, res: Response) => {
  try {
    console.log("Incoming file upload request");

    if (!req.file) {
      console.warn("No file uploaded");
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    const file = req.file as Express.MulterS3.File;

    console.log("File received:", file.originalname);
    console.log("File size:", file.size);

    // Save metadata to Prisma
    const document = await prisma.document.create({
      data: {
        fileName: file.key,
        originalName: file.originalname,
        mimeType: file.mimetype,
        fileSize: file.size,
        storageUrl: file.location,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    console.log("Document metadata saved:", document.id);

    res.status(201).json({
      message: "File uploaded successfully",
      document,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({
      error: "Failed to upload file",
      details: (error as Error).message,
    });
  }
});
