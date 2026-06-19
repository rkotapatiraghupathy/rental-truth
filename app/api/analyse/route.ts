import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { TERMS_PROMPT, BOOKING_PAGE_PROMPT, COMPLAINT_PROMPT } from "@/lib/prompts";
import type { TermsResult, BookingPageResult } from "@/lib/types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function callClaude(systemPrompt: string, userContent: string): Promise<unknown> {
  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4000,
    system: systemPrompt,
    messages: [{ role: "user", content: userContent }],
  });

  const text = message.content
    .filter((b) => b.type === "text")
    .map((b) => (b as { type: "text"; text: string }).text)
    .join("");

  const clean = text.replace(/```json[\s\S]*?```|```[\s\S]*?```/g, (t) =>
    t.replace(/```json|```/g, "")
  ).trim();

  return JSON.parse(clean);
}

async function generateComplaintLetter(
  termsResult: TermsResult,
  bookingResult?: BookingPageResult
): Promise<string> {
  const redFlags = termsResult.flags.filter((f) => f.severity === "red");
  const hiddenItems = bookingResult?.hidden?.map((h) => h.item).join(", ") || "none analysed";

  const context = `
Terms analysis:
- Risk level: ${termsResult.riskLevel} (score: ${termsResult.riskScore}/100)
- Top warning: ${termsResult.topWarning}
- Critical restrictions found: ${redFlags.map((f) => f.title).join("; ")}
${bookingResult ? `
Booking page transparency:
- Transparency score: ${bookingResult.transparencyScore}/100 (${bookingResult.transparencyLevel})
- Restrictions NOT shown before payment: ${hiddenItems}
` : ""}
The consumer: arrived at the rental desk at the agreed time, was refused the vehicle because a critical restriction was buried in terms and conditions and not shown clearly during the booking process. The booking fee was non-refundable.`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1500,
    system: COMPLAINT_PROMPT,
    messages: [{ role: "user", content: context }],
  });

  return message.content
    .filter((b) => b.type === "text")
    .map((b) => (b as { type: "text"; text: string }).text)
    .join("");
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { termsText, bookingPageText } = body;

    if (!termsText?.trim() && !bookingPageText?.trim()) {
      return NextResponse.json({ error: "No terms text provided" }, { status: 400 });
    }

    // Analyse terms
    const rawTerms = await callClaude(
      TERMS_PROMPT,
      `Analyse these booking terms:\n\n${termsText}`
    ) as TermsResult;

    const termsResult: TermsResult = {
      riskScore: rawTerms.riskScore ?? null,
      riskLevel: rawTerms.riskLevel ?? "UNKNOWN",
      summary: rawTerms.summary ?? "",
      topWarning: rawTerms.topWarning ?? null,
      flags: rawTerms.flags ?? [],
    };

    let bookingResult: BookingPageResult | undefined;

    // Optionally analyse booking page
    if (bookingPageText?.trim()) {
      const rawBooking = await callClaude(
        BOOKING_PAGE_PROMPT,
        `Analyse this booking page content:\n\n${bookingPageText}`
      ) as BookingPageResult;

      bookingResult = {
        transparencyScore: rawBooking.transparencyScore ?? null,
        transparencyLevel: rawBooking.transparencyLevel ?? "POOR",
        summary: rawBooking.summary ?? "",
        disclosed: rawBooking.disclosed ?? [],
        hidden: rawBooking.hidden ?? [],
      };
    }

    // Generate complaint letter if risk is HIGH or CRITICAL
    let complaintLetter: string | undefined;
    if (["HIGH", "CRITICAL"].includes(termsResult.riskLevel)) {
      complaintLetter = await generateComplaintLetter(termsResult, bookingResult);
    }

    return NextResponse.json({
      terms: termsResult,
      booking: bookingResult,
      complaintLetter,
      analysedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: `Analysis failed: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 }
    );
  }
}
