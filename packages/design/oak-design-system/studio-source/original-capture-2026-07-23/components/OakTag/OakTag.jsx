// OakTag — mirrors OakTagFunctional. Consumes the same tier-3 tokens as .oak-tag.
function oakTagIconUrl(name) {
  const s = document.querySelector('script[src*="_ds_bundle.js"]');
  return s ? new URL("assets/icons/" + name + ".svg", s.src).href : "assets/icons/" + name + ".svg";
}
export function OakTag({ children, color = "lemon", icon, trailingIcon, style }) {
  const bg = { lemon: "var(--surface-decorative-5)", mint: "var(--surface-decorative-1)", aqua: "var(--surface-decorative-2)", lavender: "var(--surface-decorative-3)", pink: "var(--surface-decorative-4)", grey: "var(--bg-neutral-stronger)", white: "var(--bg-primary)" }[color] || "var(--surface-decorative-5)";
  const ic = (n) => <img src={oakTagIconUrl(n)} alt="" style={{ width: "var(--size-icon-s)", height: "var(--size-icon-s)", flex: "0 0 var(--size-icon-s)", filter: "var(--filter-icon)" }} />;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "var(--tag-gap)", minHeight: "var(--tag-min-h)", boxSizing: "border-box", padding: "var(--tag-pad)", borderRadius: "var(--tag-radius)", background: bg, border: color === "white" ? "var(--border-solid-s) solid var(--border-primary)" : "none", font: "var(--weight-regular) var(--font-size-3)/var(--leading-20) var(--font-sans)", letterSpacing: "var(--tracking-heading)", color: "var(--text-primary)", ...style }}>
      {icon ? ic(icon) : null}{children}{trailingIcon ? ic(trailingIcon) : null}
    </span>
  );
}
