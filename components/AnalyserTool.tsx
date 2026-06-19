"use client";
import { useState } from "react";
import type { AnalysisResult } from "@/lib/types";
import AnalysisResults from "./AnalysisResults";

const SAMPLE_TERMS = `BOOKING CONFIRMATION – Alamo Car Rental, Liverpool Airport
Booking reference: AL-2026-XXXXX
Vehicle: Economy class (Ford Fiesta or similar)
Collection: Liverpool John Lennon Airport, Terminal Building, Counter 4
Collection date: 14 June 2026, 12:00
Rate: £38.00 total prepaid, non-refundable

IMPORTANT: This rate is an airport-only rate exclusively for customers who have arrived at Liverpool Airport on a commercial flight. You MUST present a valid boarding pass or e-ticket showing an inbound flight to this airport on the collection date. Failure to provide proof of air travel will result in refusal of the vehicle with no refund issued.

Payment: Full amount charged at time of booking. Non-refundable under any circumstances.
Credit card required: A credit card (Visa or Mastercard, not debit card) must be presented at the counter in the renter's name. Pre-authorisation hold of £1,200 will be placed.
Minimum age: 21. Drivers aged 21–24 subject to young driver surcharge of £18/day payable at counter.
Mileage: 150 miles/day included. Excess: £0.18/mile.
Fuel policy: Full-to-full. Vehicle returned without full tank charged at £2.50/litre.`;

const SAMPLE_BOOKING_PAGE = `Page title: Alamo Car Hire Liverpool Airport – Best Rates

Economy Car – Ford Fiesta or similar
✓ Free cancellation up to 48 hours
✓ No hidden fees
Collection: Liverpool Airport  Drop-off: Liverpool Airport
Price: £38.00 total

[Book Now]

Terms apply. See full rental conditions.`;

export default function AnalyserTool() {
  const [activeTab, setActiveTab] = useState<"terms" | "booking">("terms");
  const [termsText, setTermsText] = useState("");
  const [bookingText, setBookingText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  function loadExample() {
    setTermsText(SAMPLE_TERMS);
    setBookingText(SAMPLE_BOOKING_PAGE);
  }

  async function analyse() {
    if (!termsText.trim() && !bookingText.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await fetch("/api/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ termsText, bookingPageText: bookingText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed");
    }
    setLoading(false);
  }

  const tabStyle = (tab: string) => ({
    padding: "10px 18px",
    fontSize: 13,
    fontWeight: 600 as const,
    border: "none",
    borderBottom: activeTab === tab ? "2px solid #e63946" : "2px solid transparent",
    background: "none",
    cursor: "pointer",
    color: activeTab === tab ? "#e63946" : "#6b7280",
  });

  return (
    <div>
      {/* Input card */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1.5px solid #e2e8f0", overflow: "hidden", marginBottom: 24 }}>
        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid #f1f5f9", padding: "0 8px" }}>
          <button style={tabStyle("terms")} onClick={() => setActiveTab("terms")}>
            📄 Booking Terms
          </button>
          <button style={tabStyle("booking")} onClick={() => setActiveTab("booking")}>
            🌐 Booking Page <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 400 }}>(optional)</span>
          </button>
        </div>

        {activeTab === "terms" && (
          <div>
            <textarea
              value={termsText}
              onChange={e => setTermsText(e.target.value)}
              placeholder="Paste your booking confirmation email, rental T&Cs, or any car hire contract text here…"
              style={{ width: "100%", minHeight: 220, padding: "16px 18px", border: "none", outline: "none", fontFamily: "inherit", fontSize: 13, lineHeight: 1.65, color: "#1f2937", resize: "vertical" as const, boxSizing: "border-box" as const }}
            />
            <div style={{ padding: "8px 18px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 11, color: "#9ca3af" }}>{termsText.length} characters</span>
              <button onClick={loadExample} style={{ fontSize: 12, color: "#e63946", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>
                Load real example (mirrors Liverpool Airport denial case) →
              </button>
            </div>
          </div>
        )}

        {activeTab === "booking" && (
          <div>
            <div style={{ padding: "12px 18px 0", fontSize: 12, color: "#6b7280", lineHeight: 1.6 }}>
              Paste what you saw on the booking/checkout page before clicking &ldquo;Pay&rdquo; — price displayed, any visible warnings, and any terms shown. This lets us check whether critical restrictions were disclosed before payment.
            </div>
            <textarea
              value={bookingText}
              onChange={e => setBookingText(e.target.value)}
              placeholder="Paste the booking page content — price, visible terms, warnings shown before payment…"
              style={{ width: "100%", minHeight: 200, padding: "12px 18px", border: "none", outline: "none", fontFamily: "inherit", fontSize: 13, lineHeight: 1.65, color: "#1f2937", resize: "vertical" as const, boxSizing: "border-box" as const }}
            />
            <div style={{ padding: "8px 18px", borderTop: "1px solid #f1f5f9" }}>
              <span style={{ fontSize: 11, color: "#9ca3af" }}>{bookingText.length} characters</span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ padding: "12px 18px", background: "#f8f9fb", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "#9ca3af" }}>
            {bookingText.trim() ? "✓ Will analyse both layers" : "Add booking page text for full disclosure analysis"}
          </span>
          <button
            onClick={analyse}
            disabled={loading || (!termsText.trim() && !bookingText.trim())}
            style={{
              background: loading || (!termsText.trim() && !bookingText.trim()) ? "#d1d5db" : "#e63946",
              color: "#fff", border: "none", borderRadius: 8, padding: "11px 28px",
              fontWeight: 700, fontSize: 14, cursor: loading || (!termsText.trim() && !bookingText.trim()) ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Analysing…" : "Analyse Booking"}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: "#fff1f2", border: "1px solid #fecdd3", borderRadius: 8, padding: "12px 16px", color: "#881337", fontSize: 13, marginBottom: 16 }}>
          {error}
        </div>
      )}

      {loading && (
        <div style={{ textAlign: "center" as const, padding: "56px 0", color: "#6b7280" }}>
          <div style={{ fontSize: 40, marginBottom: 14 }}>🔍</div>
          <p style={{ fontSize: 15, fontWeight: 600, margin: "0 0 6px", color: "#374151" }}>Reading the fine print so you don&apos;t have to…</p>
          <p style={{ fontSize: 13, margin: 0 }}>This usually takes 10–20 seconds</p>
        </div>
      )}

      {result && <AnalysisResults result={result} />}
    </div>
  );
}
