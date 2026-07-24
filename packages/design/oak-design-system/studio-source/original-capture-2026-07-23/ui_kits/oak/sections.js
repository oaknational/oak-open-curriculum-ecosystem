// Oak UI Kit — page sections, matching thenational.academy structure.
// Relies on shared.js (Icon, SubjectChip, Button, Tag, SUBJECTS).
// ALL styling via design-system tokens — colours/type/space/radius/shadows are roles, never literals.

const inkShadow = (o) => `${o} ${o} 0 var(--border-primary)`; // Oak marketing collage: ink offset matches ink border

function Hero() {
  return React.createElement("section", { style: { background: "var(--surface-aqua)", borderBottom: "var(--border-solid-m) solid var(--border-primary)" } },
    React.createElement("div", { style: { maxWidth: "var(--container-max)", margin: "0 auto", padding: "var(--space-72) var(--space-24)", display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: "var(--space-56)", alignItems: "center" } },
      React.createElement("div", null,
        React.createElement("h1", { style: { font: "var(--type-heading-1)", letterSpacing: "var(--tracking-heading)", margin: 0, color: "var(--text-primary)", maxWidth: 600 } },
          "Free resources for ",
          React.createElement("span", { style: { position: "relative", display: "inline-block" } }, "every lesson",
            React.createElement("svg", { viewBox: "0 0 280 14", preserveAspectRatio: "none", style: { position: "absolute", left: 0, bottom: -6, width: "100%", height: 14 } },
              React.createElement("path", { d: "M 2 8 Q 70 2 140 7 T 278 6", strokeWidth: 8, fill: "none", strokeLinecap: "round", style: { stroke: "var(--color-accent)" } }))),
          ", every pupil."),
        React.createElement("p", { style: { font: "var(--type-body-1)", letterSpacing: "var(--tracking-body)", margin: "var(--space-24) 0 var(--space-32)", maxWidth: 520, color: "var(--text-primary)" } },
          "Adaptable curriculum plans and resources from key stage 1 to 4, plus AI tools to create and tailor lessons in minutes. Created by experts, tested by teachers, and free — always."),
        React.createElement("div", { style: { display: "flex", gap: "var(--space-12)", flexWrap: "wrap" } },
          React.createElement(Button, { variant: "primary", iconRight: "arrow-right" }, "Browse subjects"),
          React.createElement(Button, { variant: "secondary" }, "Explore AI tools"))
      ),
      React.createElement("div", { style: { position: "relative", height: 360 } },
        React.createElement("div", { style: { position: "absolute", right: 0, top: 20, width: 280, height: 196, background: "var(--card-bg)", border: "var(--border-solid-l) solid var(--border-primary)", borderRadius: "var(--radius-l)", boxShadow: inkShadow("var(--space-8)"), transform: "rotate(3deg)", padding: "var(--space-20)" } },
          React.createElement(SubjectChip, { subject: "science", size: 44 }),
          React.createElement("div", { style: { font: "var(--weight-bold) var(--font-size-1)/var(--leading-16) var(--font-sans)", color: "var(--text-subdued)", marginTop: "var(--space-12)", letterSpacing: "var(--tracking-caps)", textTransform: "var(--label-transform)" } }, "Science · Year 7"),
          React.createElement("div", { style: { font: "var(--type-heading-6)", marginTop: "var(--space-8)", color: "var(--text-primary)" } }, "Cells, tissues and organs"),
          React.createElement("div", { style: { display: "flex", gap: "var(--space-8)", marginTop: "var(--space-12)" } },
            ["video", "quiz", "worksheet", "slide-deck"].map(i => React.createElement(Icon, { key: i, name: i, size: 22 })))),
        React.createElement("div", { style: { position: "absolute", left: 10, top: 170, width: 244, height: 150, background: "var(--color-accent)", border: "var(--border-solid-l) solid var(--border-primary)", borderRadius: "var(--radius-l)", boxShadow: inkShadow("var(--space-8)"), transform: "rotate(-4deg)", padding: "var(--space-20)" } },
          React.createElement(SubjectChip, { subject: "english", size: 40 }),
          React.createElement("div", { style: { font: "var(--weight-bold) var(--font-size-1)/var(--leading-16) var(--font-sans)", color: "var(--text-primary)", marginTop: "var(--space-12)", letterSpacing: "var(--tracking-caps)", textTransform: "var(--label-transform)" } }, "English · Year 9"),
          React.createElement("div", { style: { font: "var(--weight-semibold) var(--font-size-4)/var(--leading-24) var(--font-display)", marginTop: "var(--space-4)", color: "var(--text-primary)" } }, "'An Inspector Calls'")),
        React.createElement("div", { style: { position: "absolute", left: 120, top: 0, background: "var(--card-bg)", border: "var(--border-solid-l) solid var(--border-primary)", padding: "var(--space-8) var(--space-16)", borderRadius: "var(--radius-circle)", boxShadow: inkShadow("var(--border-solid-l)"), font: "var(--weight-bold) var(--font-size-2)/var(--leading-20) var(--font-sans)", color: "var(--text-primary)", transform: "rotate(-6deg)" } }, "Free forever ✶"))
    )
  );
}

function TrustBand() {
  const stats = [["40+", "subjects"], ["12,000+", "free lessons"], ["KS1–KS4", "covered"], ["100%", "free, always"]];
  return React.createElement("section", { style: { borderBottom: "var(--border-solid-m) solid var(--border-primary)", background: "var(--bg-primary)" } },
    React.createElement("div", { style: { maxWidth: "var(--container-max)", margin: "0 auto", padding: "var(--space-32) var(--space-24)", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "var(--gap-l)" } },
      stats.map(([n, l]) => React.createElement("div", { key: l, style: { textAlign: "center" } },
        React.createElement("div", { style: { font: "var(--type-heading-3)", letterSpacing: "var(--tracking-heading)", color: "var(--text-success)" } }, n),
        React.createElement("div", { style: { font: "var(--type-body-2)", letterSpacing: "var(--tracking-body)", color: "var(--text-subdued)" } }, l)))
    )
  );
}

function SubjectGrid() {
  const keys = Object.keys(window.SUBJECTS);
  return React.createElement("section", { style: { maxWidth: "var(--container-max)", margin: "0 auto", padding: "var(--space-72) var(--space-24)" } },
    React.createElement("div", { style: { display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "var(--space-32)", gap: "var(--gap-l)", flexWrap: "wrap" } },
      React.createElement("div", null,
        React.createElement("h2", { style: { font: "var(--type-heading-3)", letterSpacing: "var(--tracking-heading)", margin: 0, color: "var(--text-primary)" } }, "Browse by subject"),
        React.createElement("p", { style: { font: "var(--type-body-1)", letterSpacing: "var(--tracking-body)", color: "var(--text-subdued)", margin: "var(--space-12) 0 0", maxWidth: 540 } }, "Find lessons, units and resources for the subject you teach.")),
      React.createElement(Button, { variant: "secondary", iconRight: "arrow-right" }, "All subjects")),
    React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "var(--gap-m)" } },
      keys.map(k => React.createElement(SubjectCard, { key: k, subject: k })))
  );
}

function SubjectCard({ subject }) {
  const [hover, setHover] = React.useState(false);
  const s = window.SUBJECTS[subject];
  return React.createElement("a", { href: "#", onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false),
    style: { display: "flex", alignItems: "center", gap: "var(--gap-m)", padding: "var(--space-16) var(--space-20)", background: "var(--card-bg)",
      border: "var(--card-border) solid var(--border-primary)", borderRadius: "var(--card-radius)", boxShadow: hover ? inkShadow("var(--border-solid-xxl)") : inkShadow("var(--border-solid-xl)"),
      transform: hover ? "translate(-1px,-1px)" : "none", textDecoration: "none", color: "var(--text-primary)",
      transition: "box-shadow var(--motion-quick) ease, transform var(--motion-quick) ease" } },
    React.createElement(SubjectChip, { subject, size: 48 }),
    React.createElement("span", { style: { font: "var(--type-heading-6)", letterSpacing: "var(--tracking-heading)", flex: 1 } }, s.name),
    React.createElement(Icon, { name: "chevron-right", size: 22 })
  );
}

function FeatureRow({ flip, eyebrow, title, body, cta, bg, accent, children }) {
  const text = React.createElement("div", null,
    React.createElement(Tag, { color: accent, style: { marginBottom: "var(--space-16)" } }, eyebrow),
    React.createElement("h2", { style: { font: "var(--type-heading-3)", letterSpacing: "var(--tracking-heading)", margin: "0 0 var(--space-16)", color: "var(--text-primary)" } }, title),
    React.createElement("p", { style: { font: "var(--type-body-1)", letterSpacing: "var(--tracking-body)", margin: "0 0 var(--space-24)", maxWidth: 520, color: "var(--text-primary)" } }, body),
    React.createElement(Button, { variant: "primary", iconRight: "arrow-right" }, cta));
  return React.createElement("section", { style: { background: bg, borderTop: "var(--border-solid-m) solid var(--border-primary)", borderBottom: "var(--border-solid-m) solid var(--border-primary)" } },
    React.createElement("div", { style: { maxWidth: "var(--container-max)", margin: "0 auto", padding: "var(--space-64) var(--space-24)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-56)", alignItems: "center" } },
      flip ? children : text,
      flip ? text : children)
  );
}

function AilaFeature() {
  return React.createElement(FeatureRow, {
    eyebrow: "AI tools", accent: "lavender", bg: "var(--color-accent-subtle)",
    title: "Meet Aila, your AI lesson assistant",
    body: "You guide Aila to create and adapt national curriculum-aligned lessons in minutes. It gives you a solid foundation to build from and tailor to your pupils — you stay in control.",
    cta: "Try Aila free",
  },
    React.createElement("div", { style: { background: "var(--card-bg)", border: "var(--border-solid-l) solid var(--border-primary)", borderRadius: "var(--radius-l)", boxShadow: inkShadow("var(--space-8)"), padding: "var(--card-pad)", transform: "rotate(-1deg)", display: "flex", flexDirection: "column", gap: "var(--space-8)" } },
      React.createElement("div", { style: { display: "flex", alignItems: "center", gap: "var(--space-8)", marginBottom: "var(--space-4)" } },
        React.createElement(Icon, { name: "ai", size: 28 }), React.createElement("div", { style: { font: "var(--weight-bold) var(--font-size-2)/var(--leading-20) var(--font-sans)", color: "var(--text-primary)" } }, "Aila")),
      React.createElement("div", { style: { padding: "var(--space-12)", background: "var(--bg-subtle)", borderRadius: "var(--radius-m2)", font: "var(--type-body-2)", letterSpacing: "var(--tracking-body)", color: "var(--text-primary)" } }, "I'll draft a 50-minute lesson on tectonic hazards for Year 10. Want a starter quiz included?"),
      React.createElement("div", { style: { padding: "var(--space-12)", background: "var(--color-accent)", borderRadius: "var(--radius-m2)", font: "var(--type-body-2)", letterSpacing: "var(--tracking-body)", color: "var(--text-primary)", alignSelf: "flex-end", textAlign: "right", maxWidth: "82%" } }, "Yes please — and add exam-style questions at the end."))
  );
}

function CurriculumFeature() {
  return React.createElement(FeatureRow, {
    flip: true, eyebrow: "Curriculum plans", accent: "aqua", bg: "var(--bg-primary)",
    title: "Plan with confidence, key stage 1 to 4",
    body: "Explore expert-designed, quality-assured curriculum sequences — aligned to the national curriculum, with exam boards covered at secondary. Use them as a model or adapt them to your school.",
    cta: "Explore curriculum plans",
  },
    React.createElement("div", { style: { background: "var(--surface-aqua-subtle)", border: "var(--border-solid-l) solid var(--border-primary)", borderRadius: "var(--radius-l)", boxShadow: inkShadow("var(--space-8)"), padding: "var(--card-pad)", display: "flex", flexDirection: "column", gap: "var(--space-8)" } },
      ["Unit 1 · Forces and motion", "Unit 2 · Energy stores", "Unit 3 · Electricity", "Unit 4 · Waves"].map((u, i) =>
        React.createElement("div", { key: u, style: { display: "flex", alignItems: "center", gap: "var(--space-12)", padding: "var(--space-12) var(--space-16)", background: "var(--card-bg)", border: "var(--border-solid-m) solid var(--border-primary)", borderRadius: "var(--radius-m2)" } },
          React.createElement("span", { style: { width: 28, height: 28, flex: "0 0 28px", borderRadius: "var(--radius-circle)", background: i === 0 ? "var(--bg-success)" : "var(--card-bg)", border: "var(--border-solid-m) solid var(--border-primary)", display: "inline-flex", alignItems: "center", justifyContent: "center", font: "var(--weight-bold) var(--font-size-1)/var(--leading-none) var(--font-sans)", color: i === 0 ? "var(--text-inverted)" : "var(--text-primary)" } }, i + 1),
          React.createElement("span", { style: { font: "var(--weight-bold) var(--font-size-3)/var(--leading-24) var(--font-sans)", letterSpacing: "var(--tracking-body)", color: "var(--text-primary)" } }, u))))
  );
}

function PupilFeature() {
  return React.createElement(FeatureRow, {
    eyebrow: "Pupils", accent: "pink", bg: "var(--surface-pink-subtle)",
    title: "Send learning straight to pupils",
    body: "Set homework, revision and catch-up in seconds. Pupils take a starter quiz, watch the lesson, then an exit quiz — with real-time feedback. You see their progress, without adding to your workload.",
    cta: "See the pupil experience",
  },
    React.createElement("div", { style: { background: "var(--card-bg)", border: "var(--border-solid-l) solid var(--border-primary)", borderRadius: "var(--radius-l)", boxShadow: inkShadow("var(--space-8)"), padding: "var(--card-pad)" } },
      React.createElement("div", { style: { display: "flex", gap: "var(--space-4)", marginBottom: "var(--space-16)" } },
        ["Intro", "Quiz", "Video", "Worksheet", "Exit"].map((s, i) =>
          React.createElement("div", { key: s, style: { flex: 1, textAlign: "center", padding: "var(--space-8) var(--space-4)", borderRadius: "var(--radius-m)", font: "var(--weight-bold) var(--font-size-1)/var(--leading-16) var(--font-sans)", letterSpacing: "var(--tracking-body)", background: i < 2 ? "var(--surface-mint)" : i === 2 ? "var(--bg-inverted)" : "var(--bg-neutral)", color: i === 2 ? "var(--text-inverted)" : "var(--text-primary)" } }, s))),
      React.createElement("div", { style: { padding: "var(--space-16)", background: "var(--color-accent-subtle)", border: "var(--border-solid-m) solid var(--border-primary)", borderRadius: "var(--radius-m2)", font: "var(--weight-semibold) var(--font-size-4)/var(--leading-24) var(--font-display)", letterSpacing: "var(--tracking-heading)", color: "var(--text-primary)" } }, "Which process turns water vapour into liquid?"),
      React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "var(--space-8)", marginTop: "var(--space-8)" } },
        [["A", "Evaporation", false], ["B", "Condensation", true]].map(([l, t, ok]) =>
          React.createElement("div", { key: l, style: { display: "flex", alignItems: "center", gap: "var(--space-12)", padding: "var(--space-8) var(--space-12)", border: `var(--border-solid-m) solid ${ok ? "var(--border-success)" : "var(--border-primary)"}`, borderRadius: "var(--radius-m2)", background: ok ? "var(--bg-correct)" : "var(--card-bg)", font: "var(--weight-bold) var(--font-size-2)/var(--leading-20) var(--font-sans)", color: "var(--text-primary)" } },
            React.createElement("span", { style: { width: 28, height: 28, borderRadius: "var(--radius-circle)", background: ok ? "var(--bg-success)" : "var(--bg-inverted)", color: "var(--text-inverted)", display: "inline-flex", alignItems: "center", justifyContent: "center", font: "var(--weight-bold) var(--font-size-2)/var(--leading-none) var(--font-sans)" } }, l), t))))
  );
}

function QuoteBand() {
  return React.createElement("section", { style: { background: "var(--bg-inverted)", padding: "var(--space-64) var(--space-24)" } },
    React.createElement("figure", { style: { maxWidth: 820, margin: "0 auto", textAlign: "center" } },
      React.createElement("blockquote", { style: { font: "var(--weight-regular) var(--font-size-7)/var(--leading-40) var(--font-sans)", letterSpacing: "var(--tracking-heading)", color: "var(--text-inverted)", margin: 0 } },
        "“Incorporating Aila into my teaching has the potential to save me around 30 minutes per lesson — and enhance their quality too.”"),
      React.createElement("figcaption", { style: { font: "var(--type-body-2)", letterSpacing: "var(--tracking-body)", color: "var(--color-accent)", marginTop: "var(--space-20)" } }, "James · Teacher, St Cuthbert Mayne School"))
  );
}

function Newsletter() {
  return React.createElement("section", { style: { maxWidth: "var(--container-max)", margin: "0 auto", padding: "var(--space-64) var(--space-24)" } },
    React.createElement("div", { style: { background: "var(--surface-lavender-subtle)", border: "var(--border-solid-l) solid var(--border-primary)", borderRadius: "var(--radius-l)", boxShadow: inkShadow("var(--space-8)"), padding: "var(--space-40) var(--space-48)", display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "var(--space-40)", alignItems: "center" } },
      React.createElement("div", null,
        React.createElement("h2", { style: { font: "var(--type-heading-4)", letterSpacing: "var(--tracking-heading)", margin: "0 0 var(--space-8)", color: "var(--text-primary)" } }, "Get Oak in your inbox"),
        React.createElement("p", { style: { font: "var(--type-body-2)", letterSpacing: "var(--tracking-body)", margin: 0, color: "var(--text-primary)" } }, "New lessons, curriculum updates and teaching tips — about once a month. No spam, ever.")),
      React.createElement("div", { style: { display: "flex", gap: "var(--space-12)", flexWrap: "wrap" } },
        React.createElement("input", { defaultValue: "", placeholder: "name@school.uk", "aria-label": "Email address", style: { flex: 1, minWidth: 200, height: "var(--size-target-l)", padding: "0 var(--space-16)", border: "var(--input-border) solid var(--border-primary)", borderRadius: "var(--input-radius)", font: "var(--type-body-1)", letterSpacing: "var(--tracking-body)", background: "var(--bg-primary)", color: "var(--text-primary)" } }),
        React.createElement(Button, { variant: "primary", iconRight: "arrow-right", style: { height: "var(--size-target-l)" } }, "Sign up")))
  );
}

Object.assign(window, { Hero, TrustBand, SubjectGrid, SubjectCard, AilaFeature, CurriculumFeature, PupilFeature, QuoteBand, Newsletter });
