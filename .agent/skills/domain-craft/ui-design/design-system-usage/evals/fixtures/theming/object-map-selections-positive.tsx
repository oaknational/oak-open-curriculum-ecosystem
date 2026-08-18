/* POSITIVE control for the SELECTION PARSER, third shape.
 *
 * The estate's own reference switcher declares its theme set as an object
 * map rather than an array or a set of option tags. The option-only parser
 * and the array-aware parser both reported this as "offered set is empty",
 * scoring the estate's canonical conforming implementation as offering no
 * themes at all. All three assertions must PASS here.
 *
 * Kept as .tsx deliberately: the shape only appears in component source,
 * and the grader must read component source as readily as it reads HTML. */
const THEME_LABELS = {
  light: 'Light',
  dark: 'Dark',
  system: 'Match device',
  'high-contrast': 'High contrast',
  'colour-safe': 'Colour safe',
};

export function ThemeSwitcher({ onChoose }: { onChoose: (choice: string) => void }) {
  return (
    <fieldset>
      <legend>Theme</legend>
      {Object.entries(THEME_LABELS).map(([value, label]) => (
        <label key={value}>
          <input
            type="radio"
            name="theme"
            value={value}
            onChange={() => {
              window.localStorage.setItem('oak-theme-choice', value);
              onChoose(value);
            }}
          />
          {label}
        </label>
      ))}
    </fieldset>
  );
}
