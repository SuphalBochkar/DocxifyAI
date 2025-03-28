import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { router as mainRouter } from "./routes/main.routes";

export const app = express();

dotenv.config();
app.use(express.json());
app.use(cors());

app.use("/api/v1", mainRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running");
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err);
  res.status(500).json({
    error: "Something went wrong",
    message: err.message,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server at http://localhost:${PORT}`));
