import bcrypt from "bcrypt";
import express, { Request, Response } from "express";
import User from "types/User";
import { prisma } from "lib/prisma";

const router = express.Router();
const saltRounds = 10;

router.post("/create", async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const { name, email, password } = User.parse(body);

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const data = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return res.status(200).json({
      status: 200,
      message: "User created successfully",
      data,
    });
  } catch (err) {
    console.error(">> err caught:", err);
    return res.status(400).json({
      status: 400,
      message: "Error while creating a user!",
    });
  }
});

export default router;
