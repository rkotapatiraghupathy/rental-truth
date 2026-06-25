import AnalyserTool from "@/components/AnalyserTool";
import WaitlistSignup from "@/components/WaitlistSignup";

const CATCHES = [
  { icon: "✈️", title: "Flight-arrival requirement", desc: "Airport rates requiring proof of inbound flight — the #1 cause of desk denials.", color: "#e63946" },
  { icon: "💳", title: "Credit card only", desc: "Debit cards refused at counter. Discovered after you've already paid online.", color: "#f59e0b" },
  { icon: "💰", title: "Deposit pre-auth holds", desc: "£500–£2,000 holds that freeze your account for days, undisclosed upfront.", color: "#e63946" },
  { icon: "🚗", title: "Mileage limits", desc: "Daily caps with steep per-mile excess charges buried in appendices.", color: "#3b82f6" },
  { icon: "🧑", title: "Age surcharges", desc: "Young driver fees payable at the desk, not included in the comparison price.", color: "#8b5cf6" },
  { icon: "🌍", title: "Cross-border bans", desc: "Taking the car abroad forbidden or requiring costly add-ons.", color: "#f59e0b" },
  { icon: "⛽", title: "Fuel policy traps", desc: "Full-to-full vs full-to-empty policies costing £50+ if missed.", color: "#f59e0b" },
  { icon: "❌", title: "Non-refundable terms", desc: "Zero recourse if denied at desk or unable to collect.", color: "#e63946" },
];

const STEPS = [
  { step: "1", icon: "📋", title: "Paste terms", desc: "Your confirmation email or rental T&Cs" },
  { step: "2", icon: "🌐", title: "Paste booking page", desc: "What was shown before you paid (optional)" },
  { step: "3", icon: "🤖", title: "AI analyses", desc: "Flags restrictions, checks disclosure" },
  { step: "4", icon: "⚖️", title: "Get report", desc: "Download report + complaint letter if needed" },
];

const STATS = [
  { stat: "1 in 8",  label: "Customers face surprise restrictions" },
  { stat: "AI",      label: "Instant fine-print analysis" },
  { stat: "Free",    label: "Always free for consumers" },
];

const FAQS = [
  {
    question: "Is RentalTruth free to use?",
    answer: "Yes, completely free. No account required, no subscription, and no hidden charges. RentalTruth is built for consumers and will always be free to use.",
  },
  {
    question: "What car hire restrictions does RentalTruth detect?",
    answer: "Flight-arrival requirements, credit card-only rules, deposit pre-auth holds, daily mileage limits, young driver age surcharges, cross-border bans, fuel policy traps (full-to-empty), and non-refundable terms. Anything buried in the fine print.",
  },
  {
    question: "Can RentalTruth help me get a refund?",
    answer: "Yes. For high-risk bookings, RentalTruth generates a draft complaint letter citing UK Consumer Rights Act 2015. You can copy or print it and send it directly to Booking.com, the rental company, or your card provider for a chargeback.",
  },
  {
    question: "Which car hire companies does it work with?",
    answer: "All major companies — Alamo, Hertz, Enterprise, Europcar, Avis, Budget, Sixt, Thrifty, Dollar, National, and any other provider that issues standard English booking terms. If it has T&Cs, RentalTruth can read them.",
  },
  {
    question: "Does it work for Booking.com car hire?",
    answer: "Yes. Paste your Booking.com confirmation email into the Booking Terms tab. Add the booking page content to the optional second tab and RentalTruth will also check what was — and wasn't — disclosed before you paid.",
  },
];

export default function Home() {
  return (
    <div style={{ fontFamily: "var(--font-inter), system-ui, sans-serif", minHeight: "100vh", background: "#f8f7f4" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "RentalTruth",
          "url": "https://rentaltruth.co.uk",
          "description": "Free AI tool that reads car hire booking terms and flags hidden restrictions before consumers pay.",
          "applicationCategory": "UtilitiesApplication",
          "operatingSystem": "Web",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "GBP" },
          "creator": { "@type": "Organization", "name": "RentalTruth", "url": "https://rentaltruth.co.uk" },
        }) }}
      />

      {/* ── Nav ── */}
      <nav style={{ background: "rgba(13,13,30,0.96)", backdropFilter: "blur(12px)", padding: "0 24px", borderBottom: "2px solid #e63946", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", height: 62 }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <span style={{ fontSize: 22 }}>🔍</span>
            <span style={{ color: "#fff", fontSize: 22, fontWeight: 900, letterSpacing: "-0.5px" }}>
              Rental<span style={{ color: "#e63946" }}>Truth</span>
            </span>
            <span style={{ background: "#e63946", color: "#fff", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4, letterSpacing: "0.05em" }}>BETA</span>
          </a>
          <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
            <a href="#problem" style={{ color: "#94a3b8", fontSize: 13, fontWeight: 500, textDecoration: "none" }}>The Problem</a>
            <a href="#tool"    style={{ color: "#94a3b8", fontSize: 13, fontWeight: 500, textDecoration: "none" }}>Try It</a>
          </div>
        </div>
      </nav>

      {/* ── Hero — full viewport ── */}
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", background: "linear-gradient(160deg, #0d0d1e 0%, #1a1a2e 50%, #0d0d1e 100%)", position: "relative", overflow: "hidden" }}>
        <div className="hero-glow-orb" />
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px", textAlign: "center", position: "relative", zIndex: 1, width: "100%" }}>
          <div style={{ display: "inline-block", background: "rgba(230,57,70,0.12)", border: "1px solid rgba(230,57,70,0.3)", borderRadius: 20, padding: "5px 16px", fontSize: 11, fontWeight: 700, color: "#e63946", marginBottom: 28, letterSpacing: "0.1em", textTransform: "uppercase" as const }}>
            Travel Tech · Consumer Transparency
          </div>
          <h1 style={{ color: "#fff", fontSize: "clamp(36px, 6vw, 72px)", fontWeight: 900, lineHeight: 1.06, margin: "0 0 24px", letterSpacing: "-2px", maxWidth: 900, marginLeft: "auto", marginRight: "auto" }}>
            Find hidden booking traps<br />
            <span style={{ color: "#e63946" }}>before they cost you money.</span>
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "clamp(15px, 2vw, 19px)", lineHeight: 1.7, margin: "0 0 36px", maxWidth: 580, marginLeft: "auto", marginRight: "auto" }}>
            Millions of travellers are denied rentals or hit with hidden charges every year. Paste your booking terms — our AI surfaces every trap in seconds.
          </p>

          {/* Live counter badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(230,57,70,0.08)", border: "1px solid rgba(230,57,70,0.22)", borderRadius: 24, padding: "8px 18px", marginBottom: 40 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#e63946", display: "inline-block", boxShadow: "0 0 8px #e63946", flexShrink: 0 }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9" }}>Join <strong style={{ color: "#e63946" }}>0+</strong> travellers protected</span>
          </div>

          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" as const }}>
            <a href="#tool" style={{ background: "#e63946", color: "#fff", fontWeight: 700, fontSize: 16, padding: "16px 38px", borderRadius: 10, textDecoration: "none", boxShadow: "0 4px 22px rgba(230,57,70,0.45)" }}>
              Analyse My Booking →
            </a>
            <a href="#problem" style={{ background: "rgba(255,255,255,0.06)", color: "#fff", fontWeight: 600, fontSize: 16, padding: "16px 28px", borderRadius: 10, textDecoration: "none", border: "1.5px solid rgba(255,255,255,0.12)" }}>
              Our story
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, opacity: 0.35, pointerEvents: "none" }}>
          <span style={{ color: "#fff", fontSize: 10, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" as const }}>Scroll</span>
          <span style={{ color: "#e63946", fontSize: 16 }}>↓</span>
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div style={{ background: "#16213e", padding: "32px 24px", borderBottom: "1px solid #1e2d45" }}>
        <div className="stats-bar-inner" style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
          {STATS.map(({ stat, label }, i) => (
            <div key={stat} style={{ textAlign: "center", padding: "0 44px", borderRight: i < STATS.length - 1 ? "1px solid rgba(230,57,70,0.35)" : "none" }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: "#e63946", letterSpacing: "-1px" }}>{stat}</div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 5, fontWeight: 500 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Main content ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>

        {/* Founder story */}
        <section id="problem" style={{ padding: "80px 0 0" }}>
          <div className="hover-card" style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 16, padding: "44px 48px", position: "relative", overflow: "hidden" }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: "#e63946", marginBottom: 16 }}>Why We Built This</div>
            {/* Large decorative quote mark */}
            <div aria-hidden="true" style={{ position: "absolute", top: 12, left: 24, fontSize: 180, lineHeight: 1, color: "#e63946", opacity: 0.07, fontFamily: "Georgia, serif", fontWeight: 900, userSelect: "none", pointerEvents: "none" }}>&ldquo;</div>
            <h2 style={{ fontSize: "clamp(18px, 2.5vw, 24px)", fontWeight: 800, color: "#1a1a2e", margin: "0 0 28px", lineHeight: 1.35, position: "relative", maxWidth: 820 }}>
              &ldquo;I arrived at the desk with a confirmed booking. They refused the car. The restriction was on page 8 of the terms.&rdquo;
            </h2>
            <div className="founder-inner" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
              <div style={{ fontSize: 14, color: "#374151", lineHeight: 1.85 }}>
                <p style={{ margin: "0 0 14px" }}>
                  In June 2026, our founder booked a car from Liverpool Airport through a major comparison site. He arrived at the agreed time, confirmation in hand. Alamo refused the vehicle — because the booking was airport-only, meaning it required proof of an inbound flight.
                </p>
                <p style={{ margin: 0 }}>
                  That restriction existed in the terms. It was never shown before payment. The booking was non-refundable.
                </p>
              </div>
              <div style={{ fontSize: 14, color: "#374151", lineHeight: 1.85 }}>
                <p style={{ margin: "0 0 14px" }}>
                  This is not an edge case. Millions of travellers lose money every year to restrictions that booking platforms technically disclose but practically hide.
                </p>
                <p style={{ margin: 0 }}>
                  <strong style={{ color: "#1a1a2e" }}>The travel industry runs on information asymmetry.</strong> RentalTruth is built to end it — starting with car hire, expanding across all travel.
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 24, marginTop: 24, borderTop: "1px solid #f1f5f9" }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#e63946", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 17, flexShrink: 0 }}>R</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e" }}>Rakesh</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>Founder, RentalTruth · Liverpool, UK</div>
              </div>
            </div>
          </div>
        </section>

        {/* What we catch */}
        <section style={{ padding: "80px 0 0" }}>
          <h2 style={{ fontSize: "clamp(22px, 3vw, 34px)", fontWeight: 900, color: "#1a1a2e", margin: "0 0 10px", textAlign: "center", letterSpacing: "-0.5px" }}>What our AI catches</h2>
          <p style={{ fontSize: 15, color: "#6b7280", textAlign: "center", margin: "0 0 40px" }}>Restrictions booking platforms bury — we surface them in seconds</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
            {CATCHES.map(({ icon, title, desc, color }) => (
              <div key={title} className="hover-card-strong" style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderLeft: `4px solid ${color}`, borderRadius: 12, padding: "20px" }}>
                <div style={{ fontSize: 26, marginBottom: 10 }}>{icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e", marginBottom: 6 }}>{title}</div>
                <p style={{ margin: 0, fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works — horizontal timeline */}
        <section style={{ padding: "80px 0 0" }}>
          <h2 style={{ fontSize: "clamp(22px, 3vw, 34px)", fontWeight: 900, color: "#1a1a2e", margin: "0 0 10px", textAlign: "center", letterSpacing: "-0.5px" }}>Two-layer analysis</h2>
          <p style={{ fontSize: 15, color: "#6b7280", textAlign: "center", margin: "0 0 48px" }}>We check both what the terms say and what the booking page showed you</p>
          <div className="timeline-steps" style={{ display: "flex", alignItems: "flex-start" }}>
            {STEPS.map(({ step, icon, title, desc }, i) => (
              <div key={step} style={{ flex: 1, position: "relative", textAlign: "center", padding: "0 16px" }}>
                {i > 0 && (
                  <div className="timeline-arrow" style={{ position: "absolute", left: -4, top: 17, fontSize: 22, color: "#e63946", opacity: 0.65, fontWeight: 700 }}>→</div>
                )}
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#e63946", color: "#fff", fontWeight: 900, fontSize: 19, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", boxShadow: "0 4px 16px rgba(230,57,70,0.38)" }}>{step}</div>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e", marginBottom: 5 }}>{title}</div>
                <p style={{ margin: 0, fontSize: 12, color: "#6b7280", lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tool */}
        <section id="tool" style={{ padding: "80px 0 0" }}>
          <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: "clamp(22px, 3vw, 34px)", fontWeight: 900, color: "#1a1a2e", margin: "0 0 8px", letterSpacing: "-0.5px" }}>Try it now</h2>
            <p style={{ fontSize: 15, color: "#6b7280", margin: 0 }}>Free. Instant. No account needed.</p>
          </div>
          <AnalyserTool />
        </section>

        {/* FAQ */}
        <section style={{ padding: "80px 0 60px" }}>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": FAQS.map(f => ({
                "@type": "Question",
                "name": f.question,
                "acceptedAnswer": { "@type": "Answer", "text": f.answer },
              })),
            }) }}
          />
          <h2 style={{ fontSize: "clamp(22px, 3vw, 34px)", fontWeight: 900, color: "#1a1a2e", margin: "0 0 10px", textAlign: "center", letterSpacing: "-0.5px" }}>Common questions</h2>
          <p style={{ fontSize: 15, color: "#6b7280", textAlign: "center", margin: "0 0 40px" }}>Everything you need to know before you paste your terms</p>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
            {FAQS.map(({ question, answer }) => (
              <div key={question} className="hover-card" style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderLeft: "4px solid #e63946", borderRadius: 12, padding: "22px 24px" }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#1a1a2e", marginBottom: 8 }}>
                  {question}
                </div>
                <p style={{ margin: 0, fontSize: 14, color: "#374151", lineHeight: 1.75 }}>{answer}</p>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* ── Footer ── */}
      <div style={{ background: "#0d0d1e", borderTop: "1px solid #1e2d45", padding: "40px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap" as const, gap: 28, marginBottom: 28 }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", marginBottom: 8, letterSpacing: "-0.5px" }}>
                Rental<span style={{ color: "#e63946" }}>Truth</span>
              </div>
              <p style={{ fontSize: 12, color: "#475569", margin: 0, maxWidth: 260, lineHeight: 1.65 }}>
                The transparency layer for travel booking · Liverpool, UK
              </p>
            </div>
            <div style={{ display: "flex", gap: 32, alignItems: "center", flexWrap: "wrap" as const }}>
              <a href="/privacy"                       style={{ fontSize: 13, color: "#64748b", textDecoration: "none", fontWeight: 500 }}>Privacy Policy</a>
              <a href="/terms"                         style={{ fontSize: 13, color: "#64748b", textDecoration: "none", fontWeight: 500 }}>Terms</a>
              <a href="mailto:hello@rentaltruth.co.uk" style={{ fontSize: 13, color: "#64748b", textDecoration: "none", fontWeight: 500 }}>Contact</a>
            </div>
          </div>
          <div style={{ borderTop: "1px solid #1e2d45", paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" as const, gap: 8 }}>
            <div style={{ fontSize: 11, color: "#334155" }}>For informational purposes only. Not legal advice.</div>
            <div style={{ fontSize: 11, color: "#334155" }}>© 2026 RentalTruth Ltd</div>
          </div>
        </div>
      </div>

      {/* ── Mobile floating CTA ── */}
      <a href="#tool" className="mobile-cta-btn" style={{ position: "fixed", bottom: 24, right: 20, zIndex: 100, background: "#e63946", color: "#fff", fontWeight: 700, fontSize: 14, padding: "14px 22px", borderRadius: 30, textDecoration: "none", boxShadow: "0 4px 22px rgba(230,57,70,0.55)", alignItems: "center", gap: 8 }}>
        Try it free →
      </a>

    </div>
  );
}
