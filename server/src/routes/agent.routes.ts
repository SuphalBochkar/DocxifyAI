import express, { Request, Response } from "express";

export const router = express.Router();

/**
 * @route POST /api/v1/agent/validate
 * @description Process document with OpenAI and update document in Prisma
 */

