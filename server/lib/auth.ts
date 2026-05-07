import jwt from "jsonwebtoken";
import { prisma } from "./prisma";

export const tokenExpiration = {
  access_token: "7d",
  refresh_token: "30d",
};

export enum TokenType {
  ACCESS_TOKEN = "access_token",
  REFRESH_TOKEN = "refresh_token",
}

const secret = process.env["JWT_SECRET"]!;
const refreshSecret = process.env["JWT_REFRESH_SECRET"]!;
const expiresIn = process.env["JWT_EXPIRES_IN"]!;
const refreshExpiresIn = process.env["JWT_REFRESH_EXPIRES_IN"];

export const generateAccessToken = (userId: number) => {
  const accessToken = jwt.sign({ userId }, secret, { expiresIn });

  return accessToken;
};

export const generateRefreshToken = (userId: number) => {
  const refreshToken = jwt.sign({ userId }, refreshSecret, {
    expiresIn: refreshExpiresIn,
  });

  return refreshToken;
};

export const saveRefreshToken = async (userId: number, token: string) => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  const refreshToken = await prisma.refreshToken.create({
    data: { token, userId, expiresAt },
  });

  return refreshToken;
};

export const revokeRefreshTOken = async (token: string) => {
  await prisma.refreshToken.deleteMany({
    where: {
      token,
    },
  });
};

export const revokeAllUserTokens = async (userId: number) => {
  await prisma.refreshToken.deleteMany({
    where: {
      userId,
    },
  });
};
