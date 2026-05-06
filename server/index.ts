import "dotenv/config";
import express, { type Request, type Response } from "express";
import cors from "cors";
import { DEVELOPMENT_MODE } from "./config.ts";
import UserRouter from "routes/User";

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
    message: "Hello world!",
  });
});

app.use("/api/user", UserRouter);

app.listen(port, () => {
  console.log(`>> Listening on port ${port}`);
});
