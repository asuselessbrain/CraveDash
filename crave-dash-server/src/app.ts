import express, { Application, Request, Response } from "express";
import cors from "cors";
import router from "./utils/routes/routes";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./errors/globalErrorHandler";

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Set-Cookie"],
  }),
);
app.use(cookieParser());

app.use("/api/v1", router);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to CraveDash API",
    developedBy: "Arfan Ahmed",
  });
});

app.use(globalErrorHandler);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;
