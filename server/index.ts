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

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`>> [${req.method}] ${req.path}`);
  next();
});

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

app.use("/user", UserRouter);
console.log(">> User routes mounted");

app.listen(port, () => {
  console.log(`>> Listening on port ${port}`);
});
