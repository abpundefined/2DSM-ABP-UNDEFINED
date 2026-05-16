import * as jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";

type TokenPayload = {
  id: string;
  email: string;
  role: string;
};

function createToken(payload: TokenPayload): string {
  const secret = process.env.JWT_SECRET ?? "jwt-dev-secret";
  return jwt.sign(payload, secret, { expiresIn: "8h" });
}

function verifyToken(token: string): TokenPayload | null {
  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET ?? "jwt-dev-secret",
  ) as JwtPayload;

  if (
    typeof decoded.id !== "string" ||
    typeof decoded.email !== "string" ||
    typeof decoded.role !== "string"
  ) {
    return null;
  }

  return { id: decoded.id, email: decoded.email, role: decoded.role };
}

export { createToken, type TokenPayload, verifyToken };