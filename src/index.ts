import express from "express";
import { PORT } from "./secrets";
import rootRouter from "./Routes";
import { PrismaClient } from "@prisma/client";
import { errorMiddleware } from "./Controllers/middlewares/errors";

const app = express();

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.use(express.json());

app.use("/api", rootRouter);

export const prismaClient = new PrismaClient({
  log: ["query"],
});

app.use(errorMiddleware); 

export default app;

// app.listen(PORT, () => {console.log('App working!')})
