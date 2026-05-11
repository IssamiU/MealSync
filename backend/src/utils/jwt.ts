import jwt, { Secret, SignOptions } from "jsonwebtoken";

type TokenPayload = {
  userId: string;
  email: string;
};

export function generateAccessToken(payload: TokenPayload): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }

  const options: SignOptions = {
    expiresIn: "1d",
  };

  return jwt.sign(payload, secret as Secret, options);
}

export function generateRefreshToken(payload: TokenPayload): string {
  const secret = process.env.JWT_REFRESH_SECRET;

  if (!secret) {
    throw new Error("JWT_REFRESH_SECRET environment variable is not set");
  }

  const options: SignOptions = {
    expiresIn: "7d",
  };

  return jwt.sign(payload, secret as Secret, options);
}