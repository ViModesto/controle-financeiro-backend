import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { compareSync, hashSync } from "bcrypt";
import jwt from "jsonwebtoken";
import { BadRequestsException } from "./exceptions/bad-requests";
import { ErrorCode } from "./exceptions/root";
import { UnprocessableEntity } from "./exceptions/validation";
import { NotFoundException } from "./exceptions/not-found";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, name } = req.body;

    let user = await prismaClient.user.findFirst({ where: { email } });
    if (user) {
      new BadRequestsException(
        "User already exists!!",
        ErrorCode.USER_ALREADY_EXISTS
      );
    }
    user = await prismaClient.user.create({
      data: {
        name,
        email,
        password: hashSync(password, 10),
      },
    });
    res.json(user);
  } catch (err: any) {
    next(
      new UnprocessableEntity(
        err?.cause?.issues,
        "Unprocessable entity",
        ErrorCode.UNPROCESSABLE_ENTITY
      )
    );
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  let user = await prismaClient.user.findFirst({ where: { email } });
  if (!user) {
    throw new NotFoundException('User not found.', ErrorCode.USER_NOT_FOUND)
  }
  if (!compareSync(password, user.password)) {
    throw new BadRequestsException('Incorrect password', ErrorCode.INCORRECT_PASSWORD)
  }
  const token = jwt.sign(
    {
      userId: user.id,
    },
    process.env.JWT_SECRET!
  );

  res.json({ user, token });
};
