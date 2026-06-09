import type { Request, Response } from "express";
import { authService } from "../services/auth.service";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { authRepository } from "../repositories/auth.repository";
import { emailService } from "../services/email.service";

const validRoles = ["ADMIN", "SECRETARIA"] as const;
type UserRole = (typeof validRoles)[number];
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isValidRole(role: string): role is UserRole {
  return validRoles.includes(role as UserRole);
}

function isValidUuid(value: string) {
  return uuidRegex.test(value);
}

function isUniqueViolation(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error
    && (error as { code?: string }).code === "23505";
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
    res.status(400).json({ message: "Email e senha são obrigatórios." });
    return;
  }

  const result = await authService.login(email, password);

  if (!result) {
    res.status(401).json({ message: "Email ou senha inválidos." });
    return;
  }

  res.json(result);
}

export async function register(req: Request, res: Response) {
  const { name, email, password, role } = req.body;

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof role !== "string" ||
    !name ||
    !email ||
    !password ||
    !role
  ) {
    res.status(400).json({ message: "Nome, email, senha e role são obrigatórios." });
    return;
  }

  if (!isValidRole(role)) {
    res.status(400).json({ message: "Role inválida. Use ADMIN ou SECRETARIA." });
    return;
  }

  const user = await authService.register(name, email, password, role);

  if (!user) {
    res.status(409).json({ message: "Email já cadastrado." });
    return;
  }

  res.status(201).json(user);
}

export async function getMe(req: AuthenticatedRequest, res: Response) {
  res.json({ user: req.user });
}

export async function listSecretariaUsers(_req: Request, res: Response) {
  try {
    const users = await authService.listSecretariaUsers();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao listar usuarios." });
  }
}

export async function updateSecretariaUser(req: Request, res: Response) {
  const id = typeof req.params.id === "string" ? req.params.id : "";
  const { name, email } = req.body;

  if (!isValidUuid(id)) {
    res.status(400).json({ message: "Id do usuario invalido." });
    return;
  }

  if (typeof name !== "string" || typeof email !== "string" || !name.trim() || !email.trim()) {
    res.status(400).json({ message: "Nome e email sao obrigatorios." });
    return;
  }

  try {
    const user = await authService.updateSecretariaUser(
      id,
      name.trim(),
      email.trim().toLowerCase(),
    );

    if (!user) {
      res.status(404).json({ message: "Usuario nao encontrado." });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error(error);

    if (isUniqueViolation(error)) {
      res.status(409).json({ message: "Email ja cadastrado." });
      return;
    }

    res.status(500).json({ message: "Erro ao atualizar usuario." });
  }
}

export async function deleteSecretariaUser(req: Request, res: Response) {
  const id = typeof req.params.id === "string" ? req.params.id : "";

  if (!isValidUuid(id)) {
    res.status(400).json({ message: "Id do usuario invalido." });
    return;
  }

  try {
    const deleted = await authService.deleteSecretariaUser(id);

    if (!deleted) {
      res.status(404).json({ message: "Usuario nao encontrado." });
      return;
    }

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao excluir usuario." });
  }
}

export async function forgotPassword(req: Request, res: Response) {
  const { email } = req.body;

  if (typeof email !== "string" || !email) {
    res.status(400).json({ message: "O e-mail é obrigatório." });
    return;
  }

  const user = await authRepository.findUserByEmail(email);

  if (!user) {
    // Por segurança, não confirmamos se o e-mail existe ou não
    res.json({ message: "Se o e-mail existir em nossa base, você receberá as instruções." });
    return;
  }

  // Gera código de 6 dígitos
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Imprime no console local para debug/testes
  console.log(`[DEV ONLY] Código de recuperação gerado para ${email}: ${code}`);

  // Expira em 15 minutos
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await authRepository.saveResetToken(email, code, expiresAt);

  try {
    await emailService.sendResetPasswordEmail(email, code);
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    // Mesmo que o e-mail falhe, para evitar enumeração de usuários, enviamos sucesso.
  }

  res.json({ message: "Se o e-mail existir em nossa base, você receberá as instruções." });
}

export async function resetPassword(req: Request, res: Response) {
  const { email, code, newPassword } = req.body;

  if (!email || !code || !newPassword) {
    res.status(400).json({ message: "E-mail, código e nova senha são obrigatórios." });
    return;
  }

  const user = await authRepository.findUserByResetToken(email, code);

  if (!user) {
    res.status(400).json({ message: "Código inválido ou expirado." });
    return;
  }

  if (new Date(user.reset_token_expires) < new Date()) {
    res.status(400).json({ message: "O código expirou. Solicite um novo." });
    return;
  }

  await authRepository.updateUserPasswordAndClearToken(email, newPassword);

  res.json({ message: "Senha redefinida com sucesso." });
}
