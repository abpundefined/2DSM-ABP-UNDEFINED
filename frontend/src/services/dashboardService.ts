import { apiRequest } from "./apiClient";

export type Period = "7d" | "30d" | "all";

export type DashboardSummary = {
  totalUsers: number;
  pendingQuestions: number;
  resolvedQuestions: number;
};

export type ChartDataPoint = {
  day: string;
  questions: number;
};

export type PieDataPoint = {
  name: string;
  value: number;
};

export type TopQuestionPoint = {
  title: string;
  count: number;
};

export type EmailDataPoint = {
  day: string;
  count: number;
};

export type DashboardStats = {
  summary: DashboardSummary;
  chartData: ChartDataPoint[];
  pieData: PieDataPoint[];
  topQuestionsData: TopQuestionPoint[];
  emailsData: EmailDataPoint[];
};

export const dashboardService = {
  getStats(period: Period = "all"): Promise<DashboardStats> {
    return apiRequest<DashboardStats>(
      `/admin/dashboard/stats?period=${period}`,
      { method: "GET", auth: true },
    );
  },
};
