import { Request, Response } from "express";
import { TYPE_ERROR } from "types/Response";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "lib/prisma";

export const authenticate = async (req: Request, res: Response, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader?.startsWith("Bearer")) {
      res.status(401).json({
        type: TYPE_ERROR,
        message: "No token provided",
      });
    }

    const token = authHeader!.split(" ")[1]!;
    const decoded: JwtPayload = jwt.verify(
      token,
      process.env["JWT_ACCESS_SECRET"]!,
    );

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res
        .status(401)
        .json({ type: TYPE_ERROR, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }

    console.log(">> auth error", err);
    res.status(500).json({
      type: TYPE_ERROR,
      message: "Internal server error",
    });
  }
};
