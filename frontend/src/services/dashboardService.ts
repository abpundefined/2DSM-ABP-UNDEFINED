import { apiRequest } from "./apiClient";

export type Period = "7d" | "30d" | "all";

export type DashboardSummary = {
  totalUsers: number;
  pendingQuestions: number;
  resolvedQuestions: number;
  totalSessions?: number;
  answeredAutomatically?: number;
  satisfactionRate?: number;
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
  courseData?: PieDataPoint[];
  unresolvedSubjectsData?: TopQuestionPoint[];
};

export const dashboardService = {
  getStats(period: Period = "all") {
    return apiRequest<DashboardStats>(
      `/admin/dashboard/stats?period=${period}`,
      { method: "GET", auth: true },
    );
  },
};
