import express, { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "..";
import { HttpStatus } from "../lib/types";
import { prisma } from "../lib/prisma";

export const router = express.Router();

router.post("/cookie", (req: Request, res: Response) => {
  try {
    const token = jwt.sign(
      {
        id: 1,
      },
      JWT_SECRET
    );
    res.cookie("token", token);
    res.send({ userId: 1 });
  } catch (error) {
    res
      .status(HttpStatus.UNAUTHORIZED)
      .send({ message: "Invalid or expired token" });
    return;
  }
});

router.get("/cookie", (req: Request, res: Response) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(HttpStatus.UNAUTHORIZED).send({ message: "Token is required" });
    return;
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    res.send({ userId: decoded.id });
  } catch (error) {
    res
      .status(HttpStatus.UNAUTHORIZED)
      .send({ message: "Invalid or expired token" });
    return;
  }
});

router.post("/procedure", async (req: Request, res: Response) => {
  const document = await prisma.document.create({
    data: {
      fileName: "test.pdf",
      fileType: "application/pdf",
      fileSize: 1000,
      url: "https://www.google.com",
      IP: "127.0.0.1",
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "PENDING",
    },
  });

  await new Promise((resolve) => setTimeout(resolve, 2000));

  await prisma.document.update({
    where: { id: document.id },
    data: { status: "EXTRACTING" },
  });

  await new Promise((resolve) => setTimeout(resolve, 2000));

  await prisma.document.update({
    where: { id: document.id },
    data: { status: "EXTRACTED" },
  });

  await new Promise((resolve) => setTimeout(resolve, 2000));

  await prisma.document.update({
    where: { id: document.id },
    data: { status: "PROCESSING" },
  });

  await new Promise((resolve) => setTimeout(resolve, 2000));

  await prisma.document.update({
    where: { id: document.id },
    data: { status: "PROCESSED" },
  });

  res.send({ message: "Document created", documentId: document.id });
});

router.get("/status/:documentId", async (req: Request, res: Response) => {
  const { documentId } = req.params;
  const document = await prisma.document.findUnique({
    where: { id: documentId },
  });
  res.send({ message: "Document status", document });
});
