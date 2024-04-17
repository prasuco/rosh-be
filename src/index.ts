import express, { ErrorRequestHandler } from "express";
import cors from "cors";
import { authRouter } from "./routers/auth.router";
import { postRouter } from "./routers/post.router";

import authMiddleware from "./middlewares/auth.middleware";
import { StatusCodes } from "http-status-codes";

const app = express();

app.use(express.json());

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err.stack);
  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ success: false, message: "Something Broke" });
};

app.use(globalErrorHandler);

app.use(cors());
const port = process.env.PORT || 3333;

app.get("/", (res, req) => {
  req.send("rosh-backend\n");
});
// using auth middleware on functional parts
app.use("/api/main/", authMiddleware);

// API Routes
app.use("/api/auth/", authRouter);
app.use("/api/main/posts/", postRouter);

app.listen(port, () => {
  console.log(`🚀 Listening on port: https://localhost:${port} `);
});
