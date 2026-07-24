// OakIcon — flat black stroke SVG from the design system's local icon set (assets/icons/*.svg).
// Icon URLs resolve against the _ds_bundle.js script tag, so they work from any consuming page.
// Theme-aware via the --filter-icon* role tokens.
function oakIconUrl(name) {
  const s = document.querySelector('script[src*="_ds_bundle.js"]');
  return s ? new URL("assets/icons/" + name + ".svg", s.src).href : "assets/icons/" + name + ".svg";
}
export function OakIcon({ name = "home", size = 24, invert = false, alt = "", style }) {
  return <img src={oakIconUrl(name)} width={size} height={size} alt={alt} style={{ display: "inline-block", verticalAlign: "middle", flex: "0 0 " + size + "px", filter: invert ? "var(--filter-icon-inverted)" : "var(--filter-icon)", ...style }} />;
}
