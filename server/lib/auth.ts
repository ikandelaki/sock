import jwt from "jsonwebtoken";

export const tokenExpiration = {
  access_token: "7d",
  refresh_token: "30d",
};

export enum TokenType {
  ACCESS_TOKEN = "access_token",
  REFRESH_TOKEN = "refresh_token",
}

const secret = process.env["JWT_SECRET"]!;
const expiresIn = process.env["JWT_EXPIRES_IN"]!;

export const generateAccessToken = (userId: number) => {
  const accessToken = jwt.sign({ userId }, secret, { expiresIn });

  return accessToken;
};
