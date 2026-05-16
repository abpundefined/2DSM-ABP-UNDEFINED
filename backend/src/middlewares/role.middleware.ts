import type { Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "./auth.middleware";

function requireRole(...roles: string[]) {
  return (
    request: AuthenticatedRequest,
    response: Response,
    next: NextFunction,
  ): void => {
    const userRole = request.user?.role;

    if (!userRole) {
      response.status(401).json({ message: "Usuário não autenticado." });
      return;
    }

    if (!roles.includes(userRole)) {
      response.status(403).json({
        message: "Acesso negado. Você não tem permissão para esta ação.",
      });
      return;
    }

    next();
  };
}

export { requireRole };