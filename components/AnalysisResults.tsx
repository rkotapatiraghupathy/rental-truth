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

const LIKELIHOOD_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  certain:  { bg: "#fee2e2", text: "#881337", label: "Certain" },
  likely:   { bg: "#fef3c7", text: "#92400e", label: "Likely" },
  possible: { bg: "#f1f5f9", text: "#475569", label: "Possible" },
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: "#6b7280", margin: "28px 0 12px" }}>
      {children}
    </div>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 16, fontWeight: 800, color: "#1a1a2e", margin: "28px 0 14px", letterSpacing: "-0.2px" }}>
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

  const redFlags = terms.flags.filter(f => f.severity === "red");
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

  function printLetter() {
    if (!complaintLetter) return;
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`<!DOCTYPE html><html><head><title>Complaint Letter — RentalTruth</title>
      <style>
        body { font-family: Georgia, 'Times New Roman', serif; font-size: 14px; line-height: 1.9; max-width: 680px; margin: 48px auto; padding: 0 32px; color: #1f2937; }
        pre { white-space: pre-wrap; font-family: inherit; }
        h2 { font-family: system-ui, sans-serif; }
        p.meta { font-family: system-ui, sans-serif; font-size: 12px; color: #6b7280; margin: 0 0 32px; }
        hr { border: none; border-top: 1px solid #e2e8f0; margin-bottom: 32px; }
        @media print { body { margin: 0; } }
      </style></head><body>
      <h2>RentalTruth — Draft Complaint Letter</h2>
      <p class="meta">Generated ${letterDate} · Fill in [PLACEHOLDER] fields before sending</p>
      <hr/>
      <pre>${complaintLetter.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
    </body></html>`);
    w.document.close();
    w.print();
  }

  return (
    <div className="animate-fade-in">

      {/* ── 1. VERDICT BANNER ── */}
      <div style={{ background: rc.bg, border: `2px solid ${rc.border}`, borderRadius: 14, padding: "28px 32px", marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 28, flexWrap: "wrap" as const }}>
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <span style={{ fontSize: 48, lineHeight: 1, flexShrink: 0 }}>{rc.emoji}</span>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: rc.text, marginBottom: 3 }}>RentalTruth Verdict</div>
                <div style={{ fontSize: 20, fontWeight: 900, color: rc.text, lineHeight: 1.2, letterSpacing: "-0.3px" }}>
                  {terms.verdict || rc.label}
                </div>
              </div>
            </div>
            <p style={{ margin: 0, fontSize: 14, color: "#1f2937", lineHeight: 1.65 }}>{terms.summary}</p>
            {terms.topWarning && (
              <p style={{ margin: "12px 0 0", fontSize: 13, fontWeight: 700, color: rc.text, padding: "9px 14px", background: "rgba(0,0,0,0.05)", borderRadius: 8, borderLeft: `3px solid ${rc.text}` }}>
                ⚡ {terms.topWarning}
              </p>
            )}
            {terms.benchmarkContext && (
              <p style={{ margin: "8px 0 0", fontSize: 12, color: "#6b7280", fontStyle: "italic", lineHeight: 1.55 }}>
                📊 {terms.benchmarkContext}
              </p>
            )}
          </div>
          {terms.riskScore != null && (
            <div style={{ flexShrink: 0 }}>
              <ScoreGauge score={terms.riskScore} color={rc.text} />
            </div>
          )}
        </div>
      </div>

      {/* ── 2. REAL COST CALCULATOR ── */}
      {(terms.advertisedPrice != null || (terms.hiddenCostBreakdown ?? []).length > 0) && (
        <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 12, overflow: "hidden", marginBottom: 20 }}>
          <div style={{ padding: "14px 20px", background: "#1a1a2e", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 16 }}>💰</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: "#fff", letterSpacing: "-0.1px" }}>Real Cost Calculator</span>
            <span style={{ fontSize: 11, color: "#475569", marginLeft: 4 }}>— what this booking may actually cost you</span>
          </div>
          <div>
            {terms.advertisedPrice != null && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 20px", borderBottom: "1px solid #f1f5f9" }}>
                <span style={{ fontSize: 14, color: "#374151", fontWeight: 600 }}>Advertised price</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: "#16a34a" }}>£{terms.advertisedPrice.toFixed(2)}</span>
              </div>
            )}
            {(terms.hiddenCostBreakdown ?? []).map((item, i) => {
              const ls = LIKELIHOOD_STYLE[item.likelihood] || LIKELIHOOD_STYLE.possible;
              return (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 20px", borderBottom: "1px solid #f1f5f9", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: ls.text, background: ls.bg, padding: "2px 7px", borderRadius: 20, textTransform: "uppercase" as const, letterSpacing: "0.04em", whiteSpace: "nowrap" as const, flexShrink: 0 }}>
                      {ls.label}
                    </span>
                    <span style={{ fontSize: 13, color: "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{item.item}</span>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: item.likelihood === "certain" ? "#c0303c" : item.likelihood === "likely" ? "#b45309" : "#6b7280", whiteSpace: "nowrap" as const, flexShrink: 0 }}>
                    + {item.estimatedAmount}
                  </span>
                </div>
              );
            })}
            {terms.estimatedTrueCost != null && (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", background: "#fff1f2", borderTop: "2px solid #fecdd3" }}>
                <span style={{ fontSize: 15, fontWeight: 800, color: "#1a1a2e" }}>Estimated True Cost</span>
                <span style={{ fontSize: 20, fontWeight: 900, color: "#c0303c" }}>£{terms.estimatedTrueCost.toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── 3. GO/NO-GO CHECKLIST ── */}
      {(terms.goNoGoChecklist ?? []).length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <SectionHeader>Should You Book This?</SectionHeader>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
            {(terms.goNoGoChecklist ?? []).map((check, i) => (
              <div key={i} style={{
                background: check.result ? "#f0fdf4" : "#fff1f2",
                border: `1.5px solid ${check.result ? "#bbf7d0" : "#fecdd3"}`,
                borderLeft: `4px solid ${check.result ? "#16a34a" : "#c0303c"}`,
                borderRadius: 10,
                padding: "12px 16px",
                display: "flex", gap: 12, alignItems: "flex-start",
              }}>
                <span style={{ fontSize: 22, flexShrink: 0, marginTop: 1 }}>{check.result ? "✅" : "❌"}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: check.result ? "#14532d" : "#881337" }}>{check.item}</div>
                  <div style={{ fontSize: 12, color: "#6b7280", marginTop: 3, lineHeight: 1.55 }}>{check.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 4. ACTION BAR ── */}
      <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" as const }}>
        <button onClick={downloadReport} style={{ background: "#c0303c", color: "#fff", border: "none", borderRadius: 10, padding: "13px 24px", fontSize: 15, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, boxShadow: "0 4px 14px rgba(230,57,70,0.35)" }}>
          📥 Download Full Report
        </button>
        {complaintLetter && (
          <button onClick={() => setShowLetter(!showLetter)} style={{ background: "#1a1a2e", color: "#fff", border: "1.5px solid #2d3748", borderRadius: 10, padding: "13px 24px", fontSize: 15, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
            ✉️ {showLetter ? "Hide" : "View"} Complaint Letter
          </button>
        )}
      </div>

      {/* ── 5. FLAGS ── */}
      {terms.flags.length > 0 && (
        <>
          <SectionLabel>🔍 Restrictions Found ({terms.flags.length})</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
            {terms.flags.map((flag, i) => <FlagCard key={i} flag={flag} />)}
          </div>
        </>
      )}

      {/* ── 6. DESK SURVIVAL KIT ── */}
      {["MEDIUM", "HIGH", "CRITICAL"].includes(terms.riskLevel) && (terms.deskSurvivalKit ?? []).length > 0 && (
        <div style={{ marginTop: 28 }}>
          <SectionHeader>🧳 Desk Survival Kit — if you decide to go ahead</SectionHeader>
          <p style={{ margin: "-10px 0 14px", fontSize: 12, color: "#6b7280" }}>Show this screen to the rental agent if challenged</p>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
            {(terms.deskSurvivalKit ?? []).map((tip, i) => (
              <div key={i} style={{ background: "#1a1a2e", borderRadius: 10, padding: "14px 18px", display: "flex", gap: 16, alignItems: "flex-start" }}>
                <span style={{ color: "#c0303c", fontWeight: 900, fontSize: 18, flexShrink: 0, lineHeight: 1.4, minWidth: 20 }}>{i + 1}</span>
                <span style={{ fontSize: 13, color: "#e2e8f0", lineHeight: 1.65 }}>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 7. LAYER 2: BOOKING PAGE TRANSPARENCY ── */}
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
                  <div key={i} style={{ background: "#fff1f2", border: "1.5px solid #fecdd3", borderLeft: "4px solid #c0303c", borderRadius: 10, padding: "14px 16px" }}>
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

      {/* ── 8. DISCLOSURE GAP ── */}
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

      {/* ── 9. COMPLAINT LETTER ── */}
      {complaintLetter && showLetter && (
        <div style={{ marginTop: 24 }}>
          <div style={{ background: "#1a1a2e", borderRadius: "12px 12px 0 0", padding: "20px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "3px solid #c0303c" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 22 }}>✉️</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>Draft Complaint Letter</div>
                <div style={{ fontSize: 11, color: "#475569" }}>Fill in the [PLACEHOLDER] fields before sending · {letterDate}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={copyLetter} style={{ fontSize: 12, fontWeight: 700, color: "#c0303c", background: "rgba(230,57,70,0.12)", border: "1px solid rgba(230,57,70,0.25)", borderRadius: 6, padding: "7px 14px", cursor: "pointer" }}>
                {copied ? "✓ Copied!" : "📋 Copy"}
              </button>
              <button onClick={printLetter} style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", background: "rgba(255,255,255,0.06)", border: "1px solid #2d3748", borderRadius: 6, padding: "7px 14px", cursor: "pointer" }}>
                🖨️ Print / PDF
              </button>
            </div>
          </div>
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderTop: "none", borderRadius: "0 0 12px 12px", padding: "32px 36px", fontSize: 14, lineHeight: 1.95, whiteSpace: "pre-wrap" as const, fontFamily: "Georgia, 'Times New Roman', serif", color: "#1f2937", boxShadow: "inset 0 2px 12px rgba(0,0,0,0.03)" }}>
            {complaintLetter}
          </div>
        </div>
      )}

      {/* ── 10. DISCLAIMER ── */}
      <div style={{ marginTop: 32, padding: "12px 16px", background: "#f1f5f9", borderRadius: 8, fontSize: 11, color: "#64748b", lineHeight: 1.6 }}>
        <strong style={{ color: "#374151" }}>RentalTruth</strong> is a consumer transparency tool. This analysis is for informational purposes only and does not constitute legal advice. Always verify restrictions directly with your rental provider before travelling.
      </div>
    </div>
  );
}
