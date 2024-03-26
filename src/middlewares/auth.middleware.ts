import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { JwtPayload, verify } from "jsonwebtoken";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    let token = req.headers.authorization;
    if (token) {
      token = token.split(" ")[1];
      let user = verify(token, process.env.JWT_SECRET as string) as JwtPayload;
      req.id = user.id;
      next();
    } else {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: false, message: "User is not authorized" });
    }
  } catch (error) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: false, message: "User is not authorized" });
  }
};
export default authMiddleware;
