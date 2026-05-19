import { Router } from "express";
import { createLog } from "../controllers/logs.controller";

const router = Router();

router.post("/", createLog);

export default router;