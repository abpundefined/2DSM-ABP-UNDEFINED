import { useEffect, useState, type ReactNode } from "react";
import type { AuthUser } from "../../services/authService";
import {
  dashboardService,
  type DashboardStats,
  type Period,
  type PieDataPoint,
  type TopQuestionPoint,
} from "../../services/dashboardService";
import "./Dashboard.css";

type AdminTab = "dashboard" | "perguntas" | "duvidas" | "logs";

type DashboardProps = {
  user: AuthUser | null;
  onTabChange: (tab: AdminTab) => void;
  onNavigateToChat: () => void;
};

const PERIOD_LABELS: Record<Period, string> = {
  all: "Todo o período",
  "30d": "Últimos 30 dias",
  "7d": "Últimos 7 dias",
};

const PERIOD_HINTS: Record<Period, string> = {
  all: "visão geral desde o início do semestre",
  "30d": "recorte das últimas quatro semanas",
  "7d": "recorte operacional da semana",
};

type StatCardProps = {
  label: string;
  value: number;
  description: string;
  suffix?: string;
  accent?: boolean;
  onClick?: () => void;
};

function StatCard({ label, value, description, suffix = "", accent = false, onClick }: StatCardProps) {
  const content = (
    <>
      <span className="db-stat-value">
        {value.toLocaleString("pt-BR")}
        {suffix && <span className="db-stat-suffix">{suffix}</span>}
      </span>
      <span className="db-stat-label">{label}</span>
      <span className="db-stat-desc">{description}</span>
      {onClick && <span className="db-stat-cta" aria-hidden="true">Ver detalhes</span>}
    </>
  );

  const className = [
    "db-stat-card",
    accent ? "db-stat-card--accent" : "",
    onClick ? "db-stat-card--clickable" : "",
  ].filter(Boolean).join(" ");

  if (onClick) {
    return (
      <button
        type="button"
        className={className}
        onClick={onClick}
        aria-label={`${label}: ${value}${suffix}. ${description}`}
      >
        {content}
      </button>
    );
  }

  return (
    <div className={className} aria-label={`${label}: ${value}${suffix}. ${description}`}>
      {content}
    </div>
  );
}

function EmptyState({ message = "Nenhum dado para o período selecionado." }: { message?: string }) {
  return (
    <div className="db-empty" role="status" aria-label={message}>
      <div className="db-empty-bars" aria-hidden="true">
        {[40, 70, 30, 55, 20].map((h, i) => (
          <div key={i} className="db-empty-bar" style={{ height: `${h}%` }} />
        ))}
      </div>
      <p className="db-empty-text">{message}</p>
    </div>
  );
}

type ChartCardProps = {
  title: string;
  subtitle: string;
  wide?: boolean;
  tall?: boolean;
  headerRight?: ReactNode;
  children: ReactNode;
};

function ChartCard({ title, subtitle, wide, tall, headerRight, children }: ChartCardProps) {
  return (
    <div className={["db-chart-card", wide ? "db-chart-card--wide" : ""].filter(Boolean).join(" ")}>
      <div className="db-chart-head">
        <div>
          <h3 className="db-chart-title">{title}</h3>
          <p className="db-chart-sub">{subtitle}</p>
        </div>
        {headerRight && <div className="db-chart-controls">{headerRight}</div>}
      </div>
      <div className={["db-chart-area", tall ? "db-chart-area--tall" : ""].filter(Boolean).join(" ")}>
        {children}
      </div>
    </div>
  );
}

function normalizePie(data: PieDataPoint[] | undefined) {
  return (data ?? [])
    .filter(Boolean)
    .map((item) => ({
      ...item,
      name: normalizeStatusName(item.name),
      value: typeof item.value === "number" ? item.value : Number(item.value) || 0,
    }))
    .filter((item) => item.value > 0);
}

function normalizeTop(data: TopQuestionPoint[] | undefined) {
  return (data ?? [])
    .filter(Boolean)
    .map((item) => ({
      ...item,
      count: typeof item.count === "number" ? item.count : Number(item.count) || 0,
    }))
    .filter((item) => item.count > 0);
}

function normalizeStatusName(name: string) {
  const clean = name.toLowerCase();
  if (clean === "open" || clean === "aberta" || clean === "abertas") return "Abertas";
  if (clean === "resolved" || clean === "respondida" || clean === "respondidas") return "Respondidas";
  return name;
}

function percent(value: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((value / total) * 100);
}

type TrendBarPoint = {
  day: string;
  value: number;
};

function TrendBars({
  data,
  unit,
  tone = "red",
}: {
  data: TrendBarPoint[];
  unit: string;
  tone?: "red" | "dark";
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const max = Math.max(...data.map((item) => item.value), 1);
  const latest = data[data.length - 1]?.value ?? 0;
  const previous = data[data.length - 2]?.value ?? latest;
  const delta = latest - previous;
  const deltaLabel = delta > 0 ? `+${delta}` : String(delta);

  return (
    <div className={`db-trend-panel db-trend-panel--${tone}`}>
      <div className="db-trend-summary" aria-label={`Resumo de ${unit}`}>
        <div>
          <span>Total</span>
          <strong>{total.toLocaleString("pt-BR")}</strong>
        </div>
        <div>
          <span>Maior volume</span>
          <strong>{max.toLocaleString("pt-BR")}</strong>
        </div>
        <div>
          <span>Variação final</span>
          <strong className={delta > 0 ? "db-trend-up" : delta < 0 ? "db-trend-down" : ""}>
            {delta === 0 ? "0" : deltaLabel}
          </strong>
        </div>
      </div>

      <div className="db-trend-bars" role="list" aria-label={`${unit} por período`}>
        {data.map((item) => {
          const height = Math.max(8, Math.round((item.value / max) * 100));

          return (
            <div
              key={item.day}
              className="db-trend-item"
              role="listitem"
              aria-label={`${item.day}: ${item.value.toLocaleString("pt-BR")} ${unit}`}
            >
              <span className="db-trend-value">{item.value.toLocaleString("pt-BR")}</span>
              <div className="db-trend-bar-zone" aria-hidden="true">
                <span className="db-trend-fill" style={{ height: `${height}%` }} />
              </div>
              <span className="db-trend-label">{item.day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatusSummary({ data }: { data: PieDataPoint[] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="db-status-panel">
      <div className="db-status-total">
        <span>Total encaminhadas</span>
        <strong>{total.toLocaleString("pt-BR")}</strong>
      </div>

      <div className="db-status-stack" aria-hidden="true">
        {data.map((item) => (
          <span
            key={item.name}
            className={item.name === "Abertas" ? "db-status-segment--open" : "db-status-segment--resolved"}
            style={{ width: `${Math.max(3, percent(item.value, total))}%` }}
          />
        ))}
      </div>

      <div className="db-status-list" role="list" aria-label="Status da fila da secretaria">
        {data.map((item) => {
          const share = percent(item.value, total);

          return (
            <div
              key={item.name}
              className="db-status-row"
              role="listitem"
              aria-label={`${item.name}: ${item.value.toLocaleString("pt-BR")} dúvidas, ${share}%`}
            >
              <span className={item.name === "Abertas" ? "db-status-dot db-status-dot--open" : "db-status-dot db-status-dot--resolved"} />
              <span className="db-status-name">{item.name}</span>
              <strong>{item.value.toLocaleString("pt-BR")}</strong>
              <span className="db-status-share">{share}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AudienceBars({ data }: { data: PieDataPoint[] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const max = Math.max(...data.map((item) => item.value), 1);

  return (
    <div className="db-audience-list" role="list">
      {data.map((item) => {
        const share = percent(item.value, total);
        const width = Math.max(6, Math.round((item.value / max) * 100));

        return (
          <div
            key={item.name}
            className="db-audience-row"
            role="listitem"
            aria-label={`${item.name}: ${item.value.toLocaleString("pt-BR")} atendimentos, ${share}%`}
          >
            <div className="db-audience-meta">
              <span className="db-audience-name">{item.name}</span>
              <strong className="db-audience-value">
                {item.value.toLocaleString("pt-BR")}
                <span>{share}%</span>
              </strong>
            </div>
            <div className="db-audience-track" aria-hidden="true">
              <span className="db-audience-fill" style={{ width: `${width}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TopicBars({
  data,
  unit,
  tone,
}: {
  data: TopQuestionPoint[];
  unit: string;
  tone: "red" | "dark";
}) {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  const max = Math.max(...data.map((item) => item.count), 1);

  return (
    <div className={`db-audience-list db-audience-list--${tone}`} role="list">
      {data.map((item) => {
        const share = percent(item.count, total);
        const width = Math.max(6, Math.round((item.count / max) * 100));

        return (
          <div
            key={item.title}
            className="db-audience-row"
            role="listitem"
            aria-label={`${item.title}: ${item.count.toLocaleString("pt-BR")} ${unit}, ${share}%`}
          >
            <div className="db-audience-meta">
              <span className="db-audience-name">{item.title}</span>
              <strong className="db-audience-value">
                {item.count.toLocaleString("pt-BR")}
                <span>{share}%</span>
              </strong>
            </div>
            <div className="db-audience-track" aria-hidden="true">
              <span className="db-audience-fill" style={{ width: `${width}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function Dashboard({ user, onTabChange, onNavigateToChat }: DashboardProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<Period>("all");

  useEffect(() => {
    const ctrl = new AbortController();
    const fetch = async () => {
      try {
        const data = await dashboardService.getStats(period);
        if (!ctrl.signal.aborted) {
          setStats(data);
          setError(null);
        }
      } catch (err) {
        if (!ctrl.signal.aborted) {
          setError(err instanceof Error ? err.message : "Erro ao carregar dados.");
        }
      } finally {
        if (!ctrl.signal.aborted) setLoading(false);
      }
    };

    void fetch();
    return () => { ctrl.abort(); };
  }, [period]);

  const changePeriod = (nextPeriod: Period) => {
    setLoading(true);
    setError(null);
    setPeriod(nextPeriod);
  };

  const safeChart = (stats?.chartData ?? [])
    .filter(Boolean)
    .map((item) => ({
      ...item,
      questions: typeof item.questions === "number" ? item.questions : Number(item.questions) || 0,
    }));
  const safePie = normalizePie(stats?.pieData);
  const safeTopQ = normalizeTop(stats?.topQuestionsData);
  const safeEmails = (stats?.emailsData ?? [])
    .filter(Boolean)
    .map((item) => ({
      ...item,
      count: typeof item.count === "number" ? item.count : Number(item.count) || 0,
    }))
    .filter((item) => item.count > 0);
  const safeCourse = normalizePie(stats?.courseData);
  const safeUnresolved = normalizeTop(stats?.unresolvedSubjectsData);

  const totalQuestions = (stats?.summary.pendingQuestions ?? 0) + (stats?.summary.resolvedQuestions ?? 0);
  const totalSessions = stats?.summary.totalSessions ?? totalQuestions;
  const autoAnswers = stats?.summary.answeredAutomatically ?? Math.max(totalSessions - totalQuestions, 0);
  const resolutionRate = percent(stats?.summary.resolvedQuestions ?? 0, totalQuestions);
  const satisfactionRate = stats?.summary.satisfactionRate ?? resolutionRate;
  const escalationCount = safeEmails.reduce((sum, item) => sum + item.count, 0);

  const has = {
    chart: safeChart.length > 0,
    pie: safePie.length > 0,
    topQ: safeTopQ.length > 0,
    emails: safeEmails.length > 0,
    course: safeCourse.length > 0,
    unresolved: safeUnresolved.length > 0,
  };

  return (
    <section className="db-shell" aria-label="Painel de métricas do chatbot institucional">
      <div className="db-toolbar">
        <div className="db-toolbar-left">
          <button type="button" className="db-btn-ghost" onClick={onNavigateToChat}>
            Voltar ao chat
          </button>
          <div className="db-toolbar-info">
            <strong className="db-toolbar-title">Dashboard institucional</strong>
            <span className="db-toolbar-user">
              {user ? `${user.name} · ${user.role}` : "Chatbot Fatec Jacareí"} · {PERIOD_HINTS[period]}
            </span>
          </div>
        </div>

        <div className="db-period-tabs" role="group" aria-label="Selecionar período">
          {(Object.keys(PERIOD_LABELS) as Period[]).map((option) => (
            <button
              key={option}
              type="button"
              className={`db-period-tab ${period === option ? "db-period-tab--active" : ""}`}
              onClick={() => changePeriod(option)}
              aria-pressed={period === option}
            >
              {PERIOD_LABELS[option]}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="db-loading" aria-live="polite">
          <span className="db-spinner" aria-hidden="true" />
          Carregando métricas...
        </div>
      )}

      {!loading && error && (
        <div className="db-error-banner" role="alert">
          <strong>Falha ao carregar dados.</strong> {error}
        </div>
      )}

      {!loading && stats && !error && (
        <>
          <div className="db-kpi-grid" role="list" aria-label="Indicadores principais">
            <div role="listitem">
              <StatCard
                label="Atendimentos"
                value={totalSessions}
                description="Sessões de conversa no chatbot"
                accent
              />
            </div>
            <div role="listitem">
              <StatCard
                label="Respostas automáticas"
                value={autoAnswers}
                description={`${percent(autoAnswers, totalSessions)}% resolvidas pela árvore do seed`}
              />
            </div>
            <div role="listitem">
              <StatCard
                label="Dúvidas abertas"
                value={stats.summary.pendingQuestions}
                description="Aguardando secretaria"
                onClick={() => onTabChange("duvidas")}
              />
            </div>
            <div role="listitem">
              <StatCard
                label="Taxa de resolução"
                value={resolutionRate}
                suffix="%"
                description={`${stats.summary.resolvedQuestions.toLocaleString("pt-BR")} dúvidas respondidas`}
                onClick={() => onTabChange("duvidas")}
              />
            </div>
          </div>

          <div className="db-context-strip" aria-label="Resumo do contexto institucional">
            <div className="db-context-item">
              <span>Base do chatbot</span>
              <strong>DSM, GEO, MARH, Não sou aluno e SIGA</strong>
            </div>
            <div className="db-context-item">
              <span>Equipe interna</span>
              <strong>{stats.summary.totalUsers.toLocaleString("pt-BR")} usuários no seed</strong>
            </div>
            <div className="db-context-item">
              <span>Satisfação simulada</span>
              <strong>{satisfactionRate}% avaliações positivas</strong>
            </div>
            <div className="db-context-item">
              <span>Encaminhamentos</span>
              <strong>{escalationCount.toLocaleString("pt-BR")} e-mails à secretaria</strong>
            </div>
          </div>

          <div className="db-charts-grid">
            <ChartCard
              title="Dúvidas encaminhadas"
              subtitle="Quando o chatbot precisou registrar uma dúvida para atendimento humano"
            >
              {has.chart ? (
                <TrendBars
                  data={safeChart.map((item) => ({ day: item.day, value: item.questions }))}
                  unit="dúvidas"
                />
              ) : (
                <EmptyState />
              )}
            </ChartCard>

            <ChartCard title="Fila da secretaria" subtitle="Status das dúvidas que saíram do fluxo automático">
              {has.pie ? (
                <StatusSummary data={safePie} />
              ) : (
                <EmptyState />
              )}
            </ChartCard>

            <ChartCard title="Entrada por público" subtitle="Primeira escolha feita na árvore do chatbot">
              {has.course ? (
                <AudienceBars data={safeCourse} />
              ) : (
                <EmptyState message="Sem logs de navegação por curso ainda." />
              )}
            </ChartCard>

            <ChartCard title="Encaminhamentos à secretaria" subtitle="Dúvidas que geraram notificação por e-mail">
              {has.emails ? (
                <TrendBars
                  data={safeEmails.map((item) => ({ day: item.day, value: item.count }))}
                  unit="e-mails"
                  tone="dark"
                />
              ) : (
                <EmptyState message="Integração de e-mail ainda sem registros." />
              )}
            </ChartCard>

            <ChartCard title="Assuntos mais acessados" subtitle="Nós do seed mais escolhidos pelos usuários" wide tall>
              {has.topQ ? (
                <TopicBars data={safeTopQ} unit="acessos" tone="red" />
              ) : (
                <EmptyState message="Nenhuma interação do chatbot registrada ainda." />
              )}
            </ChartCard>

            <ChartCard title="Pendências por assunto" subtitle="Temas que mais precisam de resposta humana" wide>
              {has.unresolved ? (
                <TopicBars data={safeUnresolved} unit="abertas" tone="dark" />
              ) : (
                <EmptyState message="Nenhuma pendência aberta neste período." />
              )}
            </ChartCard>
          </div>
        </>
      )}
    </section>
  );
}
