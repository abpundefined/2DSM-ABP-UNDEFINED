import * as jwt from "jsonwebtoken";
import type { JwtPayload, Secret, SignOptions } from "jsonwebtoken";



type TokenPayload = {
  id: string;
  email: string;
  role: string;
};

type JwtExpiresIn = NonNullable<SignOptions["expiresIn"]>;


function createToken(payload: TokenPayload): string {
  const secret: Secret = process.env.JWT_SECRET ?? "jwt-dev-secret";
  const expiresIn = (process.env.JWT_EXPIRES_IN ?? "8h") as JwtExpiresIn;

  return jwt.sign(payload, secret, { expiresIn });
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