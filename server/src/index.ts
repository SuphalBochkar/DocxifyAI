import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { HttpStatus } from "./lib/types";
import { router as mainRouter } from "./routes/main.routes";

export const app = express();
export const JWT_SECRET = process.env.JWT_SECRET as string;

dotenv.config();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);
app.set("trust proxy", true);

app.use("/api/v1", mainRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running");
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err);
  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    error: "Something went wrong",
    message: err.message,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server at http://localhost:${PORT}`));
