'use client';

/**
 * The picker: one specimen, re-skinned in place while you watch.
 *
 * THE TRANSITION IS THE POINT (owner ruling 2026-08-10: the moment of change
 * is the key communicator of capability). So the frame is navigated EXACTLY
 * ONCE, at mount, and every control afterwards mutates presentation data in
 * place: identity swaps the brand stylesheet INSIDE the frame's own
 * document, theme sets the attribute the kit's cascade keys on, width
 * resizes the frame's simulated viewport (owner ask 2026-08-10: identity,
 * width and theme). Nothing reloads; the DOM the viewer is looking at is
 * the same DOM before and after every control.
 *
 * That choice is also what makes the demonstration honest. An in-place
 * re-skin can only succeed if the markup is genuinely identity-invariant — if
 * any region needed different structure per brand, the swap would visibly
 * break rather than quietly cheat. The mechanism IS the proof.
 *
 * Driving the frame's `src` from the controls would be the other shape, and
 * it is the one to avoid: it is a reload wearing a switcher's clothes, it
 * discards the transition, and it proves nothing about invariance.
 *
 * The external link derives from CONTROL STATE, never from the frame's `src`:
 * under an in-place swap the frame never re-navigates, so its `src` stays
 * frozen at the mount-time identity and would send a viewer somewhere other
 * than what they are looking at.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactElement } from 'react';

import type { OakThemeSnapshot } from '@oaknational/oak-design-react';
import { LabelledSelect } from '../../components/LabelledSelect';
import { useIdentity } from '../../components/brand-identity-binding';
import {
  SWITCHBOARD_CANVAS_WIDTH,
  VIEWPORT_WIDTHS,
  VIEWPORT_WIDTH_LABELS,
} from '../../components/canonical-widths';
import { useScaledViewport } from '../../components/useScaledViewport';
import { BASE_IDENTITY, IDENTITY_LABELS, type IdentitySlug } from '../../components/useIdentity';
import { THEME_LABELS, THEME_OPTIONS, useFrameTheme } from './useFrameTheme';

import './picker.css';

/** The frame always mounts at the base identity, so the first thing a viewer
 *  sees is the unbranded kit and every brand is arrived at by transition. */
const FRAME_SRC = `/identity-switchboard/specimen?brand=${BASE_IDENTITY}`;

function PickerControls({
  identity,
  identities,
  setIdentity,
  theme,
  setTheme,
  width,
  setWidth,
}: {
  readonly identity: IdentitySlug;
  readonly identities: readonly IdentitySlug[];
  readonly setIdentity: (value: string) => void;
  readonly theme: OakThemeSnapshot;
  readonly setTheme: (value: string) => void;
  readonly width: number;
  readonly setWidth: (value: string) => void;
}): ReactElement {
  return (
    <div className="oak-grid picker-controls">
      <LabelledSelect
        id="picker-identity-select"
        label="Identity"
        value={identity}
        options={identities}
        labels={IDENTITY_LABELS}
        onChange={setIdentity}
      />
      <LabelledSelect
        id="picker-theme-select"
        label="Theme"
        value={theme}
        options={THEME_OPTIONS}
        labels={THEME_LABELS}
        onChange={setTheme}
      />
      <LabelledSelect
        id="picker-width-select"
        label="Width"
        value={`${width}`}
        options={VIEWPORT_WIDTHS.map((value) => `${value}`)}
        labels={VIEWPORT_WIDTH_LABELS}
        onChange={setWidth}
      />
    </div>
  );
}

/** The stage's caption: the live status plus the full-page link, wrapping
 *  by kit cluster default at narrow widths. The link derives from CONTROL
 *  STATE, never the frame's `src` (see the module comment). */
function PickerCaption({
  identity,
  theme,
  width,
}: {
  readonly identity: IdentitySlug;
  readonly theme: OakThemeSnapshot;
  readonly width: number;
}): ReactElement {
  return (
    <div className="oak-cluster picker-caption">
      <p aria-live="polite" className="oak-body-3 picker-status">
        Showing {IDENTITY_LABELS[identity]} · {THEME_LABELS[theme]} ·{' '}
        {VIEWPORT_WIDTH_LABELS[`${width}`] ?? `${width} px`}
      </p>
      <a className="oak-link oak-body-2" href={`/identity-switchboard/specimen?brand=${identity}`}>
        Open this identity as a full page
      </a>
    </div>
  );
}

/** Readiness of the framed specimen as a resolvable document target.
 *
 *  Two paths flip readiness, and BOTH are load-bearing: the frame's load
 *  event can fire before hydration attaches the onLoad handler — under a
 *  dev server's slower hydration the frame loses that race every time, and
 *  a swap would silently target nothing (the production suite had passed
 *  the same code on timing alone). The mount-time check covers the
 *  already-loaded case; the specimen's identity-carrying wrapper is the
 *  readiness mark because a not-yet-navigated frame's about:blank document
 *  also reports itself complete. */
function useSpecimenFrame(): {
  readonly frameRef: React.RefObject<HTMLIFrameElement | null>;
  readonly resolveTarget: () => Document | null;
  readonly markReady: () => void;
} {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [frameReady, setFrameReady] = useState(false);

  const markReady = useCallback((): void => {
    setFrameReady(true);
  }, []);

  useEffect(() => {
    const readinessMark = frameRef.current?.contentDocument?.querySelector('[data-identity]');
    if (readinessMark !== null && readinessMark !== undefined) {
      setFrameReady(true);
    }
  }, []);

  // frameReady is the dependency, not decoration: the binder re-runs its
  // effect when this callback's identity changes, which is exactly the render
  // in which the frame's document first becomes reachable.
  const resolveTarget = useCallback(
    (): Document | null => (frameReady ? (frameRef.current?.contentDocument ?? null) : null),
    [frameReady],
  );

  return { frameRef, resolveTarget, markReady };
}

/** Width state narrowed at the control boundary: only canonical widths
 *  (DDR-009) exist as options, and only canonical widths can land. Opens
 *  at the export switchboard's own framed canvas so the two demos read
 *  identically side by side (owner comparison, 2026-08-10). */
function useFrameWidth(): { readonly width: number; readonly setWidth: (value: string) => void } {
  const [widthState, setWidthState] = useState<number>(SWITCHBOARD_CANVAS_WIDTH);
  const setWidth = useCallback((value: string): void => {
    const parsed = Number(value);
    if (VIEWPORT_WIDTHS.includes(parsed)) {
      setWidthState(parsed);
    }
  }, []);
  return { width: widthState, setWidth };
}

export default function IdentityPickerPage(): ReactElement {
  const { frameRef, resolveTarget, markReady } = useSpecimenFrame();
  const { identity, identities, setIdentity } = useIdentity(resolveTarget);
  const { theme, setTheme } = useFrameTheme(resolveTarget);
  const { width, setWidth } = useFrameWidth();
  const stageRef = useRef<HTMLDivElement>(null);
  useScaledViewport(stageRef, frameRef, width);

  return (
    <div className="oak-canvas" data-page="identity-picker">
      <header className="oak-region oak-container picker-head">
        <h1 className="oak-heading-4">One page, any identity</h1>
        <p className="oak-body-2 picker-lede">
          One rendered page — identity, theme and width swap only design data; the markup never
          changes and nothing reloads.
        </p>
      </header>

      {/* No tabindex here, ever: a negative tabindex on a direct child of
          .oak-canvas excludes its whole subtree from sequential focus under
          reading-flow: grid-rows (the specimen's documented F01/F02
          keyboard blackout). data-region pins main to the canvas map's
          1fr main row instead of auto-placing into the masthead row. */}
      <main id="main" className="oak-main oak-region oak-container" data-region="main">
        <PickerControls
          identity={identity}
          identities={identities}
          setIdentity={setIdentity}
          theme={theme}
          setTheme={setTheme}
          width={width}
          setWidth={setWidth}
        />

        <div ref={stageRef} className="picker-stage">
          <iframe
            ref={frameRef}
            src={FRAME_SRC}
            title="Specimen page, re-skinned in place"
            onLoad={markReady}
          />
        </div>

        <PickerCaption identity={identity} theme={theme} width={width} />
      </main>
    </div>
  );
}
