"use client";
import type { Flag } from "@/lib/types";

const COLOURS = {
  green: { bg: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)", border: "#bbf7d0", leftBorder: "#16a34a", icon: "✅", text: "#14532d", badgeBg: "#dcfce7" },
  amber: { bg: "linear-gradient(135deg, #fffbeb 0%, #fef9c3 100%)", border: "#fde68a", leftBorder: "#f59e0b", icon: "⚠️", text: "#92400e", badgeBg: "#fef9c3" },
  red:   { bg: "linear-gradient(135deg, #fff1f2 0%, #fee2e2 100%)", border: "#fecdd3", leftBorder: "#e63946", icon: "🚫", text: "#881337", badgeBg: "#fee2e2" },
};

export default function FlagCard({ flag }: { flag: Flag }) {
  const c = COLOURS[flag.severity] || COLOURS.amber;
  return (
    <div style={{ background: c.bg, border: `1.5px solid ${c.border}`, borderLeft: `4px solid ${c.leftBorder}`, borderRadius: 10, padding: "14px 16px" }}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <span style={{ fontSize: 24, flexShrink: 0, marginTop: 1 }}>{c.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: c.text }}>{flag.title}</span>
            <span style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600, textTransform: "uppercase" as const, whiteSpace: "nowrap" as const, flexShrink: 0 }}>
              {flag.category}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: 13, color: "#374151", lineHeight: 1.55 }}>{flag.detail}</p>
          {flag.quote && (
            <p style={{ margin: "8px 0 0", fontSize: 11, fontStyle: "italic", color: c.text, padding: "5px 10px", background: "rgba(255,255,255,0.6)", borderRadius: 5, borderLeft: `3px solid ${c.border}` }}>
              &ldquo;{flag.quote}&rdquo;
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
