import {
  TextractClient,
  AnalyzeDocumentCommand,
  FeatureType,
} from "@aws-sdk/client-textract";
import { GetObjectOutput } from "aws-sdk/clients/s3";
import pdfParse from "pdf-parse";
import Tesseract from "tesseract.js";
import AWS from "aws-sdk";

const textractClient = new TextractClient({ region: process.env.AWS_REGION });
const s3 = new AWS.S3();

interface S3Type {
  s3Bucket: string;
  s3Key: string;
}

async function extractTextFromS3({ s3Bucket, s3Key }: S3Type): Promise<string> {
  const params = {
    Document: { S3Object: { Bucket: s3Bucket, Name: s3Key } },
    FeatureTypes: [FeatureType.TABLES, FeatureType.FORMS],
  };

  try {
    const command = new AnalyzeDocumentCommand(params);
    const response = await textractClient.send(command);
    return response.Blocks?.map((block) => block.Text).join(" ") || "";
  } catch (textractError) {
    console.error(
      "Textract failed, moving to fallback methods:",
      textractError
    );

    return await extractTextFallback({ s3Bucket, s3Key });
  }
}

async function extractTextFallback({
  s3Bucket,
  s3Key,
}: S3Type): Promise<string> {
  let fileBuffer: Buffer | undefined;

  try {
    const file: GetObjectOutput = await s3
      .getObject({ Bucket: s3Bucket, Key: s3Key })
      .promise();

    if (file.Body instanceof Buffer) {
      fileBuffer = file.Body;
    } else {
      throw new Error("File Body is not a Buffer");
    }

    const pdfData = await pdfParse(fileBuffer);
    if (pdfData.text) {
      console.log("Extracted text from PDF");
      return pdfData.text;
    } else {
      throw new Error("PDF parsing failed");
    }
  } catch (pdfError) {
    console.error("PDF parse failed, falling back to OCR:", pdfError);
    if (fileBuffer) {
      return await extractTextWithOCR(fileBuffer);
    } else {
      throw new Error("No valid file buffer available for OCR.");
    }
  }
}

async function extractTextWithOCR(fileBuffer: Buffer): Promise<string> {
  try {
    const imageText = await Tesseract.recognize(fileBuffer, "eng", {
      logger: (m) => console.log(m),
    });
    console.log("Extracted text using OCR");
    return imageText.data.text;
  } catch (ocrError) {
    console.error("OCR failed:", ocrError);
    throw new Error("All extraction methods failed");
  }
}

export async function extractTextFromS3WithFallback(
  s3Bucket: string,
  s3Key: string
): Promise<string> {
  return await extractTextFromS3({ s3Bucket, s3Key });
}
