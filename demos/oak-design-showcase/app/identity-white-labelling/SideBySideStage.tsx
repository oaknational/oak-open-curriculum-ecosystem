'use client';

/**
 * The experiment's stage (owner word 2026-08-18): the framed specimens
 * carry NO controls of their own (`?controls=none`) — one parent theme
 * control and one width control govern every column at once, so the
 * comparison stays controlled: same markup, same theme, same simulated
 * viewport, only the identity sheet differs per column.
 *
 * Theme is parent-owned and stage-local (each ScaledFrame HOLDS it via
 * the shared frame-theme guard): a demo choice never touches the frames'
 * own runtime storage. Width is one simulated viewport shared by every
 * frame.
 */
import { useCallback, useState } from 'react';
import type { ReactElement } from 'react';

import { IDENTITY_DEFAULT } from '@oaknational/oak-design-react';
import type { OakThemeSnapshot } from '@oaknational/oak-design-react';

import { LabelledSelect } from '../../components/LabelledSelect';
import {
  DEFAULT_VIEWPORT_WIDTH,
  VIEWPORT_WIDTHS,
  VIEWPORT_WIDTH_LABELS,
} from '../../components/canonical-widths';
import {
  BASE_IDENTITY,
  IDENTITIES,
  IDENTITY_BLURBS,
  IDENTITY_LABELS,
  type IdentitySlug,
} from '../../components/useIdentity';
import { THEME_LABELS, THEME_OPTIONS, isPickerTheme } from '../../components/theme-vocabulary';

import { ScaledFrame } from './scaled-frame';

function IdentityColumn({
  identity,
  theme,
  width,
}: {
  readonly identity: IdentitySlug;
  readonly theme: OakThemeSnapshot;
  readonly width: number;
}): ReactElement {
  const query = identity === BASE_IDENTITY ? '' : `?brand=${identity}`;
  const href = `/identity-switchboard/specimen${query}`;
  const frameSrc = `${href}${query === '' ? '?' : '&'}controls=none`;
  return (
    <section className="col">
      <h2 className="oak-heading-5 col-title">
        {IDENTITY_LABELS[identity]}{' '}
        <code className="col-code">{query === '' ? 'baseline' : query}</code>
      </h2>
      <p className="oak-body-3 col-desc">{IDENTITY_BLURBS[identity]}</p>
      <ScaledFrame
        src={frameSrc}
        title={`Specimen — ${IDENTITY_LABELS[identity]}`}
        theme={theme}
        width={width}
      />
      <a className="oak-link oak-body-2" href={href} target="_blank" rel="noreferrer">
        Open full page ↗
      </a>
    </section>
  );
}

export function SideBySideStage(): ReactElement {
  const [theme, setTheme] = useState<OakThemeSnapshot>(IDENTITY_DEFAULT);
  const [width, setWidth] = useState<number>(DEFAULT_VIEWPORT_WIDTH);
  const chooseTheme = useCallback((value: string): void => {
    if (isPickerTheme(value)) {
      setTheme(value);
    }
  }, []);
  const chooseWidth = useCallback((value: string): void => {
    const parsed = Number(value);
    if (VIEWPORT_WIDTHS.includes(parsed)) {
      setWidth(parsed);
    }
  }, []);

  return (
    <>
      <div className="oak-cluster stage-controls">
        <LabelledSelect
          id="side-by-side-theme"
          label="Theme"
          value={theme}
          options={THEME_OPTIONS}
          labels={THEME_LABELS}
          onChange={chooseTheme}
        />
        <LabelledSelect
          id="side-by-side-width"
          label="Width"
          value={`${width}`}
          options={VIEWPORT_WIDTHS.map((value) => `${value}`)}
          labels={VIEWPORT_WIDTH_LABELS}
          onChange={chooseWidth}
        />
        <p aria-live="polite" className="oak-body-3 stage-status">
          All columns: {THEME_LABELS[theme]} · {VIEWPORT_WIDTH_LABELS[`${width}`] ?? `${width} px`}
        </p>
      </div>
      <div className="cols">
        {IDENTITIES.map((identity) => (
          <IdentityColumn key={identity} identity={identity} theme={theme} width={width} />
        ))}
      </div>
    </>
  );
}
