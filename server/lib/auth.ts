import { decode, sign, verify } from "jsonwebtoken";

export const tokenExpiration = {
  access_token: 3600,
  refresh_token: 60,
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

const secret = process.env["JWT_SECRET"]!;

export const generateAccessToken = (userId: string) => {
  return generateToken(userId, TokenType.ACCESS_TOKEN);
};

export const generateRefreshToken = (userId: string) => {
  return generateToken(userId, TokenType.REFRESH_TOKEN);
};

const generateToken = (userId: string, type: TokenType) => {
  const expiration = tokenExpiration[type];
  const token = sign({ type }, secret, {
    expiresIn: expiration,
    subject: userId,
  });

  return {
    token,
    expiration,
  };
};

export const getTokenType = (token: string): TokenType => {
  return (verify(token, secret) as JWT).type;
};

export const parseTokenAndGetUserId = (token: string): string => {
  const decoded = verify(token, secret) as JWT;
  return decoded.sub || "";
};
