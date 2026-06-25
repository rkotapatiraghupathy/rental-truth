export type Severity = "green" | "amber" | "red";
export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" | "UNKNOWN";
export type TransparencyLevel = "TRANSPARENT" | "PARTIAL" | "POOR" | "MISLEADING";
export type Likelihood = "certain" | "likely" | "possible";

export interface Flag {
  severity: Severity;
  category: string;
  title: string;
  detail: string;
  worstCase?: string;
  industryContext?: string;
  consumerAction?: string;
  quote: string | null;
}

export interface HiddenCostItem {
  item: string;
  estimatedAmount: string;
  likelihood: Likelihood;
}

export interface GoNoGoItem {
  item: string;
  result: boolean;
  detail: string;
}

export interface TermsResult {
  riskScore: number | null;
  riskLevel: RiskLevel;
  verdict: string;
  summary: string;
  topWarning: string | null;
  benchmarkContext: string | null;
  advertisedPrice: number | null;
  estimatedTrueCost: number | null;
  hiddenCostBreakdown: HiddenCostItem[];
  goNoGoChecklist: GoNoGoItem[];
  deskSurvivalKit: string[];
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
