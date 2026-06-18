"use client";
import type { Flag } from "@/lib/types";

const COLOURS = {
  green: { bg: "#f0fdf4", border: "#bbf7d0", icon: "✅", text: "#14532d", badgeBg: "#dcfce7" },
  amber: { bg: "#fffbeb", border: "#fde68a", icon: "⚠️", text: "#92400e", badgeBg: "#fef9c3" },
  red:   { bg: "#fff1f2", border: "#fecdd3", icon: "🚫", text: "#881337", badgeBg: "#fee2e2" },
};

export default function FlagCard({ flag }: { flag: Flag }) {
  const c = COLOURS[flag.severity] || COLOURS.amber;
  return (
    <div style={{ background: c.bg, border: `1.5px solid ${c.border}`, borderRadius: 10, padding: "14px 16px" }}>
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{c.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: c.text }}>{flag.title}</span>
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
