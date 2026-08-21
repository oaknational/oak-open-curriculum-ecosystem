/**
 * The estate's ONE identity control (showcase plan W3, rulings R9 + R12,
 * owner 2026-08-13): a NATIVE radio group — fieldset + legend, one name,
 * one tab stop. Arrow keys move AND select (the APG default variant,
 * selection follows focus), so each arrow press re-skins the page
 * instantly; that traversal is the demonstration the owner ruled for.
 * The recorded a11y cost (option three is reached through option two)
 * carries its mitigations at every call site: a polite live status line
 * announces each change, and the help text below states the behaviour up
 * front so it is expected rather than discovered. Selection is never
 * colour alone — the kit's radio dot carries the checked state.
 */
import type { ReactElement } from 'react';

export interface IdentityRadioGroupProps {
  /** Distinguishes co-existing groups (picker, specimen strip) — radios of one group share `name`. */
  readonly idPrefix: string;
  readonly identity: string;
  readonly identities: readonly string[];
  readonly labels: Readonly<Record<string, string>>;
  readonly onChange: (value: string) => void;
  /** Strip variant: legend and help text stay in the accessibility tree but
   *  leave the visual row — the radios' own labels carry the sighted story. */
  readonly compact?: boolean;
  /** The group's name; defaults to the identity axis this component was
   *  built for. The composition demo reuses the same one-control shape for
   *  its layout and theme axes. */
  readonly legend?: string;
  readonly helpText?: string;
}

export function IdentityRadioGroup({
  idPrefix,
  identity,
  identities,
  labels,
  onChange,
  compact = false,
  legend = 'Identity',
  helpText = 'Arrow keys switch identity instantly.',
}: IdentityRadioGroupProps): ReactElement {
  const helpId = `${idPrefix}-identity-help`;
  const quietClass = compact ? ' oak-visually-hidden' : '';
  return (
    <fieldset className="identity-radios" aria-describedby={helpId}>
      <legend className={`oak-body-3${quietClass}`}>{legend}</legend>
      <div className="oak-cluster oak-cluster--s identity-radio-row">
        {identities.map((slug) => (
          <label key={slug} className="oak-choice oak-body-2">
            <input
              className="oak-radio"
              type="radio"
              name={`${idPrefix}-identity`}
              value={slug}
              checked={identity === slug}
              onChange={(event) => {
                onChange(event.target.value);
              }}
            />{' '}
            {labels[slug] ?? slug}
          </label>
        ))}
      </div>
      <p id={helpId} className={`oak-body-3 identity-help${quietClass}`}>
        {helpText}
      </p>
    </fieldset>
  );
}
