import bcrypt from "bcrypt";
import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserRegister, UserLogin } from "types/User";
import { prisma } from "lib/prisma";
import { TYPE_ERROR, TYPE_SUCCESS } from "types/Response";
import {
  generateAccessToken,
  generateRefreshToken,
  revokeRefreshToken,
  saveRefreshToken,
} from "lib/auth";
import { authenticate } from "middleware/auth";

const router = express.Router();
const saltRounds = 10;

router.post("/register", async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const { name, email, password } = UserRegister.parse(body);
    const userExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userExists) {
      return res.status(409).json({
        type: TYPE_ERROR,
        message: "User with such email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    await saveRefreshToken(user.id, refreshToken);

    return res.status(200).json({
      type: TYPE_SUCCESS,
      message: "User created successfully",
      accessToken,
      refreshToken,
      user,
    });
  } catch (err) {
    console.error(">> err caught:", err);
    return res.status(400).json({
      type: TYPE_ERROR,
      message: "Error while creating a user!",
    });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const { email, password } = await UserLogin.parse(body);

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res
        .status(401)
        .json({ type: TYPE_ERROR, message: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res
        .status(401)
        .json({ type: TYPE_ERROR, message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    await saveRefreshToken(user.id, refreshToken);

    return res.status(200).json({
      type: TYPE_SUCCESS,
      message: "Logged in successfully!",
      accessToken,
      refreshToken,
      user,
    });
  } catch (e) {
    console.log(">> login error", e);
    return res.status(500).json({
      type: TYPE_ERROR,
      message: "Internal server error",
    });
  }
});

router.post("/logout", authenticate, async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await revokeRefreshToken(refreshToken);
    }

    res.status(200).json({
      type: TYPE_SUCCESS,
      message: "Logged out successfully",
    });
  } catch (e) {
    console.log(">> logout error", e);
    res.status(500).json({
      type: TYPE_ERROR,
      message: "Internal server error",
    });
  }
});

router.post("/refresh", async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res
        .status(401)
        .json({ type: TYPE_ERROR, message: "Refresh token required" });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env["JWT_REFRESH_SECRET"]!);
    } catch (err) {
      return res
        .status(401)
        .json({ type: TYPE_ERROR, message: "Invalid refresh token" });
    }

    // Check if refresh token exists in DB
    const storedToken = await prisma.refreshToken.findFirst({
      where: {
        token: refreshToken,
        userId: (decoded as any).userId,
      },
    });

    if (!storedToken) {
      return res
        .status(401)
        .json({ type: TYPE_ERROR, message: "Refresh token revoked" });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken((decoded as any).userId);

    return res.status(200).json({
      type: TYPE_SUCCESS,
      message: "Token refreshed successfully",
      accessToken: newAccessToken,
    });
  } catch (e) {
    console.log(">> refresh error", e);
    return res.status(500).json({
      type: TYPE_ERROR,
      message: "Internal server error",
    });
  }
});

router.get("/me", authenticate, (req, res) => res.json({ user: req.user }));

export default router;
