import { Router } from "express";
import { login, register, getMe } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";

const authRouter = Router();

// Pública — qualquer um pode logar
authRouter.post("/login", login);

// Protegida + só ADMIN cria usuários
authRouter.post(
  "/register",
  authMiddleware,
  requireRole("ADMIN"),
  register,
);

// Protegida — qualquer usuário logado vê seus dados
authRouter.get("/me", authMiddleware, getMe);

export default authRouter;