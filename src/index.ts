import express from "express";
import cors from 'cors'
import { authRouter } from "./routers/auth.router";
import { postRouter } from "./routers/post.router";

import authMiddleware from "./middlewares/auth.middleware";

const app = express();

app.use(express.json());
app.use(cors())
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
  console.log(`🚀 Listening on port: localhost:${port} `);
});
