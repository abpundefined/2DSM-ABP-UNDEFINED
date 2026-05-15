import { pool } from "../database";
import { hashPassword } from "../utils/password";

type UserRole = "ADMIN" | "SECRETARIA";

export const authRepository = {
  async findUserByEmail(email: string) {
    const result = await pool.query(
      `SELECT id, name, email, password_hash, role
         FROM users
        WHERE email = $1`,
      [email],
    );
    return result.rows[0] || null;
  },

  async insertUser(name: string, email: string, password: string, role: UserRole) {
    const passwordEncoded = await hashPassword(password);

    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, role)
           VALUES ($1, $2, $3, $4)
           RETURNING id, name, email, role`,
      [name, email, passwordEncoded, role],
    );
    return result.rows[0] || null;
  },
};