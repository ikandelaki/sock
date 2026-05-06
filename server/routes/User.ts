import bcrypt from "bcrypt";
import express, { Request, Response } from "express";
import User, { UserLogin } from "types/User";
import { prisma } from "lib/prisma";
import { TYPE_ERROR, TYPE_SUCCESS } from "types/Response";
import { generateAccessToken } from "lib/auth";

const router = express.Router();
const saltRounds = 10;

router.post("/register", async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const { name, email, password } = User.parse(body);
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

    return res.status(200).json({
      type: TYPE_SUCCESS,
      message: "User created successfully",
      accessToken,
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

    return res.status(200).json({
      type: TYPE_SUCCESS,
      message: "Logged in successfully!",
      accessToken,
    });
  } catch (e) {
    console.log(">> login error", e);
    return res.status(500).json({
      type: TYPE_ERROR,
      message: "Internal server error",
    });
  }
});

export default router;
