// types/reports.ts
export interface ReportFilters {
  reportType: 'Planilha de despesas' | 'Planilha de receitas';
  account: string;
  analysisBy: 'Data do movimento' | 'Data de vencimento';
  situation: 'Todas' | 'Em aberto' | 'Realizadas';
  startDate: string; // formato DD/MM/AAAA
  endDate: string;   // formato DD/MM/AAAA
  includeTransfers: boolean;
}

export interface ReportItem {
  name: string;
  monthlyValues: number[];
  total: number;
}

export interface ReportCategory {
  category: string;
  items: ReportItem[];
}

export interface ReportData {
  expenses: ReportCategory[];
  months: string[];
  monthlyTotals: number[];
  totalGeneral: number;
  period: string;
  situation: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp?: string;
}

export interface ReportRequest extends ReportFilters {
  // Propriedades adicionais podem ser adicionadas aqui
}

export interface ReportResponse extends ApiResponse {
  data?: ReportData;
}

export interface DateValidation {
  isValid: boolean;
  error?: string;
  monthsCount?: number;
}

export interface HealthCheckResponse {
  status: 'OK' | 'ERROR';
  uptime: number;
  timestamp: string;
  version?: string;
}

// Tipos para validação de entrada
export type DateString = string; // DD/MM/AAAA format

export interface DateRange {
  start: Date;
  end: Date;
  monthsCount: number;
}

// Enums para valores fixos
export enum ReportType {
  DESPESAS = 'Planilha de despesas',
  RECEITAS = 'Planilha de receitas'
}

export enum AnalysisType {
  DATA_MOVIMENTO = 'Data do movimento',
  DATA_VENCIMENTO = 'Data de vencimento'
}

export enum SituationType {
  TODAS = 'Todas',
  EM_ABERTO = 'Em aberto',
  REALIZADAS = 'Realizadas'
}

// Tipos utilitários
export type MonthYear = `${string}/${number}`; // formato "Jan/2024"

export interface MonthData {
  month: MonthYear;
  value: number;
}

// Tipos para extensibilidade futura
export interface ReportMetadata {
  generatedAt: string;
  generatedBy?: string;
  filters: ReportFilters;
  recordCount: number;
}

export interface ExtendedReportData extends ReportData {
  metadata: ReportMetadata;
}

// Tipos para controladores
export interface ReportController {
  generateReport(filters: ReportFilters): Promise<ReportData>;
  validatePeriod(startDate: string, endDate: string): DateValidation;
  calculateTotals(categories: ReportCategory[]): number;
}

// Interface para serviços (se você expandir para usar banco de dados)
export interface ReportService {
  fetchExpenseData(filters: ReportFilters): Promise<ReportCategory[]>;
  fetchRevenueData(filters: ReportFilters): Promise<ReportCategory[]>;
  calculateMonthlyTotals(data: ReportCategory[], monthsCount: number): number[];
}