import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

type TokenPayload = {
  userId: string;
  email: string;
};

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token não fornecido." });
  }

  const token = authHeader.split(" ")[1];
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(500).json({ message: "Configuração de autenticação inválida." });
  }

  try {
    const payload = jwt.verify(token, secret) as TokenPayload;

    (req as any).userId = payload.userId;
    (req as any).email = payload.email;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido ou expirado." });
  }
}