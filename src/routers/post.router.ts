import { Router } from "express";
import { Prisma } from "./../../node_modules/.prisma/client/index";
import { prisma } from "../../prisma/prisma";
import { StatusCodes } from "http-status-codes";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";
export const postRouter = Router();

postRouter.post("/", async (req, res) => {
  // TODO: Implement article creation
  const { content, name, description } = req.body as Prisma.ArticleCreateInput;
  try {
    const newArticle = await prisma.article.create({
      data: { content, description, name },
    });
    res.status(StatusCodes.CREATED).json({ success: true, data: newArticle });
  } catch (error) {
    if (error instanceof PrismaClientValidationError) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error.message });
    }
  }
});

postRouter.delete("/:id", async (req, res) => {
  const articleId = req.params.id;

  const article = await prisma.article.findFirst({ where: { id: articleId } });
  if (!article) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ success: false, message: "article not found" });
  }

  await prisma.article.delete({ where: { id: req.params.id } });
  res.status(StatusCodes.OK).json({ success: true, data: article });
});
