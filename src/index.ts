import express from "express";
import { PORT } from "./secrets";
import rootRouter from "./Routes";
import { PrismaClient } from "@prisma/client";
import { errorMiddleware } from "./Controllers/middlewares/errors";
import { SignUpSchema } from "./schema/user";

const app = express();

app.get("/ping", (req, res) => {
  res.send("pong");
});

app.use(express.json());

app.use("/api", rootRouter);

export const prismaClient = new PrismaClient({
  log: ["query"],
}).$extends({
  query: {
    user: {
      create({args, query}) {
        args.data = SignUpSchema.parse(args.data)
        return query(args)
      }
    }
  }
})

app.use(errorMiddleware); 

export default app;

// app.listen(PORT, () => {console.log('App working!')})
