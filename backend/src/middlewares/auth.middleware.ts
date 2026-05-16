import type { NextFunction, Request, Response } from "express";
import { type TokenPayload, verifyToken } from "../utils/jwt";

type AuthenticatedRequest = Request & {
  user?: TokenPayload;
};

function authMiddleware(
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction,
): void {
    
const authorization = request.headers.authorization;

if (!authorization) {
  response.status(401).json({ message: "Token não informado." });
  return;
}

const parts = authorization.split(" ");
const [scheme, token] = parts;

if (scheme !== "Bearer" || !token || parts.length !== 2) {
  response.status(401).json({ message: "Formato do token inválido. Use Bearer <token>." });
  return;
}


  try {
    const user = verifyToken(token);

    if (!user) {
      response.status(401).json({ message: "Token inválido." });
      return;
    }

    request.user = user;
    next();
  } catch {
    response.status(401).json({ message: "Token inválido." });
  }
}

export { authMiddleware, type AuthenticatedRequest };