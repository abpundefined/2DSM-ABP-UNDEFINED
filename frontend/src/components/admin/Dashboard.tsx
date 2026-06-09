import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import type { AuthUser } from "../../services/authService";
import {
  dashboardService,
  type DashboardStats,
  type Period,
} from "../../services/dashboardService";
import "./Dashboard.css";

// ── Paleta Fatec ──────────────────────────────────────────────────────────────
const PIE_COLORS  = ["#bf0000", "#4a4a4a"];
const BAR_COLOR   = "#bf0000";
const LINE_COLOR  = "#bf0000";
const EMAIL_COLOR = "#4a4a4a";
const TOP_COLOR   = "#bf0000";

// ── Tipos internos ────────────────────────────────────────────────────────────
type AdminTab = "dashboard" | "perguntas" | "duvidas" | "logs";
type ChartType = "bar" | "line";

type DashboardProps = {
  user: AuthUser | null;
  onTabChange: (tab: AdminTab) => void;
  onNavigateToChat: () => void;
};

// ── Tooltip compartilhado ─────────────────────────────────────────────────────
const TT = {
  contentStyle: {
    background: "#fff",
    border: "1px solid #e8e8e8",
    borderRadius: "8px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
    fontSize: "0.85rem",
    padding: "10px 14px",
  },
  labelStyle: { fontWeight: 700, color: "#121212", marginBottom: 4 },
  cursor:     { fill: "rgba(191,0,0,0.04)" },
};

// ── StatCard ──────────────────────────────────────────────────────────────────
type StatCardProps = {
  label: string;
  value: number;
  description: string;
  accent?: boolean;
  onClick?: () => void;
};

function StatCard({ label, value, description, accent = false, onClick }: StatCardProps) {
  const clickable = Boolean(onClick);
  return (
    <button
      type="button"
      className={[
        "db-stat-card",
        accent   ? "db-stat-card--accent"    : "",
        clickable ? "db-stat-card--clickable" : "",
      ].filter(Boolean).join(" ")}
      onClick={onClick}
      aria-label={`${label}: ${value}. ${description}`}
    >
      <span className="db-stat-value">{value.toLocaleString("pt-BR")}</span>
      <span className="db-stat-label">{label}</span>
      <span className="db-stat-desc">{description}</span>
      {clickable && <span className="db-stat-cta" aria-hidden="true">Ver detalhes →</span>}
    </button>
  );
}

// ── EmptyState ────────────────────────────────────────────────────────────────
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

// ── ChartCard ─────────────────────────────────────────────────────────────────
type ChartCardProps = {
  title: string;
  subtitle: string;
  wide?: boolean;
  tall?: boolean;
  headerRight?: React.ReactNode;
  children: React.ReactNode;
};

function ChartCard({ title, subtitle, wide, tall, headerRight, children }: ChartCardProps) {
  const areaHeight = tall ? 280 : 240;
  return (
    <div className={["db-chart-card", wide ? "db-chart-card--wide" : ""].filter(Boolean).join(" ")}>
      <div className="db-chart-head">
        <div>
          <h3 className="db-chart-title">{title}</h3>
          <p className="db-chart-sub">{subtitle}</p>
        </div>
        {headerRight && <div className="db-chart-controls">{headerRight}</div>}
      </div>
      <div style={{ width: "100%", height: areaHeight, position: "relative" }}>
        {children}
      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export function Dashboard({ user, onTabChange, onNavigateToChat }: DashboardProps) {
  const [stats,     setStats]     = useState<DashboardStats | null>(null);
  const [loading,   setLoading]   = useState<boolean>(true);
  const [error,     setError]     = useState<string | null>(null);
  const [period,    setPeriod]    = useState<Period>("all");
  const [chartType, setChartType] = useState<ChartType>("bar");

  useEffect(() => {
    const ctrl = new AbortController();
    const fetch = async () => {
      try {
        const data = await dashboardService.getStats(period);
        if (!ctrl.signal.aborted) { setStats(data); setError(null); }
      } catch (err) {
        if (!ctrl.signal.aborted)
          setError(err instanceof Error ? err.message : "Erro ao carregar dados.");
      } finally {
        if (!ctrl.signal.aborted) setLoading(false);
      }
    };
    void fetch();
    return () => { ctrl.abort(); };
  }, [period]);

  const changePeriod = (p: Period) => { setLoading(true); setError(null); setPeriod(p); };

  const safeChart = (stats?.chartData ?? [])
    .filter((d) => d !== null && d !== undefined)
    .map((d) => ({
      ...d,
      questions: typeof d.questions === "number" ? d.questions : Number(d.questions) || 0,
    }));
  
  const safePie = (stats?.pieData ?? [])
    .filter((d) => d !== null && d !== undefined)
    .map((d) => ({
      ...d,
      value: typeof d.value === "number" ? d.value : Number(d.value) || 0,
    }))
    .filter((d) => d.value > 0); 
  
  const safeTopQ = (stats?.topQuestionsData ?? [])
    .filter((d) => d !== null && d !== undefined)
    .map((d) => ({
      ...d,
      count: typeof d.count === "number" ? d.count : Number(d.count) || 0,
    }));
  
  const safeEmails = (stats?.emailsData ?? [])
    .filter((d) => d !== null && d !== undefined)
    .map((d) => ({
      ...d,
      count: typeof d.count === "number" ? d.count : Number(d.count) || 0,
    }));

  const has = {
    chart:  safeChart.length  > 0,
    pie:    safePie.length    > 0,
    topQ:   safeTopQ.length   > 0,
    emails: safeEmails.length > 0,
  };

  return (
    <section className="db-shell" aria-label="Painel de métricas">
      <div className="db-toolbar">
        <div className="db-toolbar-left">
          <button
            type="button"
            className="db-btn-ghost"
            onClick={onNavigateToChat}
          >
            ← Chat
          </button>
          <div className="db-toolbar-info">
            <strong className="db-toolbar-title">Métricas</strong>
            {user && <span className="db-toolbar-user">{user.name} · {user.role}</span>}
          </div>
        </div>

        <div className="db-toolbar-right">
          <label htmlFor="db-period" className="db-sr-only">Período</label>
          <select
            id="db-period"
            className="db-select"
            value={period}
            onChange={(e) => changePeriod(e.target.value as Period)}
          >
            <option value="all">Todo o período</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="7d">Últimos 7 dias</option>
          </select>
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
          <div className="db-kpi-grid" role="list" aria-label="Indicadores">
            <div role="listitem">
              <StatCard label="Usuários" value={stats.summary.totalUsers} description="Administradores e secretaria" accent />
            </div>
            <div role="listitem">
              <StatCard label="Dúvidas Pendentes" value={stats.summary.pendingQuestions} description="Aguardando resposta" onClick={() => onTabChange("duvidas")} />
            </div>
            <div role="listitem">
              <StatCard label="Dúvidas Resolvidas" value={stats.summary.resolvedQuestions} description="Respondidas no período" onClick={() => onTabChange("duvidas")} />
            </div>
          </div>

          <div className="db-charts-grid">
            <ChartCard title="Volume de Dúvidas" subtitle="Envios por dia no período" headerRight={
                <div className="db-toggle-group" role="group" aria-label="Tipo de gráfico">
                  <button type="button" className={`db-toggle-btn ${chartType === "bar" ? "db-toggle-btn--active" : ""}`} onClick={() => setChartType("bar")} aria-pressed={chartType === "bar"} title="Gráfico de barras">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
                      <rect x="0" y="4" width="3" height="10" rx="1" />
                      <rect x="4" y="1" width="3" height="13" rx="1" />
                      <rect x="8" y="5" width="3" height="9" rx="1" />
                      <rect x="12" y="2" width="2" height="12" rx="1" />
                    </svg>
                  </button>
                  <button type="button" className={`db-toggle-btn ${chartType === "line" ? "db-toggle-btn--active" : ""}`} onClick={() => setChartType("line")} aria-pressed={chartType === "line"} title="Gráfico de linha">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <polyline points="1,11 4,6 7,8 10,3 13,5" />
                    </svg>
                  </button>
                </div>
              }
            >
              {has.chart ? (
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === "bar" ? (
                    <BarChart data={safeChart} margin={{ top: 4, right: 8, left: -12, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                      <XAxis dataKey="day" tick={{ fill: "#888", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis allowDecimals={false} tick={{ fill: "#888", fontSize: 11 }} axisLine={false} tickLine={false} width={24} />
                      <Tooltip {...TT} formatter={(v: number) => [v, "Dúvidas"]} />
                      <Bar dataKey="questions" fill={BAR_COLOR} radius={[4, 4, 0, 0]} maxBarSize={44} isAnimationActive={false} />
                    </BarChart>
                  ) : (
                    <LineChart data={safeChart} margin={{ top: 4, right: 8, left: -12, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                      <XAxis dataKey="day" tick={{ fill: "#888", fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis allowDecimals={false} tick={{ fill: "#888", fontSize: 11 }} axisLine={false} tickLine={false} width={24} />
                      <Tooltip {...TT} formatter={(v: number) => [v, "Dúvidas"]} />
                      <Line type="monotone" dataKey="questions" stroke={LINE_COLOR} strokeWidth={2.5} dot={{ fill: LINE_COLOR, r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} isAnimationActive={false} />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              ) : (
                <EmptyState />
              )}
            </ChartCard>

            <ChartCard title="Status das Dúvidas" subtitle="Abertas × Resolvidas">
              {has.pie ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                    <Pie
                      data={safePie}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={safePie.length > 1 ? 3 : 0}
                      isAnimationActive={false}
                    >
                      {safePie.map((_e, i) => (
                        <Cell key={`pc-${i}`} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend iconType="circle" iconSize={8} verticalAlign="bottom" height={36} formatter={(v: string) => <span style={{ color: "#555", fontSize: "0.8rem", fontWeight: 600 }}>{v}</span>} />
                    <Tooltip contentStyle={TT.contentStyle} formatter={(v: number) => [v, "dúvidas"]} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState />
              )}
            </ChartCard>

            <ChartCard title="Top 5 Perguntas do Chatbot" subtitle="Opções mais acessadas pelos usuários" wide tall>
              {has.topQ ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={safeTopQ} layout="vertical" margin={{ top: 4, right: 20, left: 150, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" horizontal={false} />
                    <XAxis type="number" allowDecimals={false} tick={{ fill: "#888", fontSize: 11 }} axisLine={false} tickLine={false} />
                    {/* CORREÇÃO DO BUG: Proteção para evitar erro de string no formatador */}
                    <YAxis type="category" dataKey="title" width={140} tick={{ fill: "#444", fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} tickFormatter={(v: unknown) => (typeof v === "string" && v.length > 26 ? v.slice(0, 26) + "…" : String(v))} />
                    <Tooltip {...TT} formatter={(v: number) => [v, "acessos"]} />
                    <Bar dataKey="count" fill={TOP_COLOR} barSize={32} radius={[0, 4, 4, 0]} isAnimationActive={false} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState message="Nenhuma interação com o chatbot registrada ainda." />
              )}
            </ChartCard>

            <ChartCard title="E-mails Enviados" subtitle="Volume de disparos por dia">
              {has.emails ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={safeEmails} margin={{ top: 4, right: 8, left: -12, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                    <XAxis dataKey="day" tick={{ fill: "#888", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fill: "#888", fontSize: 11 }} axisLine={false} tickLine={false} width={24} />
                    <Tooltip {...TT} formatter={(v: number) => [v, "e-mails"]} />
                    <Bar dataKey="count" fill={EMAIL_COLOR} radius={[4, 4, 0, 0]} maxBarSize={44} isAnimationActive={false} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState message="Integração de e-mail não configurada ainda (Issue #2)." />
              )}
            </ChartCard>
          </div>
        </>
      )}
    </section>
  );
}