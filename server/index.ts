import "dotenv/config";
import express, { type Request, type Response } from "express";
import cors from "cors";
import { DEVELOPMENT_MODE } from "./config.ts";
import User from "types/User";
import { prisma } from "lib/prisma.ts";

const app = express();
const port = process.env["PORT"];
const mode = process.env["MODE"];

// Accept json data
app.use(express.json());

// Allow all origins (for development)
if (mode === DEVELOPMENT_MODE.development) {
  app.use(cors());
}

app.get("/", async (req: Request, res: Response) => {
  await res.json({
    status: 200,
    message: "Hello world",
  });
});

app.post("/user", async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const { name, email, password } = User.parse(body);

    const data = await prisma.user.create({
      data: {
        name,
        email,
        password,
      },
    });

    return res.json({
      status: 200,
      message: "User created successfully",
      data,
    });
  } catch (err) {
    console.error(">> err", err);
    return res.json({
      status: 400,
      message: "Error while creating a user",
    });
  }
});

app.listen(port, () => {
  console.log(`>> Listening on port ${port}`);
});
