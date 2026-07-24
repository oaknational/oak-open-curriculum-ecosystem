// OakSubjectChip — subject line-icon in a decorative pastel circle.
// Subject → surface-role map (decorative categorisation only, never meaning);
// geometry from the same tier-3 tokens as .oak-chip.
function oakChipIconUrl(name) {
  const s = document.querySelector('script[src*="_ds_bundle.js"]');
  return s ? new URL("assets/icons/" + name + ".svg", s.src).href : "assets/icons/" + name + ".svg";
}
const OAK_SUBJECTS = {
  english: { icon: "subject-english", bg: "var(--surface-decorative-1)", name: "English" },
  maths: { icon: "subject-maths", bg: "var(--surface-decorative-3)", name: "Maths" },
  science: { icon: "subject-science", bg: "var(--surface-decorative-2)", name: "Science" },
  history: { icon: "subject-history", bg: "var(--surface-decorative-4)", name: "History" },
  geography: { icon: "subject-geography", bg: "var(--surface-decorative-5)", name: "Geography" },
  art: { icon: "subject-art", bg: "var(--surface-decorative-6)", name: "Art & design" },
  music: { icon: "subject-music", bg: "var(--surface-decorative-1-subtle)", name: "Music" },
  computing: { icon: "subject-computing", bg: "var(--surface-decorative-3-subtle)", name: "Computing" },
  french: { icon: "subject-french", bg: "var(--surface-decorative-4-subtle)", name: "French" },
  spanish: { icon: "subject-spanish", bg: "var(--surface-decorative-1-soft)", name: "Spanish" },
  drama: { icon: "subject-drama", bg: "var(--surface-decorative-5-soft)", name: "Drama" },
  pe: { icon: "subject-pe", bg: "var(--surface-decorative-6-subtle)", name: "PE" },
};
export function OakSubjectChip({ subject = "english", size = 48, icon, bg, style }) {
  const s = OAK_SUBJECTS[subject] || OAK_SUBJECTS.english;
  const iconName = icon || s.icon;
  return (
    <span style={{ width: size, height: size, flex: "0 0 " + size + "px", borderRadius: "var(--radius-circle)", background: bg || s.bg, border: "var(--chip-border) solid var(--border-primary)", display: "inline-flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box", ...style }}>
      <img src={oakChipIconUrl(iconName)} width={Math.round(size * 0.6)} height={Math.round(size * 0.6)} alt={s.name} style={{ filter: "var(--filter-icon)" }} />
    </span>
  );
}
