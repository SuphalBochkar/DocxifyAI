// server/src/lib/queue.ts

import Bull from "bull";
import { documentExtractionHandler } from "../handlers/extract.handler";
import { documentProcessingHandler } from "../handlers/process.handler";
import { prisma } from "./prisma";

// Create queues for different processing stages
const extractionQueue = new Bull("document-extraction", {
  redis: process.env.REDIS_URL || "redis://localhost:6379",
  limiter: {
    max: 5, // Process max 5 documents at a time
    duration: 1000,
  },
});

const processingQueue = new Bull("document-processing", {
  redis: process.env.REDIS_URL || "redis://localhost:6379",
  limiter: {
    max: 3, // Process max 3 documents at a time
    duration: 1000,
  },
});

// Handle extraction jobs
extractionQueue.process(async (job) => {
  const { documentId } = job.data;

  try {
    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      throw new Error(`Document ${documentId} not found`);
    }

    const extractedText = await documentExtractionHandler({ document });

    // Add to processing queue
    await processingQueue.add({ documentId, extractedText });

    return { success: true, documentId };
  } catch (error) {
    console.error(`Extraction failed for document ${documentId}:`, error);

    // Update document status
    await prisma.document.update({
      where: { id: documentId },
      data: { status: "FAILED" },
    });

    throw error; // Rethrow to trigger Bull's retry mechanism
  }
});

// Handle processing jobs
processingQueue.process(async (job) => {
  const { documentId, extractedText } = job.data;

  try {
    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      throw new Error(`Document ${documentId} not found`);
    }

    const processedData = await documentProcessingHandler({
      document,
      extractedText,
      isVerification: true,
    });

    return { success: true, documentId, processedData };
  } catch (error) {
    console.error(`Processing failed for document ${documentId}:`, error);

    // Update document status
    await prisma.document.update({
      where: { id: documentId },
      data: { status: "FAILED" },
    });

    throw error; // Rethrow to trigger Bull's retry mechanism
  }
});

// Export queue functions
export const addToExtractionQueue = async (documentId: string) => {
  return await extractionQueue.add(
    { documentId },
    {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 2000,
      },
    }
  );
};

export const getJobStatus = async (jobId: string) => {
  const job = await extractionQueue.getJob(jobId);
  if (!job) return null;

  return {
    id: job.id,
    status: await job.getState(),
    progress: job.progress(),
    result: job.returnvalue,
    failedReason: job.failedReason,
  };
};
