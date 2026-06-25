"use client";
import { useState } from "react";

export default function WaitlistSignup({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit() {
    if (!email.includes("@")) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage(data.message);
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong");
      }
    } catch {
      setStatus("error");
      setMessage("Failed to join. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div style={{ background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: 10, padding: compact ? "12px 16px" : "16px 20px", textAlign: "center" as const }}>
        <div style={{ fontSize: compact ? 20 : 28, marginBottom: 6 }}>🎉</div>
        <p style={{ margin: 0, fontSize: compact ? 13 : 15, fontWeight: 600, color: "#14532d" }}>{message}</p>
      </div>
    );
  }

  return (
    <div style={{ background: compact ? "transparent" : "#fff", border: compact ? "none" : "1.5px solid #e2e8f0", borderRadius: 12, padding: compact ? 0 : "24px 28px" }}>
      {!compact && (
        <>
          <h3 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 700, color: "#1a1a2e" }}>
            Get early access
          </h3>
          <p style={{ margin: "0 0 16px", fontSize: 14, color: "#6b7280", lineHeight: 1.5 }}>
            Be the first to know when RentalTruth launches. No spam — one email when we go live.
          </p>
        </>
      )}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }}>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSubmit()}
          placeholder="your@email.com"
          style={{ flex: 1, minWidth: 200, padding: "10px 14px", border: "1.5px solid #d1d5db", borderRadius: 8, fontSize: 14, outline: "none", fontFamily: "inherit" }}
        />
        <button
          onClick={handleSubmit}
          disabled={status === "loading" || !email.includes("@")}
          style={{ background: status === "loading" ? "#d1d5db" : "#c0303c", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 700, cursor: status === "loading" ? "not-allowed" : "pointer", whiteSpace: "nowrap" as const }}
        >
          {status === "loading" ? "Joining…" : "Notify Me"}
        </button>
      </div>
      {status === "error" && (
        <p style={{ margin: "8px 0 0", fontSize: 12, color: "#dc2626" }}>{message}</p>
      )}
    </div>
  );
}
