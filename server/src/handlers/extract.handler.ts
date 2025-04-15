import { prisma } from "../lib/prisma";
import { extractTextFromS3WithFallback } from "../lib/textract";
import { Document as PrismaDocument } from "@prisma/client";

export async function documentExtractionHandler({
  document,
}: {
  document: PrismaDocument;
}) {
  const { id, fileName } = document;

  await prisma.document.update({
    where: { id },
    data: { status: "EXTRACTING" },
  });

  const extractedText = await extractTextFromS3WithFallback(
    process.env.AWS_BUCKET_NAME!,
    fileName
  );

  await prisma.document.update({
    where: { id },
    data: {
      status: "EXTRACTED",
      content: extractedText,
    },
  });

  return extractedText;
}
