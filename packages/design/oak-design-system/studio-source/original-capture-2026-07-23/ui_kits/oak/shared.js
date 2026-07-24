// Oak UI Kit — shared primitives. LOCAL icons (assets/icons/*.svg); ALL styling via design-system tokens (roles + tier-3) — no raw values.
// Exports: Icon, SubjectChip, Button, Tag, Nav, Footer

const ICON = (n) => `../../assets/icons/${n}.svg`;

const SUBJECTS = {
  english:   { icon: "subject-english",   bg: "var(--surface-mint)", name: "English" },
  maths:     { icon: "subject-maths",      bg: "var(--surface-lavender)", name: "Maths" },
  science:   { icon: "subject-science",    bg: "var(--surface-aqua)", name: "Science" },
  history:   { icon: "subject-history",    bg: "var(--surface-pink)", name: "History" },
  geography: { icon: "subject-geography",  bg: "var(--surface-lemon)", name: "Geography" },
  art:       { icon: "subject-art",        bg: "var(--surface-decorative-6-soft)", name: "Art & design" },
  music:     { icon: "subject-music",      bg: "var(--surface-mint-subtle)", name: "Music" },
  computing: { icon: "subject-computing",  bg: "var(--surface-lavender-subtle)", name: "Computing" },
  french:    { icon: "subject-french",     bg: "var(--surface-pink-subtle)", name: "French" },
  spanish:   { icon: "subject-spanish",    bg: "var(--surface-mint-soft)", name: "Spanish" },
  drama:     { icon: "subject-drama",      bg: "var(--surface-lemon-soft)", name: "Drama" },
  pe:        { icon: "subject-pe",          bg: "var(--surface-amber-subtle)", name: "PE" },
};

function Icon({ name, size = 24, invert = false, style }) {
  return React.createElement("img", {
    src: ICON(name), alt: "", width: size, height: size,
    style: { display: "inline-block", verticalAlign: "middle", filter: invert ? "var(--filter-icon-inverted)" : "var(--filter-icon)", ...style },
  });
}

function SubjectChip({ subject, size = 48 }) {
  const s = SUBJECTS[subject] || SUBJECTS.english;
  return React.createElement("span", {
    style: { width: size, height: size, flex: `0 0 ${size}px`, borderRadius: "50%", background: s.bg,
      border: "var(--chip-border) solid var(--border-primary)", display: "inline-flex", alignItems: "center", justifyContent: "center" },
  }, React.createElement("img", { src: ICON(s.icon), width: size * 0.6, height: size * 0.6, alt: s.name }));
}

// OakButton — consumes tier-3 --btn-* tokens + role colours; hover shadow is the accent signature.
function Button({ children, variant = "primary", size = "md", iconRight, iconLeft, as = "button", href, onClick, style }) {
  const [hover, setHover] = React.useState(false);
  const md = size === "md";
  const base = {
    font: `var(--weight-semibold) ${md ? "var(--font-size-3)" : "var(--font-size-2)"}/var(--leading-20) var(--font-sans)`, letterSpacing: "var(--tracking-heading)",
    padding: md ? "var(--btn-pad)" : "var(--btn-pad-sm)", borderRadius: "var(--btn-radius)", border: "var(--btn-border) solid var(--border-primary)",
    cursor: "pointer", display: "inline-flex", alignItems: "center", gap: md ? "var(--btn-gap)" : "var(--btn-gap-sm)",
    textDecoration: "none", whiteSpace: "nowrap", transition: "background var(--motion-quick) ease, box-shadow var(--motion-quick) ease",
  };
  const dark = variant === "primary" || variant === "dark";
  const variants = {
    primary:   { background: hover ? "var(--bg-btn-primary-hover)" : "var(--bg-btn-primary)", color: "var(--text-btn-primary)", boxShadow: hover ? "var(--shadow-accent)" : "none" },
    secondary: { background: hover ? "var(--bg-btn-secondary-hover)" : "var(--bg-btn-secondary)", color: "var(--text-primary)", boxShadow: hover ? "var(--shadow-accent)" : "none" },
    inverted:  { background: hover ? "var(--bg-btn-secondary-hover)" : "var(--bg-btn-secondary)", color: "var(--text-primary)", border: "var(--btn-border) solid var(--bg-primary)" },
    dark:      { background: hover ? "var(--bg-btn-primary-hover)" : "var(--bg-btn-primary)", color: "var(--text-btn-primary)", boxShadow: hover ? "var(--shadow-accent)" : "none" },
  };
  const Tag = as === "a" ? "a" : "button";
  return React.createElement(Tag, {
    href, onClick, onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false),
    style: { ...base, ...variants[variant], ...style },
  },
    iconLeft && React.createElement(Icon, { name: iconLeft, size: md ? 24 : 20, invert: false, style: dark ? { filter: "var(--filter-icon-on-btn-primary)" } : null }),
    React.createElement("span", { style: { textDecoration: hover && !dark ? "underline" : "none" } }, children),
    iconRight && React.createElement(Icon, { name: iconRight, size: md ? 24 : 20, invert: false, style: dark ? { filter: "var(--filter-icon-on-btn-primary)" } : null })
  );
}

// OakTagFunctional — consumes tier-3 --tag-* form tokens (brand trade-dress surface).
function Tag({ children, color = "lemon", icon, style }) {
  const bg = { lemon: "var(--surface-lemon)", mint: "var(--surface-mint)", aqua: "var(--surface-aqua)", lavender: "var(--surface-lavender)", pink: "var(--surface-pink)", grey: "var(--bg-neutral-stronger)", white: "var(--bg-primary)" }[color] || "var(--surface-lemon)";
  return React.createElement("span", {
    style: { display: "inline-flex", alignItems: "center", gap: "var(--tag-gap)", minHeight: "var(--tag-min-h)", padding: "var(--tag-pad)",
      borderRadius: "var(--tag-radius)", background: bg, border: color === "white" ? "var(--border-solid-s) solid var(--border-primary)" : "var(--tag-border)", boxShadow: "var(--tag-shadow)",
      font: "var(--weight-regular) var(--font-size-3)/var(--leading-20) var(--font-sans)", letterSpacing: "var(--tracking-heading)", color: "var(--text-primary)", ...style },
  }, icon && React.createElement(Icon, { name: icon, size: 20 }), children);
}

function Nav({ active = "Subjects" }) {
  const items = ["Subjects", "Curriculum", "AI tools", "Pupils", "Support"];
  return React.createElement("header", { style: { borderBottom: "var(--border-solid-m) solid var(--border-primary)", background: "var(--bg-primary)" } },
    React.createElement("div", { style: { background: "var(--color-accent)", borderBottom: "var(--border-solid-m) solid var(--border-primary)", padding: "var(--space-8) var(--space-24)", textAlign: "center", font: "var(--type-label)", letterSpacing: "var(--tracking-body)", color: "var(--text-primary)" } },
      "Free, adaptable resources for every teacher — and always will be."
    ),
    React.createElement("div", { style: { maxWidth: "var(--container-max)", margin: "0 auto", height: 76, padding: "0 var(--space-24)", display: "flex", alignItems: "center", gap: "var(--space-24)" } },
      React.createElement("a", { href: "#", style: { display: "flex", alignItems: "center" } },
        React.createElement("img", { src: "../../assets/logo-full-official.svg", alt: "Oak National Academy", style: { height: 36 } })),
      React.createElement("nav", { style: { display: "flex", gap: "var(--space-20)", flex: 1 } },
        items.map(it => React.createElement("a", { key: it, href: "#",
          style: { font: "var(--weight-bold) var(--font-size-3)/var(--leading-20) var(--font-sans)", letterSpacing: "var(--tracking-body)", color: "var(--text-primary)", textDecoration: "none", padding: "var(--space-8) 0", borderBottom: active === it ? "var(--border-solid-xl) solid var(--color-accent)" : "var(--border-solid-xl) solid transparent" } },
          it))),
      React.createElement(Button, { variant: "secondary", size: "sm", iconLeft: "search", style: { height: "var(--size-target-min)", padding: "0 var(--space-12)" } }, "Search"),
      React.createElement(Button, { variant: "primary", size: "sm", style: { height: "var(--size-target-min)", padding: "0 var(--space-16)" } }, "Sign in")
    )
  );
}

function Footer() {
  const cols = [
    ["Pupils", ["Browse by subject", "Browse by year", "Starter quizzes", "Exit quizzes"]],
    ["Teachers", ["Lessons & resources", "Curriculum plans", "AI tools", "Support hub"]],
    ["About", ["Who we are", "Our mission", "Blog", "Careers", "Contact us"]],
  ];
  const subdued = "var(--text-inverted-subdued)";
  const hairline = "var(--border-inverted)";
  return React.createElement("footer", { style: { background: "var(--bg-inverted)", color: "var(--text-inverted)", padding: "var(--space-64) var(--space-24) var(--space-40)" } },
    React.createElement("div", { style: { maxWidth: "var(--container-max)", margin: "0 auto", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "var(--space-48)" } },
      React.createElement("div", null,
        React.createElement("img", { src: "../../assets/logo-full-official.svg", style: { height: 40, filter: "var(--filter-icon-inverted)" }, alt: "Oak" }),
        React.createElement("p", { style: { font: "var(--type-body-2)", letterSpacing: "var(--tracking-body)", marginTop: "var(--space-16)", maxWidth: 320, color: subdued } },
          "We help schools deliver a world-class curriculum for every pupil. Free, adaptable resources and AI tools, created by experts and tested by teachers."),
        React.createElement("div", { style: { display: "flex", gap: "var(--space-12)", marginTop: "var(--space-20)" } },
          ["facebook", "x", "instagram", "linkedin"].map(s =>
            React.createElement("span", { key: s, style: { width: 40, height: 40, borderRadius: "var(--radius-circle)", border: `var(--border-solid-m) solid ${hairline}`, display: "inline-flex", alignItems: "center", justifyContent: "center" } },
              React.createElement(Icon, { name: s, size: 20, invert: true }))))
      ),
      cols.map(([hd, links]) => React.createElement("div", { key: hd },
        React.createElement("div", { style: { font: "var(--weight-bold) var(--font-size-1)/var(--leading-16) var(--font-sans)", marginBottom: "var(--space-12)", color: "var(--color-accent)", letterSpacing: "var(--tracking-caps)", textTransform: "var(--label-transform)" } }, hd),
        React.createElement("ul", { style: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "var(--space-8)" } },
          links.map(l => React.createElement("li", { key: l },
            React.createElement("a", { href: "#", style: { color: "var(--text-inverted)", font: "var(--type-body-2)", letterSpacing: "var(--tracking-body)", textDecoration: "none" } }, l))))
      ))
    ),
    React.createElement("div", { style: { maxWidth: "var(--container-max)", margin: "var(--space-48) auto 0", paddingTop: "var(--space-24)", borderTop: `var(--border-solid-s) solid ${hairline}`, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "var(--space-12)", font: "var(--type-body-3)", color: subdued } },
      React.createElement("div", null, "© 2026 Oak National Academy Limited. Resources on an open licence (OGL v3.0)."),
      React.createElement("div", null, "Terms · Privacy · Cookies · Accessibility")
    )
  );
}

Object.assign(window, { Icon, SubjectChip, Button, Tag, Nav, Footer, SUBJECTS, ICON });
