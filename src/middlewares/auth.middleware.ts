import { NextFunction, Request, Response } from "express";
import { JwtPayload, verify } from "jsonwebtoken";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    let token = req.headers.authorization;
    if (token) {
      token = token.split(" ")[1];
      let user = verify(token, process.env.JWT_SECRET as string) as JwtPayload;
      req.id = user;
      next();
    } else {
      return res
        .status(401)
        .json({ error: false, message: "User is not authorized" });
    }
  } catch (error) {
    res.status(401).json({ error: false, message: "User is not authorized" });
  }
};
export default authMiddleware;
