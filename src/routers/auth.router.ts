import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../prisma/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import httpscode from "http-status-codes";
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
        res.json({
            data: {
                success: false,
                message: parsed.error.errors[parsed.error.errors.length - 1].message,
            },
        });
    } else {
        try {
            const hashedPassword = await bcrypt.hash(parsed.data.password, 10);
            const user = await prisma.user.create({
                data: { email: parsed.data.email, password: hashedPassword },
            });
            res.json({ success: true, data: { message: "Sign Up Successful" } });
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError)
                res.json({ success: false, data: { message: "email already exists" } });
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
                    .status(400)
                    .json({ success: false, data: { message: "user doesnot exist" } });
            } else {
                const isCorrectPassword = await bcrypt.compare(
                    parsed.data.password,
                    user.password,
                );
                if (!isCorrectPassword)
                    return res.json({
                        success: false,
                        data: {
                            message: "incorrect password",
                        },
                    });
                const token = jwt.sign(user.id, process.env.JWT_SECRET as string);

                res.status(200).json({ success: true, data: { token } });
            }
        } catch (error) {
            res.json({
                success: false,
                data: {
                    message: "something went wrong",
                },
            });
        }
    } else {
        res.json({
            success: false,
            data: {
                message: parsed.error.errors[parsed.error.errors.length - 1].message,
            },
        });
    }
});
