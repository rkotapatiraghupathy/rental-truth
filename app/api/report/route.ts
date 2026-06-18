import { NextRequest, NextResponse } from "next/server";
import type { AnalysisResult } from "@/lib/types";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function severityBadge(severity: string): string {
  const map: Record<string, { bg: string; label: string }> = {
    red:   { bg: "#fee2e2", label: "🚫 HIGH RISK" },
    amber: { bg: "#fef9c3", label: "⚠️ WARNING" },
    green: { bg: "#dcfce7", label: "✅ OK" },
  };
  const s = map[severity] || map.amber;
  return `<span style="background:${s.bg};padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700">${s.label}</span>`;
}

export async function POST(request: NextRequest) {
  try {
    const result: AnalysisResult = await request.json();
    const { terms, booking, complaintLetter, analysedAt } = result;

    const date = new Date(analysedAt).toLocaleDateString("en-GB", {
      day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
    });

    const riskColour: Record<string, string> = {
      LOW: "#16a34a", MEDIUM: "#d97706", HIGH: "#ea580c", CRITICAL: "#dc2626", UNKNOWN: "#6b7280",
    };
    const riskBg: Record<string, string> = {
      LOW: "#f0fdf4", MEDIUM: "#fffbeb", HIGH: "#fff7ed", CRITICAL: "#fff1f2", UNKNOWN: "#f9fafb",
    };

    const rc = riskColour[terms.riskLevel] || "#6b7280";
    const rb = riskBg[terms.riskLevel] || "#f9fafb";

    const flagsHtml = (terms.flags || []).map(f => `
      <div style="border:1px solid #e5e7eb;border-radius:8px;padding:14px;margin-bottom:10px;background:${f.severity === "red" ? "#fff1f2" : f.severity === "amber" ? "#fffbeb" : "#f0fdf4"}">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <strong style="font-size:14px">${escapeHtml(f.title)}</strong>
          ${severityBadge(f.severity)}
        </div>
        <p style="margin:0;font-size:13px;color:#374151;line-height:1.5">${escapeHtml(f.detail)}</p>
        ${f.quote ? `<p style="margin:8px 0 0;font-size:12px;font-style:italic;color:#6b7280;padding:6px 10px;border-left:3px solid #e5e7eb">"${escapeHtml(f.quote)}"</p>` : ""}
      </div>
    `).join("");

    const bookingHtml = booking ? `
      <div style="margin-top:32px">
        <h2 style="font-size:18px;font-weight:700;color:#1a1a2e;margin-bottom:4px">Layer 2 — Booking Page Transparency</h2>
        <p style="font-size:13px;color:#6b7280;margin-bottom:16px">Was this information visible before you paid?</p>
        <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:16px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:flex-start">
          <div>
            <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#6b7280;margin-bottom:4px">${booking.transparencyLevel}</div>
            <p style="margin:0;font-size:14px;color:#1f2937">${escapeHtml(booking.summary)}</p>
          </div>
          ${booking.transparencyScore != null ? `<div style="text-align:center;margin-left:20px"><div style="font-size:32px;font-weight:900;color:#dc2626">${booking.transparencyScore}</div><div style="font-size:10px;color:#6b7280;font-weight:700">TRANSPARENCY</div></div>` : ""}
        </div>
        ${(booking.hidden || []).length > 0 ? `
          <h3 style="font-size:14px;font-weight:700;color:#dc2626;margin-bottom:8px">Hidden Before Payment (${booking.hidden.length})</h3>
          ${booking.hidden.map(h => `
            <div style="background:#fff1f2;border:1px solid #fecdd3;border-radius:8px;padding:12px;margin-bottom:8px">
              <strong style="font-size:13px;color:#881337">${escapeHtml(h.item)}</strong>
              <p style="margin:4px 0 0;font-size:12px;color:#374151">${escapeHtml(h.concern)}</p>
            </div>
          `).join("")}
        ` : ""}
      </div>
    ` : "";

    const letterHtml = complaintLetter ? `
      <div style="margin-top:32px;page-break-before:always">
        <h2 style="font-size:18px;font-weight:700;color:#1a1a2e;margin-bottom:4px">Draft Complaint Letter</h2>
        <p style="font-size:13px;color:#6b7280;margin-bottom:16px">Ready to send — fill in the [PLACEHOLDER] sections</p>
        <div style="background:#f8f7f4;border:1px solid #e5e7eb;border-radius:8px;padding:20px;font-family:Georgia,serif;font-size:13px;line-height:1.8;white-space:pre-wrap">${escapeHtml(complaintLetter)}</div>
      </div>
    ` : "";

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>RentalTruth Analysis Report</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif; margin: 0; padding: 40px; max-width: 800px; margin: 0 auto; color: #1f2937; background: #fff; }
  @media print { body { padding: 20px; } }
</style>
</head>
<body>
  <!-- Header -->
  <div style="background:#1a1a2e;border-radius:12px;padding:24px 28px;margin-bottom:28px;display:flex;justify-content:space-between;align-items:center">
    <div>
      <div style="font-size:22px;font-weight:800;color:#fff">Rental<span style="color:#e63946">Truth</span></div>
      <div style="font-size:12px;color:#94a3b8;margin-top:2px">Consumer Transparency Report</div>
    </div>
    <div style="text-align:right;font-size:12px;color:#94a3b8">
      <div>Generated: ${escapeHtml(date)}</div>
      <div style="margin-top:2px">rentaltruth.co.uk</div>
    </div>
  </div>

  <!-- Risk banner -->
  <div style="background:${rb};border:2px solid ${rc};border-radius:10px;padding:20px 24px;margin-bottom:24px;display:flex;justify-content:space-between;align-items:flex-start">
    <div style="flex:1">
      <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:${rc};margin-bottom:6px">${terms.riskLevel} RISK</div>
      <p style="margin:0;font-size:15px;line-height:1.55;color:#1f2937">${escapeHtml(terms.summary)}</p>
      ${terms.topWarning ? `<p style="margin:10px 0 0;font-size:13px;font-weight:600;color:${rc}">⚡ ${escapeHtml(terms.topWarning)}</p>` : ""}
    </div>
    ${terms.riskScore != null ? `<div style="text-align:center;margin-left:24px"><div style="font-size:40px;font-weight:900;color:${rc};line-height:1">${terms.riskScore}</div><div style="font-size:10px;font-weight:700;color:${rc};text-transform:uppercase;margin-top:2px">Risk Score</div></div>` : ""}
  </div>

  <!-- Layer 1 -->
  <h2 style="font-size:18px;font-weight:700;color:#1a1a2e;margin-bottom:4px">Layer 1 — Booking Terms Analysis</h2>
  <p style="font-size:13px;color:#6b7280;margin-bottom:16px">${(terms.flags || []).length} restrictions found</p>
  ${flagsHtml}

  <!-- Layer 2 -->
  ${bookingHtml}

  <!-- Complaint letter -->
  ${letterHtml}

  <!-- Footer -->
  <div style="margin-top:40px;padding-top:16px;border-top:1px solid #e5e7eb;font-size:11px;color:#9ca3af;line-height:1.6">
    This report was generated by RentalTruth (rentaltruth.co.uk), a consumer transparency tool. It is for informational purposes only and does not constitute legal advice. Under the UK Consumer Rights Act 2015, significant terms must be brought to consumers' attention in a transparent and prominent manner before purchase.
  </div>
</body>
</html>`;

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `inline; filename="rentaltruth-report-${Date.now()}.html"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Report generation failed" }, { status: 500 });
  }
}
