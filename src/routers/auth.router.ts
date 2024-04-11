import e, { Router } from "express";
import { z } from "zod";
import { prisma } from "../../prisma/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
export const authRouter = Router();

authRouter.post("/signup", async (req, res) => {
  console.log(req.body);
  const userSchema = z.object({
    email: z.string().email({ message: "Please enter valid email" }),
    password: z.string(),
  });

  const parsed = userSchema.safeParse(req.body);
  console.log(parsed);
  if (parsed.success != true) {
    // console.log('parsed', parsed.error.errors[parsed.error.errors.length - 1].message)
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: parsed.error.errors[parsed.error.errors.length - 1].message,
    });
  } else {
    try {
      const hashedPassword = await bcrypt.hash(parsed.data.password, 10);
      const user = await prisma.user.create({
        data: { email: parsed.data.email, password: hashedPassword },
      });
      res
        .status(StatusCodes.CREATED)
        .json({ success: true, data: { message: "Sign Up Successful" } });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError)
        res
          .status(StatusCodes.CONFLICT)
          .json({ success: false, message: "email already exists" });
    }
  }
});

authRouter.post("/signin", async (req, res) => {
  const userSchema = z.object({
    email: z.string().email({ message: "Please enter valid email" }),
    password: z.string({ required_error: "Password is required" }),
  });

  const parsed = userSchema.safeParse(req.body);
  if (parsed.success) {
    try {
      // querying user
      const user = await prisma.user.findUnique({
        where: { email: parsed.data.email },
      });

      if (!user) {
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ success: false, message: "user doesnot exist" });
      } else {
        const isCorrectPassword = await bcrypt.compare(
          parsed.data.password,
          user.password,
        );
        if (!isCorrectPassword)
          return res.status(StatusCodes.UNAUTHORIZED).json({
            success: false,
            message: "incorrect password",
          });
        const token = jwt.sign(
          { id: user.id },
          process.env.JWT_SECRET as string,
          {
            expiresIn: "90d",
          },
        );

        res.status(StatusCodes.OK).json({ success: true, data: { token } });
      }
    } catch (error) {
      console.log(error);
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "something went wrong",
      });
    }
  } else {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: parsed.error.errors[parsed.error.errors.length - 1].message,
    });
  }
});
