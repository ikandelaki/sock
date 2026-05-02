import bcrypt from "bcrypt";
import express, { Request, Response } from "express";
import User from "types/User";
import { prisma } from "lib/prisma";
import { TYPE_ERROR, TYPE_SUCCESS } from "types/Response";
import { generateToken } from "lib/auth";

const router = express.Router();
const saltRounds = 10;

router.post("/create", async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const { name, email, password } = User.parse(body);
    const userExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userExists) {
      return res.status(200).json({
        type: TYPE_ERROR,
        message: "User with such email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const data = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    generateToken;

    return res.status(200).json({
      type: TYPE_SUCCESS,
      message: "User created successfully",
      data,
    });
  } catch (err) {
    console.error(">> err caught:", err);
    return res.status(400).json({
      type: TYPE_ERROR,
      message: "Error while creating a user!",
    });
  }
});

export default router;
