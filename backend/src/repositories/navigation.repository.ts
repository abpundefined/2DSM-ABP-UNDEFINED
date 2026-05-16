import { pool } from "../database";

export type CreateInquiryData = {
  requesterName: string;
  requesterEmail: string;
  question: string;
};

export type SatisfactionFlag = "ATENDEU" | "NAO_ATENDEU";

export type CreateFeedbackData = {
  sessionId?: string;
  navigationFlow?: unknown[];
  inquiryIds?: number[];
  flag: SatisfactionFlag;
};

export const navigationRepository = {
  async findRoot() {
    const result = await pool.query(`
      SELECT id, title, slug
      FROM navigation_nodes
      WHERE parent_id IS NULL
      ORDER BY display_order
    `);

    return result.rows;
  },
  async findChildrenBySlug(slug: string) {
    const parentResult = await pool.query(
      `
      SELECT id, title, slug, answer_summary, evidence_excerpt, evidence_source
      FROM navigation_nodes
      WHERE slug = $1
        AND is_active = true
      `,
      [slug]
    );
    if (parentResult.rows.length === 0){
      return null
    }

    const parent = parentResult.rows[0]
    
    const childrenResult = await pool.query(
      `
      SELECT id, title, slug, answer_summary, evidence_excerpt, evidence_source
      FROM navigation_nodes
      WHERE parent_id = $1
        AND is_active = true
      ORDER BY display_order
      `,
      [parent.id]
    );
    return{
      parent,
      children: childrenResult.rows
    }
  },

  async createInquiry(data: CreateInquiryData) {
    const result = await pool.query(
      `
      INSERT INTO inquiries (requester_name, requester_email, question)
      VALUES ($1, $2, $3)
      RETURNING id, requester_name, requester_email, question, status, created_at
      `,
      [data.requesterName, data.requesterEmail, data.question]
    );

    return result.rows[0];
  },

  async createFeedback(data: CreateFeedbackData) {
    const result = await pool.query(
      `
      INSERT INTO interaction_logs (session_id, navigation_flow, inquiry_ids, flag)
      VALUES (
        COALESCE($1::uuid, gen_random_uuid()),
        $2::jsonb,
        $3::jsonb,
        $4::satisfaction_flag
      )
      RETURNING id, session_id, navigation_flow, inquiry_ids, flag, created_at
      `,
      [
        data.sessionId ?? null,
        JSON.stringify(data.navigationFlow ?? []),
        JSON.stringify(data.inquiryIds ?? []),
        data.flag,
      ]
    );

    return result.rows[0];
  }
};
