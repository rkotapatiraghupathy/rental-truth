"use client";
import { useState, useEffect } from "react";
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
  const [dotCount, setDotCount] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    if (!loading) { setDotCount(1); return; }
    const id = setInterval(() => setDotCount(d => d === 3 ? 1 : d + 1), 500);
    return () => clearInterval(id);
  }, [loading]);

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

  const hasInput = !!(termsText.trim() || bookingText.trim());
  const isDisabled = loading || !hasInput;
  const loadingLabel = "Analysing" + ".".repeat(dotCount);

  const tabStyle = (tab: string): React.CSSProperties => ({
    padding: "14px 24px",
    fontSize: 14,
    fontWeight: 600,
    border: "none",
    borderBottom: activeTab === tab ? "3px solid #c0303c" : "3px solid transparent",
    background: "none",
    cursor: "pointer",
    color: activeTab === tab ? "#fff" : "#64748b",
    transition: "color 0.15s ease",
  });

  return (
    <div>
      {/* Input card */}
      <div style={{ background: "#fff", borderRadius: 14, border: "1.5px solid #e2e8f0", overflow: "hidden", marginBottom: 28 }}>

        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "0 12px", background: "#1a1a2e" }}>
          <button style={tabStyle("terms")} onClick={() => setActiveTab("terms")}>
            📄 Booking Terms
          </button>
          <button style={tabStyle("booking")} onClick={() => setActiveTab("booking")}>
            🌐 Booking Page&nbsp;<span style={{ fontSize: 11, color: "#475569", fontWeight: 400 }}>(optional)</span>
          </button>
        </div>

        {activeTab === "terms" && (
          <div>
            <textarea
              value={termsText}
              onChange={e => setTermsText(e.target.value)}
              placeholder="Paste your booking confirmation email, rental T&Cs, or any car hire contract text here…"
              style={{ width: "100%", minHeight: 260, padding: "22px 24px", border: "none", outline: "none", fontFamily: "inherit", fontSize: 14, lineHeight: 1.7, color: "#1f2937", resize: "vertical" as const, boxSizing: "border-box" as const }}
            />
            <div style={{ padding: "10px 24px", borderTop: "1px solid #f1f5f9" }}>
              <span style={{ fontSize: 11, color: "#9ca3af" }}>{termsText.length.toLocaleString()} characters</span>
            </div>
          </div>
        )}

        {activeTab === "booking" && (
          <div>
            <div style={{ padding: "18px 24px 0", fontSize: 13, color: "#6b7280", lineHeight: 1.65 }}>
              Paste what you saw on the booking/checkout page before clicking &ldquo;Pay&rdquo; — price, visible warnings, any terms shown. This lets us check whether restrictions were disclosed before payment.
            </div>
            <textarea
              value={bookingText}
              onChange={e => setBookingText(e.target.value)}
              placeholder="Paste the booking page content — price, visible terms, warnings shown before payment…"
              style={{ width: "100%", minHeight: 240, padding: "14px 24px", border: "none", outline: "none", fontFamily: "inherit", fontSize: 14, lineHeight: 1.7, color: "#1f2937", resize: "vertical" as const, boxSizing: "border-box" as const }}
            />
            <div style={{ padding: "10px 24px", borderTop: "1px solid #f1f5f9" }}>
              <span style={{ fontSize: 11, color: "#9ca3af" }}>{bookingText.length.toLocaleString()} characters</span>
            </div>
          </div>
        )}

        {/* Action footer */}
        <div style={{ padding: "18px 24px", background: "#f8f9fb", borderTop: "1px solid #f1f5f9" }}>
          <p style={{ margin: "0 0 14px", fontSize: 12, color: "#9ca3af" }}>
            {bookingText.trim() ? "✓ Will analyse both layers — terms + disclosure check" : "Add booking page text for the full two-layer analysis"}
          </p>
          <button
            onClick={analyse}
            disabled={isDisabled}
            className={hasInput && !loading ? "btn-pulse" : ""}
            style={{
              width: "100%",
              background: isDisabled ? "#d1d5db" : "#c0303c",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "16px 32px",
              fontWeight: 800,
              fontSize: 17,
              cursor: isDisabled ? "not-allowed" : "pointer",
              letterSpacing: "-0.2px",
            }}
          >
            {loading ? loadingLabel : "Analyse Booking →"}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: "#fff1f2", border: "1.5px solid #fecdd3", borderLeft: "4px solid #c0303c", borderRadius: 10, padding: "14px 18px", color: "#881337", fontSize: 13, marginBottom: 16 }}>
          {error}
        </div>
      )}

      {loading && (
        <div style={{ textAlign: "center" as const, padding: "72px 0", color: "#6b7280" }}>
          <div style={{ fontSize: 52, marginBottom: 18 }}>🔍</div>
          <p style={{ fontSize: 17, fontWeight: 700, margin: "0 0 8px", color: "#374151" }}>Reading the fine print so you don&apos;t have to…</p>
          <p style={{ fontSize: 14, margin: 0, color: "#9ca3af" }}>This usually takes 10–20 seconds</p>
        </div>
      )}

      {result && <AnalysisResults result={result} />}
    </div>
  );
}
