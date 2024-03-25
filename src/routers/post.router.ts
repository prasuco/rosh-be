import { Router } from "express";
import { articleSchema } from "../../prisma/zod";

export const postRouter = Router();

postRouter.post("/", (req, res) => {
  res.json({ success: true, id: req.id });
});
