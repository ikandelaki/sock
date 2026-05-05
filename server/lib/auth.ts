import { decode, sign, verify } from "jsonwebtoken";
import { UserType } from "types/User";

export const tokenExpiration = {
  access_token: "7d",
  refresh_token: "30d",
};

export enum TokenType {
  ACCESS_TOKEN = "access_token",
  REFRESH_TOKEN = "refresh_token",
}

type JWT = {
  exp: number;
  type: TokenType;
  sub: string;
};

type PayloadType = {
  id: number;
  email: string;
  name: string;
};

const secret = process.env["JWT_SECRET"]!;
const refreshSecret = process.env["REFRESH_SECRET"]!;

export const generateTokens = (user: UserType) => {
  const { id, email, name } = user;
  const payload: PayloadType = { id: id!, email, name };

  const accessToken = sign(payload, secret, {
    expiresIn: tokenExpiration.access_token,
  });
  const refreshToken = sign(payload, refreshSecret, {
    expiresIn: tokenExpiration.refresh_token,
  });

  return { accessToken, refreshToken };
};
