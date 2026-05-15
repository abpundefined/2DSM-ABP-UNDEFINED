import { authRepository } from "../repositories/auth.repository";
import { createToken } from "../utils/jwt";
import { verifyPassword } from "../utils/password";

type UserRole = "ADMIN" | "SECRETARIA";

export const authService = {
  async login(email: string, password: string) {
    const user = await authRepository.findUserByEmail(email);

    if (!user || !(await verifyPassword(password, user.password_hash))) {
      return null;
    }

    const token = createToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  },

  async register(name: string, email: string, password: string, role: UserRole) {
    const existing = await authRepository.findUserByEmail(email);

    if (existing) return null;

    return authRepository.insertUser(name, email, password, role);
  },
};