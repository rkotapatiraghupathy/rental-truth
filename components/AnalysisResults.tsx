"use client";
import { useState } from "react";
import type { AnalysisResult } from "@/lib/types";
import FlagCard from "./FlagCard";

const RISK_COLOURS: Record<string, { bg: string; text: string; border: string; label: string }> = {
  LOW:      { bg: "#e8f5e9", text: "#1b5e20", border: "#a5d6a7", label: "Low Risk" },
  MEDIUM:   { bg: "#fff8e1", text: "#b45309", border: "#fcd34d", label: "Some Restrictions" },
  HIGH:     { bg: "#fff3e0", text: "#bf360c", border: "#ffab91", label: "High Risk" },
  CRITICAL: { bg: "#ffebee", text: "#b71c1c", border: "#ef9a9a", label: "Critical — Read Before Booking" },
  UNKNOWN:  { bg: "#f3f4f6", text: "#6b7280", border: "#d1d5db", label: "Insufficient Information" },
};

const TRANSP_COLOURS: Record<string, { bg: string; text: string; border: string; label: string }> = {
  TRANSPARENT: { bg: "#e8f5e9", text: "#1b5e20", border: "#a5d6a7", label: "Clearly Disclosed" },
  PARTIAL:     { bg: "#fff8e1", text: "#b45309", border: "#fcd34d", label: "Partially Disclosed" },
  POOR:        { bg: "#fff3e0", text: "#bf360c", border: "#ffab91", label: "Poorly Disclosed" },
  MISLEADING:  { bg: "#ffebee", text: "#b71c1c", border: "#ef9a9a", label: "Misleading — Key Terms Hidden" },
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: "#6b7280", margin: "24px 0 10px" }}>
      {children}
    </div>
  );
}

export default function AnalysisResults({ result }: { result: AnalysisResult }) {
  const [showLetter, setShowLetter] = useState(false);
  const [copied, setCopied] = useState(false);
  const { terms, booking, complaintLetter } = result;

  const rc = RISK_COLOURS[terms.riskLevel] || RISK_COLOURS.UNKNOWN;
  const tc = booking ? (TRANSP_COLOURS[booking.transparencyLevel] || TRANSP_COLOURS.POOR) : null;

  const redFlags = terms.flags.filter(f => f.severity === "red");
  const hasGap = booking && booking.hidden.length > 0 && redFlags.length > 0;

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

      {/* Action bar */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" as const }}>
        <button onClick={downloadReport} style={{ background: "#1a1a2e", color: "#fff", border: "none", borderRadius: 8, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          📄 Download Report
        </button>
        {complaintLetter && (
          <button onClick={() => setShowLetter(!showLetter)} style={{ background: "#e63946", color: "#fff", border: "none", borderRadius: 8, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            ✉️ {showLetter ? "Hide" : "View"} Complaint Letter
          </button>
        )}
      </div>

      {/* Layer 1: Risk banner */}
      <SectionLabel>Layer 1 — Booking Terms Analysis</SectionLabel>
      <div style={{ background: rc.bg, border: `2px solid ${rc.border}`, borderRadius: 12, padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: rc.text, marginBottom: 5 }}>{rc.label}</div>
          <p style={{ margin: 0, fontSize: 14, color: "#1f2937", lineHeight: 1.55 }}>{terms.summary}</p>
          {terms.topWarning && (
            <p style={{ margin: "8px 0 0", fontSize: 13, fontWeight: 600, color: rc.text }}>⚡ {terms.topWarning}</p>
          )}
        </div>
        {terms.riskScore != null && (
          <div style={{ textAlign: "center" as const, flexShrink: 0, marginLeft: 20 }}>
            <div style={{ fontSize: 38, fontWeight: 900, color: rc.text, lineHeight: 1 }}>{terms.riskScore}</div>
            <div style={{ fontSize: 10, color: rc.text, fontWeight: 700, textTransform: "uppercase" as const, marginTop: 2 }}>Risk Score</div>
          </div>
        )}
      </div>

      {/* Flags */}
      {terms.flags.length > 0 && (
        <>
          <SectionLabel>Restrictions Found ({terms.flags.length})</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
            {terms.flags.map((flag, i) => <FlagCard key={i} flag={flag} />)}
          </div>
        </>
      )}

      {/* Layer 2: Booking page */}
      {booking && tc && (
        <>
          <SectionLabel>Layer 2 — Booking Page Transparency</SectionLabel>
          <div style={{ background: tc.bg, border: `2px solid ${tc.border}`, borderRadius: 12, padding: "18px 20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: tc.text, marginBottom: 5 }}>{tc.label}</div>
              <p style={{ margin: 0, fontSize: 14, color: "#1f2937", lineHeight: 1.55 }}>{booking.summary}</p>
            </div>
            {booking.transparencyScore != null && (
              <div style={{ textAlign: "center" as const, flexShrink: 0, marginLeft: 20 }}>
                <div style={{ fontSize: 38, fontWeight: 900, color: tc.text, lineHeight: 1 }}>{booking.transparencyScore}</div>
                <div style={{ fontSize: 10, color: tc.text, fontWeight: 700, textTransform: "uppercase" as const, marginTop: 2 }}>Transparency</div>
              </div>
            )}
          </div>

          {booking.hidden.length > 0 && (
            <>
              <SectionLabel>Hidden Before Payment ({booking.hidden.length})</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
                {booking.hidden.map((h, i) => (
                  <div key={i} style={{ background: "#fff1f2", border: "1.5px solid #fecdd3", borderRadius: 10, padding: "12px 16px" }}>
                    <div style={{ display: "flex", gap: 10 }}>
                      <span style={{ fontSize: 16 }}>🚫</span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#881337", marginBottom: 3 }}>{h.item}</div>
                        <p style={{ margin: 0, fontSize: 13, color: "#374151", lineHeight: 1.5 }}>{h.concern}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {booking.disclosed.length > 0 && (
            <>
              <SectionLabel>Disclosed on Booking Page ({booking.disclosed.length})</SectionLabel>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: 6 }}>
                {booking.disclosed.map((d, i) => (
                  <div key={i} style={{ background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: 10, padding: "10px 16px", display: "flex", gap: 10, alignItems: "center" }}>
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

      {/* Disclosure gap / consumer rights panel */}
      {hasGap && (
        <div style={{ background: "#fdf4ff", border: "2px solid #e879f9", borderRadius: 12, padding: "18px 20px", marginTop: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: "#86198f", marginBottom: 6 }}>
            ⚖️ Disclosure Gap — Your Consumer Rights Argument
          </div>
          <p style={{ margin: "0 0 10px", fontSize: 14, color: "#1f2937", lineHeight: 1.55 }}>
            The terms contain <strong>{redFlags.length} critical restriction{redFlags.length !== 1 ? "s" : ""}</strong> that could result in denial of service. The booking page shows <strong>{booking!.hidden.length} of these were not clearly disclosed</strong> before payment.
          </p>
          <p style={{ margin: 0, fontSize: 13, color: "#86198f", fontWeight: 600 }}>
            Under UK Consumer Rights Act 2015, significant terms must be transparent and prominent. Hidden critical terms may be unenforceable — this is your basis for a chargeback or formal complaint.
          </p>
        </div>
      )}

      {/* Complaint letter */}
      {complaintLetter && showLetter && (
        <div style={{ marginTop: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <SectionLabel>Draft Complaint Letter</SectionLabel>
            <button onClick={copyLetter} style={{ fontSize: 12, fontWeight: 600, color: "#e63946", background: "none", border: "none", cursor: "pointer" }}>
              {copied ? "✓ Copied!" : "Copy to clipboard"}
            </button>
          </div>
          <div style={{ background: "#f8f7f4", border: "1px solid #e2e8f0", borderRadius: 10, padding: "20px", fontSize: 13, lineHeight: 1.8, whiteSpace: "pre-wrap" as const, fontFamily: "Georgia, serif", color: "#1f2937" }}>
            {complaintLetter}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div style={{ marginTop: 28, padding: "12px 16px", background: "#f1f5f9", borderRadius: 8, fontSize: 11, color: "#64748b", lineHeight: 1.6 }}>
        <strong style={{ color: "#374151" }}>RentalTruth</strong> is a consumer transparency tool. This analysis is for informational purposes only and does not constitute legal advice. Always verify restrictions directly with your rental provider before travelling.
      </div>
    </div>
  );
}
