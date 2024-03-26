import { Router } from "express";
import { CompleteArticle, articleSchema } from "../../prisma/zod";

import { Prisma } from "./../../node_modules/.prisma/client/index";
import { prisma } from "../../prisma/prisma";
import { log } from "console";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
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
    
    if(error instanceof PrismaClientValidationError){

        res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: error.message });
    }
}
});
