import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import { getDashboardStats } from "../controllers/dashboard.controller";

const dashboardRouter = Router();

// Rota protegida: requer JWT válido + role ADMIN ou SECRETARIA
dashboardRouter.get(
  "/stats",
  authMiddleware,
  requireRole("ADMIN", "SECRETARIA"),
  getDashboardStats,
);

export default dashboardRouter;
