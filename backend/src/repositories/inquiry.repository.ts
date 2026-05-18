import { pool } from "../database";

// Estrutura de dados usada para criar uma nova dúvida no banco.
export type InquiryCreateData = {
  requester_name: string;
  requester_email: string;
  question: string;
};

export const inquiryRepository = {
  // Insere um novo registro na tabela inquiries e retorna o registro criado.
  async createInquiry(data: InquiryCreateData) {
    const result = await pool.query(
      `INSERT INTO inquiries (requester_name, requester_email, question, status)
       VALUES ($1, $2, $3, $4)
       RETURNING id, requester_name, requester_email, question, status, created_at`,
      [data.requester_name, data.requester_email, data.question, "ABERTA"]
    );

    return result.rows[0];
  },
};
