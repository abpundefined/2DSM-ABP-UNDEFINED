import { Router } from "express";
import { createInquiry } from "../controllers/inquiry.controller";

const router = Router();

// Rota responsável por receber dúvidas enviadas pelo formulário e
// disparar o controller de criação.
router.post("/", createInquiry);

export default router;
