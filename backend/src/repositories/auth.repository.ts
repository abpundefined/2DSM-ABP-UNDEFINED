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

  async listSecretariaUsers() {
    const result = await pool.query(
      `SELECT id, name, email, role, created_at, updated_at
         FROM users
        WHERE role = 'SECRETARIA'
        ORDER BY name`,
    );

    return result.rows;
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

  async updateSecretariaUser(id: string, name: string, email: string) {
    const result = await pool.query(
      `UPDATE users
          SET name = $1,
              email = $2
        WHERE id = $3
          AND role = 'SECRETARIA'
        RETURNING id, name, email, role, created_at, updated_at`,
      [name, email, id],
    );

    return result.rows[0] ?? null;
  },

  async deleteSecretariaUser(id: string) {
    const result = await pool.query(
      `DELETE FROM users
        WHERE id = $1
          AND role = 'SECRETARIA'
        RETURNING id`,
      [id],
    );

    return (result.rowCount ?? 0) > 0;
  },

  async saveResetToken(email: string, token: string, expiresAt: Date) {
    await pool.query(
      `UPDATE users
       SET reset_token = $1, reset_token_expires = $2
       WHERE email = $3`,
      [token, expiresAt, email]
    );
  },

  async findUserByResetToken(email: string, token: string) {
    const result = await pool.query(
      `SELECT id, reset_token_expires
       FROM users
       WHERE email = $1 AND reset_token = $2`,
      [email, token]
    );
    return result.rows[0] || null;
  },

  async updateUserPasswordAndClearToken(email: string, newPasswordPlain: string) {
    const passwordEncoded = await hashPassword(newPasswordPlain);
    await pool.query(
      `UPDATE users
       SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL
       WHERE email = $2`,
      [passwordEncoded, email]
    );
  },
};
