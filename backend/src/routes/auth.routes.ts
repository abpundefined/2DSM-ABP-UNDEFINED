import { Router } from "express";
import {
  login,
  register,
  getMe,
  forgotPassword,
  resetPassword,
  listSecretariaUsers,
  updateSecretariaUser,
  deleteSecretariaUser,
} from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";

const authRouter = Router();

// Pública — qualquer um pode logar
authRouter.post("/login", login);

// Pública — solicitar redefinição de senha
authRouter.post("/forgot-password", forgotPassword);

// Pública — enviar nova senha com código de verificação
authRouter.post("/reset-password", resetPassword);

// Protegida + só ADMIN cria usuários
authRouter.post(
  "/register",
  authMiddleware,
  requireRole("ADMIN"),
  register,
);

// Protegida — qualquer usuário logado vê seus dados
authRouter.get("/me", authMiddleware, getMe);

authRouter.get("/users", authMiddleware, requireRole("ADMIN"), listSecretariaUsers);
authRouter.put("/users/:id", authMiddleware, requireRole("ADMIN"), updateSecretariaUser);
authRouter.delete("/users/:id", authMiddleware, requireRole("ADMIN"), deleteSecretariaUser);

export default authRouter;
