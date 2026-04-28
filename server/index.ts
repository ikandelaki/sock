import "dotenv/config";
import express, { type Request, type Response } from "express";
import cors from "cors";
import { DEVELOPMENT_MODE } from "./config.ts";

const app = express();
const port = process.env["PORT"];
const mode = process.env["MODE"];

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

app.listen(port, () => {
  console.log(`>> Listening on port ${port}`);
});
