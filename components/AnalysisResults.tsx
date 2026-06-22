"use client";
import { useState } from "react";
import type { AnalysisResult } from "@/lib/types";
import FlagCard from "./FlagCard";

const RISK_COLOURS: Record<string, { bg: string; text: string; border: string; label: string; emoji: string }> = {
  LOW:      { bg: "#e8f5e9", text: "#1b5e20", border: "#a5d6a7", label: "Low Risk",                      emoji: "🟢" },
  MEDIUM:   { bg: "#fff8e1", text: "#b45309", border: "#fcd34d", label: "Some Restrictions",              emoji: "🟡" },
  HIGH:     { bg: "#fff3e0", text: "#bf360c", border: "#ffab91", label: "High Risk",                      emoji: "🔴" },
  CRITICAL: { bg: "#ffebee", text: "#b71c1c", border: "#ef9a9a", label: "Critical — Read Before Booking", emoji: "🚨" },
  UNKNOWN:  { bg: "#f3f4f6", text: "#6b7280", border: "#d1d5db", label: "Insufficient Information",       emoji: "⚪" },
};

const TRANSP_COLOURS: Record<string, { bg: string; text: string; border: string; label: string }> = {
  TRANSPARENT: { bg: "#e8f5e9", text: "#1b5e20", border: "#a5d6a7", label: "Clearly Disclosed" },
  PARTIAL:     { bg: "#fff8e1", text: "#b45309", border: "#fcd34d", label: "Partially Disclosed" },
  POOR:        { bg: "#fff3e0", text: "#bf360c", border: "#ffab91", label: "Poorly Disclosed" },
  MISLEADING:  { bg: "#ffebee", text: "#b71c1c", border: "#ef9a9a", label: "Misleading — Key Terms Hidden" },
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: "#6b7280", margin: "28px 0 12px" }}>
      {children}
    </div>
  );
}

function ScoreGauge({ score, color }: { score: number; color: string }) {
  const r = 52, cx = 68, cy = 72;
  const circ = Math.PI * r;
  const filled = (score / 100) * circ;
  const d = `M ${cx - r} ${cy} A ${r} ${r} 0 0 0 ${cx + r} ${cy}`;
  return (
    <svg width="136" height="80" viewBox="0 0 136 80" style={{ overflow: "visible" }}>
      <path d={d} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="12" strokeLinecap="round" />
      <path d={d} fill="none" stroke={color} strokeWidth="12" strokeLinecap="round"
        strokeDasharray={`${filled} ${circ}`} />
      <text x={cx} y={48} textAnchor="middle" fill={color} fontSize="26" fontWeight="900" fontFamily="system-ui,sans-serif">{score}</text>
      <text x={cx} y={63} textAnchor="middle" fill={color} fontSize="9" fontWeight="700" fontFamily="system-ui,sans-serif">RISK SCORE</text>
    </svg>
  );
}

export default function AnalysisResults({ result }: { result: AnalysisResult }) {
  const [showLetter, setShowLetter] = useState(false);
  const [copied, setCopied] = useState(false);
  const { terms, booking, complaintLetter, analysedAt } = result;

  const rc = RISK_COLOURS[terms.riskLevel] || RISK_COLOURS.UNKNOWN;
  const tc = booking ? (TRANSP_COLOURS[booking.transparencyLevel] || TRANSP_COLOURS.POOR) : null;

  const redFlags   = terms.flags.filter(f => f.severity === "red");
  const amberFlags = terms.flags.filter(f => f.severity === "amber");
  const greenFlags = terms.flags.filter(f => f.severity === "green");
  const hasGap = booking && booking.hidden.length > 0 && redFlags.length > 0;

  const letterDate = new Date(analysedAt).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });

  async function downloadReport() {
    const res = await fetch("/api/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result),
    });
    const html = await res.text();
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rentaltruth-report-${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function copyLetter() {
    if (complaintLetter) {
      await navigator.clipboard.writeText(complaintLetter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="animate-fade-in">

      {/* Summary counts card */}
      {terms.flags.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" as const, padding: "16px 20px", background: "#1a1a2e", borderRadius: 12, marginBottom: 20 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", marginRight: 4 }}>Summary</span>
          {redFlags.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(230,57,70,0.12)", border: "1px solid rgba(230,57,70,0.25)", borderRadius: 8, padding: "6px 12px" }}>
              <span style={{ fontSize: 15 }}>🚫</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: "#e63946" }}>{redFlags.length}</span>
              <span style={{ fontSize: 12, color: "#94a3b8" }}>Critical</span>
            </div>
          )}
          {amberFlags.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 8, padding: "6px 12px" }}>
              <span style={{ fontSize: 15 }}>⚠️</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: "#f59e0b" }}>{amberFlags.length}</span>
              <span style={{ fontSize: 12, color: "#94a3b8" }}>Warnings</span>
            </div>
          )}
          {greenFlags.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(22,163,74,0.1)", border: "1px solid rgba(22,163,74,0.2)", borderRadius: 8, padding: "6px 12px" }}>
              <span style={{ fontSize: 15 }}>✅</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: "#16a34a" }}>{greenFlags.length}</span>
              <span style={{ fontSize: 12, color: "#94a3b8" }}>OK</span>
            </div>
          )}
        </div>
      )}

      {/* Financial Risk Exposure */}
      {terms.flags.some(f => f.worstCase) && (
        <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderLeft: "4px solid #e63946", borderRadius: 12, padding: "18px 20px", marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: "#e63946", marginBottom: 12 }}>
            💸 Financial Risk Exposure
          </div>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
            {terms.flags.filter(f => f.worstCase).map((f, i) => (
              <div key={i} style={{ display: "flex", gap: 8, fontSize: 13, alignItems: "flex-start" }}>
                <span style={{ flexShrink: 0 }}>{f.severity === "red" ? "🚫" : f.severity === "amber" ? "⚠️" : "✅"}</span>
                <span style={{ color: "#374151", lineHeight: 1.5 }}>
                  <strong style={{ color: "#1a1a2e" }}>{f.title}:</strong> {f.worstCase}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action bar */}
      <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" as const }}>
        <button onClick={downloadReport} style={{ background: "#e63946", color: "#fff", border: "none", borderRadius: 10, padding: "13px 24px", fontSize: 15, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 14px rgba(230,57,70,0.35)" }}>
          📥 Download Full Report
        </button>
        {complaintLetter && (
          <button onClick={() => setShowLetter(!showLetter)} style={{ background: "#1a1a2e", color: "#fff", border: "1.5px solid #2d3748", borderRadius: 10, padding: "13px 24px", fontSize: 15, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
            ✉️ {showLetter ? "Hide" : "View"} Complaint Letter
          </button>
        )}
      </div>

      {/* Layer 1: Risk banner with gauge */}
      <SectionLabel>Layer 1 — Booking Terms Analysis</SectionLabel>
      <div style={{ background: rc.bg, border: `2px solid ${rc.border}`, borderRadius: 14, padding: "24px 28px", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" as const }}>
          {terms.riskScore != null && (
            <div style={{ flexShrink: 0 }}>
              <ScoreGauge score={terms.riskScore} color={rc.text} />
            </div>
          )}
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 36, lineHeight: 1 }}>{rc.emoji}</span>
              <span style={{ fontSize: 16, fontWeight: 800, color: rc.text }}>{rc.label}</span>
            </div>
            <p style={{ margin: 0, fontSize: 14, color: "#1f2937", lineHeight: 1.65 }}>{terms.summary}</p>
            {terms.topWarning && (
              <p style={{ margin: "12px 0 0", fontSize: 13, fontWeight: 700, color: rc.text, padding: "8px 14px", background: "rgba(0,0,0,0.05)", borderRadius: 8, borderLeft: `3px solid ${rc.text}` }}>
                ⚡ {terms.topWarning}
              </p>
            )}
            {terms.benchmarkContext && (
              <p style={{ margin: "10px 0 0", fontSize: 12, color: "#6b7280", fontStyle: "italic", lineHeight: 1.55 }}>
                📊 {terms.benchmarkContext}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Flags */}
      {terms.flags.length > 0 && (
        <>
          <SectionLabel>🔍 Restrictions Found ({terms.flags.length})</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
            {terms.flags.map((flag, i) => <FlagCard key={i} flag={flag} />)}
          </div>
        </>
      )}

      {/* Layer 2: Booking page */}
      {booking && tc && (
        <>
          <SectionLabel>Layer 2 — Booking Page Transparency</SectionLabel>
          <div style={{ background: tc.bg, border: `2px solid ${tc.border}`, borderRadius: 14, padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: tc.text, marginBottom: 6 }}>{tc.label}</div>
              <p style={{ margin: 0, fontSize: 14, color: "#1f2937", lineHeight: 1.65 }}>{booking.summary}</p>
            </div>
            {booking.transparencyScore != null && (
              <div style={{ textAlign: "center" as const, flexShrink: 0, marginLeft: 24 }}>
                <div style={{ fontSize: 42, fontWeight: 900, color: tc.text, lineHeight: 1 }}>{booking.transparencyScore}</div>
                <div style={{ fontSize: 10, color: tc.text, fontWeight: 700, textTransform: "uppercase" as const, marginTop: 3 }}>Transparency</div>
              </div>
            )}
          </div>

          {booking.hidden.length > 0 && (
            <>
              <SectionLabel>👁️ Hidden Before Payment ({booking.hidden.length})</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
                {booking.hidden.map((h, i) => (
                  <div key={i} style={{ background: "#fff1f2", border: "1.5px solid #fecdd3", borderLeft: "4px solid #e63946", borderRadius: 10, padding: "14px 16px" }}>
                    <div style={{ display: "flex", gap: 10 }}>
                      <span style={{ fontSize: 20 }}>🚫</span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#881337", marginBottom: 4 }}>{h.item}</div>
                        <p style={{ margin: 0, fontSize: 13, color: "#374151", lineHeight: 1.55 }}>{h.concern}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {booking.disclosed.length > 0 && (
            <>
              <SectionLabel>✅ Disclosed on Booking Page ({booking.disclosed.length})</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 6 }}>
                {booking.disclosed.map((d, i) => (
                  <div key={i} style={{ background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderLeft: "4px solid #16a34a", borderRadius: 10, padding: "10px 16px", display: "flex", gap: 10, alignItems: "center" }}>
                    <span>✅</span>
                    <div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#14532d" }}>{d.item}</span>
                      {d.howShown && <span style={{ fontSize: 12, color: "#6b7280", marginLeft: 8 }}>— {d.howShown}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* Disclosure gap */}
      {hasGap && (
        <div style={{ background: "#fdf4ff", border: "2px solid #e879f9", borderRadius: 12, padding: "20px 24px", marginTop: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: "#86198f", marginBottom: 8 }}>
            ⚖️ Disclosure Gap — Your Consumer Rights Argument
          </div>
          <p style={{ margin: "0 0 10px", fontSize: 14, color: "#1f2937", lineHeight: 1.65 }}>
            The terms contain <strong>{redFlags.length} critical restriction{redFlags.length !== 1 ? "s" : ""}</strong> that could result in denial of service. The booking page shows <strong>{booking!.hidden.length} of these were not clearly disclosed</strong> before payment.
          </p>
          <p style={{ margin: 0, fontSize: 13, color: "#86198f", fontWeight: 600 }}>
            Under UK Consumer Rights Act 2015, significant terms must be transparent and prominent. Hidden critical terms may be unenforceable — this is your basis for a chargeback or formal complaint.
          </p>
        </div>
      )}

      {/* Complaint letter — styled as actual letter */}
      {complaintLetter && showLetter && (
        <div style={{ marginTop: 24 }}>
          {/* Letterhead */}
          <div style={{ background: "#1a1a2e", borderRadius: "12px 12px 0 0", padding: "24px 32px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "3px solid #e63946" }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", letterSpacing: "-0.5px" }}>
                Rental<span style={{ color: "#e63946" }}>Truth</span>
              </div>
              <div style={{ fontSize: 11, color: "#475569", marginTop: 3 }}>rentaltruth.co.uk · Consumer Protection Tool</div>
            </div>
            <div style={{ textAlign: "right" as const }}>
              <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>{letterDate}</div>
              <button onClick={copyLetter} style={{ fontSize: 12, fontWeight: 700, color: "#e63946", background: "rgba(230,57,70,0.12)", border: "1px solid rgba(230,57,70,0.25)", borderRadius: 6, padding: "6px 14px", cursor: "pointer" }}>
                {copied ? "✓ Copied!" : "📋 Copy"}
              </button>
            </div>
          </div>
          {/* Letter body */}
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderTop: "none", borderRadius: "0 0 12px 12px", padding: "32px 36px", fontSize: 14, lineHeight: 1.95, whiteSpace: "pre-wrap" as const, fontFamily: "Georgia, 'Times New Roman', serif", color: "#1f2937", boxShadow: "inset 0 2px 12px rgba(0,0,0,0.03)" }}>
            {complaintLetter}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div style={{ marginTop: 32, padding: "12px 16px", background: "#f1f5f9", borderRadius: 8, fontSize: 11, color: "#64748b", lineHeight: 1.6 }}>
        <strong style={{ color: "#374151" }}>RentalTruth</strong> is a consumer transparency tool. This analysis is for informational purposes only and does not constitute legal advice. Always verify restrictions directly with your rental provider before travelling.
      </div>
    </div>
  );
}
