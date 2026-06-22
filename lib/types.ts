export type Severity = "green" | "amber" | "red";
export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | "UNKNOWN";
export type TransparencyLevel = "TRANSPARENT" | "PARTIAL" | "POOR" | "MISLEADING";

export interface Flag {
  severity: Severity;
  category: string;
  title: string;
  detail: string;
  harmLikelihood?: number;
  worstCase?: string;
  industryContext?: string;
  consumerAction?: string;
  quote: string | null;
}

export interface TermsResult {
  riskScore: number | null;
  riskLevel: RiskLevel;
  summary: string;
  topWarning: string | null;
  benchmarkContext?: string;
  flags: Flag[];
}

export interface DisclosedItem {
  item: string;
  howShown: string;
}

export interface HiddenItem {
  item: string;
  concern: string;
}

export interface BookingPageResult {
  transparencyScore: number | null;
  transparencyLevel: TransparencyLevel;
  summary: string;
  disclosed: DisclosedItem[];
  hidden: HiddenItem[];
}

export interface AnalysisResult {
  terms: TermsResult;
  booking?: BookingPageResult;
  complaintLetter?: string;
  analysedAt: string;
}
