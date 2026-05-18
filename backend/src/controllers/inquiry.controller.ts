import type { Request, Response } from "express";
import { inquiryService } from "../services/inquiry.service";

// Validação simples de email para evitar entradas claramente inválidas.
function isValidEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function createInquiry(req: Request, res: Response) {
  // Recebe os dados do formulário enviados pelo frontend.
  const { requester_name, requester_email, question } = req.body;

  // Valida campos obrigatórios.
  if (!requester_name || !requester_email || !question) {
    res.status(400).json({ message: "Nome, email e pergunta são obrigatórios." });
    return;
  }

  // Valida tipos de dados para evitar valores inesperados.
  if (typeof requester_name !== "string" || typeof requester_email !== "string" || typeof question !== "string") {
    res.status(400).json({ message: "Nome, email e pergunta devem ser texto." });
    return;
  }

  if (!isValidEmail(requester_email)) {
    res.status(400).json({ message: "Email inválido." });
    return;
  }

  // Evita strings apenas com espaços.
  if (requester_name.trim().length === 0 || question.trim().length === 0) {
    res.status(400).json({ message: "Nome e pergunta não podem ficar em branco." });
    return;
  }

  // Limites de tamanho compatíveis com a coluna do banco.
  if (requester_name.length > 160) {
    res.status(400).json({ message: "O nome pode ter no máximo 160 caracteres." });
    return;
  }

  if (requester_email.length > 160) {
    res.status(400).json({ message: "O email pode ter no máximo 160 caracteres." });
    return;
  }

  try {
    // Cria a dúvida usando a camada de serviço.
    const inquiry = await inquiryService.createInquiry({ requester_name, requester_email, question });
    res.status(201).json(inquiry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao salvar a dúvida." });
  }
}
