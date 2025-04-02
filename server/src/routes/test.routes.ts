import express, { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "..";
import { HttpStatus } from "../lib/types";

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
