"use client";
import type { Flag } from "@/lib/types";

const COLOURS = {
  green: { bg: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)", border: "#bbf7d0", leftBorder: "#16a34a", icon: "✅", text: "#14532d", badgeBg: "#dcfce7", badgeText: "#166534", pulse: "flag-pulse-green" },
  amber: { bg: "linear-gradient(135deg, #fffbeb 0%, #fef9c3 100%)", border: "#fde68a", leftBorder: "#f59e0b", icon: "⚠️", text: "#92400e", badgeBg: "#fef3c7", badgeText: "#92400e", pulse: "flag-pulse-amber" },
  red:   { bg: "linear-gradient(135deg, #fff1f2 0%, #fee2e2 100%)", border: "#fecdd3", leftBorder: "#e8501a", icon: "🚫", text: "#881337", badgeBg: "#fee2e2", badgeText: "#881337", pulse: "flag-pulse-red" },
};

export default function FlagCard({ flag }: { flag: Flag }) {
  const c = COLOURS[flag.severity] || COLOURS.amber;
  return (
    <div className={c.pulse} style={{ background: c.bg, border: `1.5px solid ${c.border}`, borderLeft: `4px solid ${c.leftBorder}`, borderRadius: 10, padding: "16px 18px" }}>
      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
        <span style={{ fontSize: 26, flexShrink: 0, marginTop: 1 }}>{c.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 6, alignItems: "flex-start" }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: c.text }}>{flag.title}</span>
            <span style={{ fontSize: 10, color: c.badgeText, fontWeight: 700, textTransform: "uppercase" as const, whiteSpace: "nowrap" as const, flexShrink: 0, background: c.badgeBg, padding: "3px 8px", borderRadius: 20, letterSpacing: "0.04em" }}>
              {flag.category}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: 13, color: "#374151", lineHeight: 1.6 }}>{flag.detail}</p>
          {flag.worstCase && (
            <div style={{ display: "flex", gap: 6, marginTop: 8, fontSize: 12, color: "#881337", lineHeight: 1.5, alignItems: "flex-start" }}>
              <span style={{ flexShrink: 0 }}>⚠️</span>
              <span><strong>Worst case:</strong> {flag.worstCase}</span>
            </div>
          )}
          {flag.industryContext && (
            <div style={{ display: "flex", gap: 6, marginTop: 5, fontSize: 12, color: "#64748b", lineHeight: 1.5, alignItems: "flex-start" }}>
              <span style={{ flexShrink: 0 }}>📊</span>
              <span><strong>Industry:</strong> {flag.industryContext}</span>
            </div>
          )}
          {flag.consumerAction && (
            <div style={{ display: "flex", gap: 6, marginTop: 5, fontSize: 12, color: "#1e40af", lineHeight: 1.5, alignItems: "flex-start" }}>
              <span style={{ flexShrink: 0 }}>✅</span>
              <span><strong>What to do:</strong> {flag.consumerAction}</span>
            </div>
          )}
          {flag.quote && (
            <blockquote style={{ margin: "10px 0 0", padding: "10px 14px 10px 28px", background: "rgba(255,255,255,0.7)", borderRadius: 8, borderLeft: `3px solid ${c.leftBorder}`, position: "relative" }}>
              <span style={{ position: "absolute", top: 0, left: 8, fontSize: 36, color: c.leftBorder, opacity: 0.35, lineHeight: 1, fontFamily: "Georgia, serif", userSelect: "none" }}>&ldquo;</span>
              <p style={{ margin: 0, fontSize: 12, fontStyle: "italic", color: c.text, lineHeight: 1.65 }}>
                {flag.quote}
              </p>
            </blockquote>
          )}
        </div>
      </div>
    </div>
  );
}
