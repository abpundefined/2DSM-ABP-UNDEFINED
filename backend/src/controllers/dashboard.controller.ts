import type { Request, Response } from "express";
import { pool } from "../database";

type Period = "7d" | "30d" | "all";

function buildDateFilter(period: Period): string {
  if (period === "7d")  return "AND created_at >= NOW() - INTERVAL '7 days'";
  if (period === "30d") return "AND created_at >= NOW() - INTERVAL '30 days'";
  return "";
}

function parsePeriod(raw: unknown): Period {
  if (raw === "7d" || raw === "30d" || raw === "all") return raw;
  return "all";
}

export async function getDashboardStats(req: Request, res: Response): Promise<void> {
  const period     = parsePeriod(req.query.period);
  const dateFilter = buildDateFilter(period);

  try {
    const [
      usersResult,
      summaryResult,
      chartResult,
      pieResult,
      topQuestionsResult,
      sessionsResult,
      satisfactionResult,
      courseResult,
      unresolvedSubjectsResult,
    ] = await Promise.all([

      // 1. Total de usuários cadastrados (sem filtro de período)
      pool.query<{ count: string }>(
        "SELECT COUNT(*) AS count FROM users",
      ),

      // 2. Totais de dúvidas por status
      pool.query<{ pending: string; resolved: string }>(
        `SELECT
           COUNT(*) FILTER (WHERE status = 'ABERTA')     AS pending,
           COUNT(*) FILTER (WHERE status = 'RESPONDIDA') AS resolved
         FROM inquiries
         WHERE 1=1 ${dateFilter}`,
      ),

      // 3. Dúvidas agrupadas por dia — BarChart de volume
      pool.query<{ day: string; questions: string }>(
        `SELECT
           TO_CHAR(created_at AT TIME ZONE 'America/Sao_Paulo', 'DD/MM') AS day,
           COUNT(*) AS questions
         FROM inquiries
         WHERE 1=1 ${dateFilter}
         GROUP BY
           TO_CHAR(created_at AT TIME ZONE 'America/Sao_Paulo', 'DD/MM'),
           DATE_TRUNC('day', created_at AT TIME ZONE 'America/Sao_Paulo')
         ORDER BY DATE_TRUNC('day', created_at AT TIME ZONE 'America/Sao_Paulo') ASC
         LIMIT 30`,
      ),

      // 4. Distribuição de status — PieChart (donut)
      pool.query<{ name: string; value: string }>(
        `SELECT
           CASE status
             WHEN 'ABERTA'     THEN 'Abertas'
             WHEN 'RESPONDIDA' THEN 'Resolvidas'
           END AS name,
           COUNT(*) AS value
         FROM inquiries
         WHERE 1=1 ${dateFilter}
         GROUP BY status`,
      ),

      // 5. Top 5 perguntas do chatbot via interaction_logs.navigation_flow (JSONB)
      //    Expande o array JSONB, extrai o campo 'title' de cada nó e conta acessos
      pool.query<{ title: string; count: string }>(
        `SELECT
           node_entry ->> 'title' AS title,
           COUNT(*)               AS count
         FROM interaction_logs,
              jsonb_array_elements(navigation_flow) AS node_entry
         WHERE
           node_entry ->> 'title' IS NOT NULL
           AND node_entry ->> 'title' <> ''
           ${dateFilter.replace(/created_at/g, "interaction_logs.created_at")}
         GROUP BY node_entry ->> 'title'
         ORDER BY COUNT(*) DESC
         LIMIT 5`,
      ),

      pool.query<{ total_sessions: string; answered_automatically: string }>(
        `SELECT
           COUNT(*) AS total_sessions,
           COUNT(*) FILTER (
             WHERE jsonb_array_length(COALESCE(inquiry_ids, '[]'::jsonb)) = 0
           ) AS answered_automatically
         FROM interaction_logs
         WHERE 1=1 ${dateFilter.replace(/created_at/g, "interaction_logs.created_at")}`,
      ),

      pool.query<{ positive: string; total: string }>(
        `SELECT
           COUNT(*) FILTER (WHERE flag = 'ATENDEU') AS positive,
           COUNT(*) FILTER (WHERE flag IS NOT NULL) AS total
         FROM interaction_logs
         WHERE 1=1 ${dateFilter.replace(/created_at/g, "interaction_logs.created_at")}`,
      ),

      pool.query<{ name: string; value: string }>(
        `SELECT name, COUNT(*) AS value
         FROM (
           SELECT NULLIF(navigation_flow -> 0 ->> 'title', '') AS name
           FROM interaction_logs
           WHERE jsonb_typeof(navigation_flow) = 'array'
             AND jsonb_array_length(navigation_flow) > 0
             ${dateFilter.replace(/created_at/g, "interaction_logs.created_at")}
         ) first_steps
         WHERE name IS NOT NULL
         GROUP BY name
         ORDER BY COUNT(*) DESC
         LIMIT 5`,
      ),

      pool.query<{ title: string; count: string }>(
        `SELECT
           COALESCE(flow.title, LEFT(inquiries.question, 80)) AS title,
           COUNT(*) AS count
         FROM inquiries
         LEFT JOIN LATERAL (
           SELECT COALESCE(
             NULLIF(interaction_logs.navigation_flow -> (jsonb_array_length(interaction_logs.navigation_flow) - 1) ->> 'title', ''),
             NULLIF(interaction_logs.navigation_flow -> 0 ->> 'title', '')
           ) AS title
           FROM interaction_logs
           WHERE interaction_logs.inquiry_ids @> jsonb_build_array(inquiries.id)
             AND jsonb_typeof(interaction_logs.navigation_flow) = 'array'
             AND jsonb_array_length(interaction_logs.navigation_flow) > 0
           ORDER BY interaction_logs.created_at DESC
           LIMIT 1
         ) flow ON TRUE
         WHERE inquiries.status = 'ABERTA'
           ${dateFilter.replace(/created_at/g, "inquiries.created_at")}
         GROUP BY COALESCE(flow.title, LEFT(inquiries.question, 80))
         ORDER BY COUNT(*) DESC
         LIMIT 5`,
      ),
    ]);

    // 6. Volume de e-mails — retorna array vazio com segurança
    //    (tabela email_logs ainda não existe; será preenchida pela Issue #2)
    let emailsData: Array<{ day: string; count: number }> = [];
    try {
      const emailResult = await pool.query<{ day: string; count: string }>(
        `SELECT
           TO_CHAR(sent_at AT TIME ZONE 'America/Sao_Paulo', 'DD/MM') AS day,
           COUNT(*) AS count
         FROM email_logs
         WHERE 1=1 ${dateFilter.replace(/created_at/g, "sent_at")}
         GROUP BY
           TO_CHAR(sent_at AT TIME ZONE 'America/Sao_Paulo', 'DD/MM'),
           DATE_TRUNC('day', sent_at AT TIME ZONE 'America/Sao_Paulo')
         ORDER BY DATE_TRUNC('day', sent_at AT TIME ZONE 'America/Sao_Paulo') ASC
         LIMIT 30`,
      );
      emailsData = emailResult.rows.map((r) => ({
        day:   r.day,
        count: parseInt(r.count, 10),
      }));
    } catch {
      // Tabela email_logs ainda não existe — retorna vazio sem quebrar a rota
      emailsData = [];
    }

    const summary = summaryResult.rows[0];
    const sessions = sessionsResult.rows[0];
    const satisfaction = satisfactionResult.rows[0];
    const satisfactionTotal = parseInt(satisfaction?.total ?? "0", 10);
    const satisfactionRate =
      satisfactionTotal > 0
        ? Math.round((parseInt(satisfaction?.positive ?? "0", 10) / satisfactionTotal) * 100)
        : 0;

    res.json({
      summary: {
        totalUsers:        parseInt(usersResult.rows[0]?.count ?? "0", 10),
        pendingQuestions:  parseInt(summary?.pending  ?? "0", 10),
        resolvedQuestions: parseInt(summary?.resolved ?? "0", 10),
        totalSessions: parseInt(sessions?.total_sessions ?? "0", 10),
        answeredAutomatically: parseInt(sessions?.answered_automatically ?? "0", 10),
        satisfactionRate,
      },
      chartData: chartResult.rows.map((r) => ({
        day:       r.day,
        questions: parseInt(r.questions, 10),
      })),
      pieData: pieResult.rows.map((r) => ({
        name:  r.name,
        value: parseInt(r.value, 10),
      })),
      topQuestionsData: topQuestionsResult.rows.map((r) => ({
        title: r.title,
        count: parseInt(r.count, 10),
      })),
      courseData: courseResult.rows.map((r) => ({
        name: r.name,
        value: parseInt(r.value, 10),
      })),
      unresolvedSubjectsData: unresolvedSubjectsResult.rows.map((r) => ({
        title: r.title,
        count: parseInt(r.count, 10),
      })),
      emailsData,
    });
  } catch (error) {
    console.error("[dashboard.controller] Erro ao buscar estatísticas:", error);
    res.status(500).json({ message: "Erro interno ao buscar estatísticas do dashboard." });
  }
}
