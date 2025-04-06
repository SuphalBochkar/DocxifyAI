import {
  TextractClient,
  AnalyzeDocumentCommand,
  FeatureType,
} from "@aws-sdk/client-textract";

const textractClient = new TextractClient({ region: process.env.AWS_REGION });

export async function extractTextFromS3(s3Bucket: string, s3Key: string) {
  const params = {
    Document: { S3Object: { Bucket: s3Bucket, Name: s3Key } },
    FeatureTypes: [FeatureType.TABLES, FeatureType.FORMS],
  };
  const command = new AnalyzeDocumentCommand(params);
  const response = await textractClient.send(command);
  return response.Blocks?.map((block) => block.Text).join(" ") || "";
}
