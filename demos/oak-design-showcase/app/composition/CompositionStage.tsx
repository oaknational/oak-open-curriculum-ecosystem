'use client';

/**
 * The composition demo's stage (owner spec 2026-08-18): one embedded
 * exhibit of neutral region boxes, one parent control for the example
 * layout and one for the ground (light/dark only). Both controls write
 * presentation data onto the framed canvas IN PLACE — `data-layout`
 * selects one of the four maps in the exhibit's own stylesheet,
 * `data-theme` flips the ground — so the boxes visibly re-arrange with
 * nothing reloading and the markup byte-identical throughout. The switch
 * is instantaneous by design (the vestibular ruling: no layout
 * animation).
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactElement } from 'react';

import { IdentityRadioGroup } from '../../components/IdentityRadioGroup';
import { holdFrameTheme } from '../../components/apply-frame-theme';
import {
  COMPOSITION_LAYOUTS,
  EXHIBIT_THEMES,
  EXHIBIT_THEME_OPTIONS,
  LAYOUT_DESCRIPTIONS,
  LAYOUT_OPTIONS,
  isCompositionLayout,
  isExhibitTheme,
  layoutTitle,
  type CompositionLayout,
  type ExhibitTheme,
} from './frame/layouts';

const FRAME_SRC = '/composition/frame';

function applyExhibitState(
  frame: HTMLIFrameElement | null,
  layout: CompositionLayout,
  theme: ExhibitTheme,
  themeHold: { current: (() => void) | null },
): void {
  // Null-check, never instanceof: the canvas lives in the FRAME's realm,
  // where it is an instance of the frame's own HTMLElement class — a
  // parent-realm instanceof silently rejects every cross-document node.
  // Theme lands on the frame's ROOT (light-dark() resolves against the
  // declaring element's scheme, so a subtree attribute cannot flip
  // :root-declared tokens) — and it is HELD, not written once: the
  // frame's kit runtime rewrites data-theme on a live prefers-contrast
  // change, and the framed exhibit's applier deliberately stands down so
  // THIS stage is the document's one holder (review round 3). Layout on
  // the canvas. The exhibit's accessible TEXT moves with the attribute:
  // its heading and arrangement description were server-rendered from
  // the original query, so a mutated data-layout without the matching
  // text leaves assistive technology hearing the previous arrangement.
  const doc = frame?.contentDocument;
  const canvas = doc?.querySelector<HTMLElement>('[data-composition-frame]');
  if (doc !== null && doc !== undefined && canvas !== null && canvas !== undefined) {
    canvas.dataset['layout'] = layout;
    themeHold.current?.();
    themeHold.current = holdFrameTheme(doc.documentElement, theme);
    applyExhibitText(doc, layout);
  }
}

function applyExhibitText(doc: Document, layout: CompositionLayout): void {
  const title = doc.querySelector('[data-composition-title]');
  if (title !== null) {
    title.textContent = layoutTitle(layout);
  }
  const description = doc.querySelector('[data-composition-description]');
  if (description !== null) {
    description.textContent = LAYOUT_DESCRIPTIONS[layout];
  }
}

function StageControls({
  layout,
  theme,
  setLayout,
  setTheme,
}: {
  readonly layout: CompositionLayout;
  readonly theme: ExhibitTheme;
  readonly setLayout: (value: string) => void;
  readonly setTheme: (value: string) => void;
}): ReactElement {
  return (
    <div className="comp-controls">
      <IdentityRadioGroup
        idPrefix="composition-layout"
        legend="Example layout"
        helpText="Arrow keys switch the layout instantly — the markup never changes."
        identity={layout}
        identities={LAYOUT_OPTIONS}
        labels={COMPOSITION_LAYOUTS}
        onChange={setLayout}
      />
      <IdentityRadioGroup
        idPrefix="composition-theme"
        legend="Theme"
        helpText="Light or dark ground."
        identity={theme}
        identities={EXHIBIT_THEME_OPTIONS}
        labels={EXHIBIT_THEMES}
        onChange={setTheme}
      />
    </div>
  );
}

/** Owns the exhibit's applied state and its theme hold. The effect's
 *  cleanup releases the current hold; a re-run re-installs in the same
 *  synchronous pass, and the final cleanup covers unmount. The returned
 *  re-apply is for the frame's load event (a fresh document). */
function useExhibitState(
  frameRef: { readonly current: HTMLIFrameElement | null },
  layout: CompositionLayout,
  theme: ExhibitTheme,
): () => void {
  const themeHoldRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    applyExhibitState(frameRef.current, layout, theme, themeHoldRef);
    return () => {
      themeHoldRef.current?.();
      themeHoldRef.current = null;
    };
  }, [frameRef, layout, theme]);
  return useCallback(() => {
    applyExhibitState(frameRef.current, layout, theme, themeHoldRef);
  }, [frameRef, layout, theme]);
}

export function CompositionStage(): ReactElement {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [layout, setLayout] = useState<CompositionLayout>('document');
  const [theme, setTheme] = useState<ExhibitTheme>('light');
  const reapplyExhibit = useExhibitState(frameRef, layout, theme);

  const chooseLayout = useCallback((value: string): void => {
    if (isCompositionLayout(value)) {
      setLayout(value);
    }
  }, []);
  const chooseTheme = useCallback((value: string): void => {
    if (isExhibitTheme(value)) {
      setTheme(value);
    }
  }, []);

  return (
    <>
      <StageControls
        layout={layout}
        theme={theme}
        setLayout={chooseLayout}
        setTheme={chooseTheme}
      />
      <p aria-live="polite" className="oak-body-3 comp-status">
        Showing {COMPOSITION_LAYOUTS[layout]} · {EXHIBIT_THEMES[theme]}
      </p>
      <div className="comp-frame-stage">
        <iframe
          ref={frameRef}
          src={FRAME_SRC}
          title="Region canvas — the same markup under every layout"
          onLoad={reapplyExhibit}
        />
      </div>
    </>
  );
}
