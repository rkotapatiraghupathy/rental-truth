import AnalyserTool from "@/components/AnalyserTool";
import WaitlistSignup from "@/components/WaitlistSignup";

export default function Home() {
  return (
    <div style={{ fontFamily: "var(--font-inter), system-ui, sans-serif", minHeight: "100vh", background: "#f8f7f4" }}>

      {/* Nav */}
      <nav style={{ background: "#1a1a2e", padding: "0 24px", borderBottom: "3px solid #e63946", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 780, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", height: 56 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 20 }}>🔍</span>
            <span style={{ color: "#fff", fontSize: 20, fontWeight: 800, letterSpacing: "-0.5px" }}>
              Rental<span style={{ color: "#e63946" }}>Truth</span>
            </span>
            <span style={{ background: "#e63946", color: "#fff", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4, letterSpacing: "0.05em" }}>BETA</span>
          </div>
          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            <a href="#problem" style={{ color: "#94a3b8", fontSize: 13, fontWeight: 500, textDecoration: "none" }}>The Problem</a>
            <a href="#tool" style={{ color: "#94a3b8", fontSize: 13, fontWeight: 500, textDecoration: "none" }}>Try It</a>
            <a href="#vision" style={{ color: "#94a3b8", fontSize: 13, fontWeight: 500, textDecoration: "none" }}>Vision</a>
            <a href="#waitlist" style={{ background: "#e63946", color: "#fff", fontSize: 13, fontWeight: 600, padding: "7px 16px", borderRadius: 7, textDecoration: "none" }}>Get Early Access</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background: "#1a1a2e", padding: "64px 24px 60px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "inline-block", background: "rgba(230,57,70,0.12)", border: "1px solid rgba(230,57,70,0.25)", borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 600, color: "#e63946", marginBottom: 20, letterSpacing: "0.05em" }}>
            TRAVEL TECH · CONSUMER TRANSPARENCY
          </div>
          <h1 style={{ color: "#fff", fontSize: 42, fontWeight: 900, lineHeight: 1.12, margin: "0 0 20px", letterSpacing: "-1.5px" }}>
            The transparency layer<br />
            <span style={{ color: "#e63946" }}>travel booking is missing</span>
          </h1>
          <p style={{ color: "#94a3b8", fontSize: 17, lineHeight: 1.7, margin: "0 0 36px", maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>
            Every year, millions of travellers are denied rentals, hit with hidden charges, or stranded at the desk — because critical restrictions were buried in the fine print. RentalTruth fixes that with AI.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#tool" style={{ background: "#e63946", color: "#fff", fontWeight: 700, fontSize: 15, padding: "14px 30px", borderRadius: 9, textDecoration: "none" }}>
              Analyse My Booking →
            </a>
            <a href="#vision" style={{ background: "transparent", color: "#94a3b8", fontWeight: 600, fontSize: 15, padding: "14px 24px", borderRadius: 9, textDecoration: "none", border: "1.5px solid #2d3748" }}>
              See the vision
            </a>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ background: "#16213e", padding: "20px 24px", borderBottom: "1px solid #1e2d45" }}>
        <div style={{ maxWidth: 780, margin: "0 auto", display: "flex", justifyContent: "center", gap: 56, flexWrap: "wrap" }}>
          {[
            { stat: "£28bn", label: "Global car hire market" },
            { stat: "1 in 8", label: "Customers face surprise restrictions" },
            { stat: "AI-powered", label: "Instant fine-print analysis" },
            { stat: "Free", label: "Always free for consumers" },
          ].map(({ stat, label }) => (
            <div key={stat} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: "#e63946" }}>{stat}</div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "0 20px" }}>

        {/* The Problem */}
        <section id="problem" style={{ padding: "60px 0 0" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            {/* Founder story card */}
            <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 14, padding: "28px 30px", gridColumn: "1 / -1" }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#e63946", marginBottom: 12 }}>Why We Built This</div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1a1a2e", margin: "0 0 16px", lineHeight: 1.3 }}>
                &ldquo;I arrived at the desk with a confirmed booking. They refused the car. The restriction was on page 8 of the terms.&rdquo;
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div style={{ fontSize: 14, color: "#374151", lineHeight: 1.75 }}>
                  <p style={{ margin: "0 0 12px" }}>
                    In June 2026, our founder booked a car from Liverpool Airport through a major comparison site. He arrived at the agreed time, confirmation in hand. Alamo refused the vehicle — because the booking was airport-only, meaning it required proof of an inbound flight.
                  </p>
                  <p style={{ margin: 0 }}>
                    That restriction existed in the terms. It was never shown before payment. The booking was non-refundable.
                  </p>
                </div>
                <div style={{ fontSize: 14, color: "#374151", lineHeight: 1.75 }}>
                  <p style={{ margin: "0 0 12px" }}>
                    This is not an edge case. Millions of travellers lose money every year to restrictions that booking platforms technically disclose but practically hide.
                  </p>
                  <p style={{ margin: 0 }}>
                    <strong style={{ color: "#1a1a2e" }}>The travel industry runs on information asymmetry.</strong> RentalTruth is built to end it — starting with car hire, expanding across all travel.
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 20, marginTop: 20, borderTop: "1px solid #f1f5f9" }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: "#e63946", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 15 }}>R</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a2e" }}>Rakesh</div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>Founder, RentalTruth · Liverpool, UK</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What we catch */}
        <section style={{ padding: "48px 0 0" }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1a1a2e", margin: "0 0 4px", textAlign: "center" }}>What our AI catches</h2>
          <p style={{ fontSize: 14, color: "#6b7280", textAlign: "center", margin: "0 0 28px" }}>Restrictions booking platforms bury — we surface them in seconds</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 12 }}>
            {[
              { icon: "✈️", title: "Flight-arrival requirement", desc: "Airport rates requiring proof of inbound flight — the #1 cause of desk denials." },
              { icon: "💳", title: "Credit card only", desc: "Debit cards refused at counter. Discovered after you've already paid online." },
              { icon: "💰", title: "Deposit pre-auth holds", desc: "£500–£2,000 holds that freeze your account for days, undisclosed upfront." },
              { icon: "🚗", title: "Mileage limits", desc: "Daily caps with steep per-mile excess charges buried in appendices." },
              { icon: "🧑", title: "Age surcharges", desc: "Young driver fees payable at the desk, not included in the comparison price." },
              { icon: "🌍", title: "Cross-border bans", desc: "Taking the car abroad forbidden or requiring costly add-ons." },
              { icon: "⛽", title: "Fuel policy traps", desc: "Full-to-full vs full-to-empty policies costing £50+ if missed." },
              { icon: "❌", title: "Non-refundable terms", desc: "Zero recourse if denied at desk or unable to collect." },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 10, padding: "16px" }}>
                <div style={{ fontSize: 22, marginBottom: 8 }}>{icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a2e", marginBottom: 4 }}>{title}</div>
                <p style={{ margin: 0, fontSize: 12, color: "#6b7280", lineHeight: 1.5 }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section style={{ padding: "48px 0 0" }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1a1a2e", margin: "0 0 4px", textAlign: "center" }}>Two-layer analysis</h2>
          <p style={{ fontSize: 14, color: "#6b7280", textAlign: "center", margin: "0 0 28px" }}>We check both what the terms say and what the booking page showed you</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
            {[
              { step: "1", icon: "📋", title: "Paste terms", desc: "Your confirmation email or rental T&Cs" },
              { step: "2", icon: "🌐", title: "Paste booking page", desc: "What was shown before you paid (optional)" },
              { step: "3", icon: "🤖", title: "AI analyses", desc: "Flags restrictions, checks disclosure" },
              { step: "4", icon: "⚖️", title: "Get report", desc: "Download report + complaint letter if needed" },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 10, padding: "18px 14px", textAlign: "center" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#e63946", color: "#fff", fontWeight: 800, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>{step}</div>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a2e", marginBottom: 3 }}>{title}</div>
                <p style={{ margin: 0, fontSize: 12, color: "#6b7280", lineHeight: 1.5 }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tool */}
        <section id="tool" style={{ padding: "52px 0 0" }}>
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1a1a2e", margin: "0 0 4px" }}>Try it now</h2>
            <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>Free. Instant. No account needed.</p>
          </div>
          <AnalyserTool />
        </section>

        {/* Vision / roadmap */}
        <section id="vision" style={{ padding: "52px 0 0" }}>
          <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 14, padding: "32px 36px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#e63946", marginBottom: 12 }}>Product Roadmap</div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1a1a2e", margin: "0 0 24px" }}>
              Starting with car hire. Expanding to all of travel.
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {[
                {
                  phase: "Phase 1 — Now",
                  color: "#e63946",
                  items: [
                    "RentalTruth AI analyser",
                    "Two-layer terms analysis",
                    "Auto-generated complaint letters",
                    "Car hire transparency reports",
                  ]
                },
                {
                  phase: "Phase 2 — 2026",
                  color: "#d97706",
                  items: [
                    "URL & screenshot analysis",
                    "Hotels & flights coverage",
                    "Transparency scoring database",
                    "Corporate travel compliance",
                  ]
                },
                {
                  phase: "Phase 3 — 2027",
                  color: "#16a34a",
                  items: [
                    "FairBooking platform launch",
                    "Direct supplier integrations",
                    "Data licensing to insurers",
                    "Acquisition / Series A",
                  ]
                },
              ].map(({ phase, color, items }) => (
                <div key={phase} style={{ background: "#f8f7f4", borderRadius: 10, padding: "18px 16px" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>{phase}</div>
                  <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                    {items.map(item => (
                      <li key={item} style={{ fontSize: 13, color: "#374151", padding: "5px 0", borderBottom: "1px solid #e2e8f0", display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ color, fontWeight: 700, fontSize: 16 }}>·</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Waitlist */}
        <section id="waitlist" style={{ padding: "52px 0" }}>
          <div style={{ background: "#1a1a2e", borderRadius: 14, padding: "40px 36px", textAlign: "center" }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#e63946", marginBottom: 12 }}>Coming Soon</div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#fff", margin: "0 0 10px" }}>
              FairBooking — book with full transparency
            </h2>
            <p style={{ fontSize: 15, color: "#94a3b8", lineHeight: 1.65, margin: "0 0 28px", maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
              A booking platform where every restriction is shown in plain English before you pay. No surprises. No fine-print traps. No desk denials.
            </p>
            <div style={{ maxWidth: 420, margin: "0 auto" }}>
              <WaitlistSignup compact />
            </div>
            <p style={{ fontSize: 11, color: "#334155", margin: "12px 0 0" }}>Join the waitlist. One email when we launch. No spam.</p>
          </div>
        </section>

      </div>

      {/* Footer */}
      <div style={{ background: "#1a1a2e", borderTop: "1px solid #1e2d45", padding: "28px 24px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", marginBottom: 4 }}>
              Rental<span style={{ color: "#e63946" }}>Truth</span>
            </div>
            <p style={{ fontSize: 12, color: "#475569", margin: 0 }}>The transparency layer for travel booking · Liverpool, UK</p>
          </div>
          <div style={{ fontSize: 11, color: "#334155", textAlign: "right" }}>
            <div>For informational purposes only. Not legal advice.</div>
            <div style={{ marginTop: 2 }}>© 2026 RentalTruth Ltd</div>
          </div>
        </div>
      </div>

    </div>
  );
}
