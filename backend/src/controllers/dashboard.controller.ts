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

    res.json({
      summary: {
        totalUsers:        parseInt(usersResult.rows[0]?.count ?? "0", 10),
        pendingQuestions:  parseInt(summary?.pending  ?? "0", 10),
        resolvedQuestions: parseInt(summary?.resolved ?? "0", 10),
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
      emailsData,
    });
  } catch (error) {
    console.error("[dashboard.controller] Erro ao buscar estatísticas:", error);
    res.status(500).json({ message: "Erro interno ao buscar estatísticas do dashboard." });
  }
}
