/**
 * Thin external-store adapter over the design system's `oakTheme` runtime
 * (oak-theme.js, inlined pre-paint by the consuming app), shaped for React's
 * `useSyncExternalStore`: the runtime owns the state (localStorage + html
 * attributes); this module adds the change notification React needs to
 * re-render when a control writes through it. Server snapshots are undefined
 * by design — theme is client state, and server HTML stays theme-neutral.
 *
 * The theme snapshot is the CHOICE model, never the applied html attribute:
 * the runtime's automatic `prefers-contrast: more` path also writes
 * `data-theme`, so the applied attribute cannot distinguish an explicit
 * choice from an OS-triggered default. The store reads the runtime's
 * `choice()` accessor — the kit contract for exactly this distinction
 * (MCP-388) — and names the no-choice state IDENTITY_DEFAULT (DDR-003
 * dated amendment 2026-08-11): the identity's own default is real design
 * intent, selectable and honest, so the control never needs a placeholder
 * and its first real click always fires.
 *
 * The store deliberately carries NO contrast-media mirror: the OS-contrast
 * route changes only the APPLIED theme (the kit's auto() path writes the
 * attribute without touching choice()), so no exposed snapshot can change
 * and a re-notification would always bail out of useSyncExternalStore.
 * The hub's old mirror existed because its store exposed the applied
 * theme — the conflation the choice model cures. An applied-theme surface
 * (and its mirror) can land at first materialised need as its own
 * accessor.
 *
 * The store is a factory (`createOakThemeStore`) with the runtime resolver
 * injected, so tests build a store over a simple fake instead of mutating
 * globals (no-global-state-in-tests / ADR-078); the app-wide instance
 * below binds the real inlined runtime.
 *
 * This package's edge to `@oaknational/oak-design-system` is CONTRACT-ONLY
 * today: `OakThemeRuntime` re-declares the runtime's public API verbatim
 * (the kit ships no type declarations). The boundary rules PERMIT this
 * package's kit edge — the ADR-213 §4 tier edge, whose package import
 * materialises with the first component — and bar every other design-tier
 * import in both directions. The interface below is the estate's canonical
 * `oakTheme` typing for consumers.
 */

export type OakThemeName = 'light' | 'dark' | 'system' | 'high-contrast' | 'colour-safe';
export type OakMotionMode = 'system' | 'reduced' | 'full';
/** The control value naming the no-choice state (DDR-003 dated amendment
 *  2026-08-11): the page shows its IDENTITY's own default — no data-theme
 *  attribute, a brand's polarity lever free to govern. Selectable:
 *  choosing it CLEARS the stored choice (the runtime's clear(), which
 *  keeps the automatic contrast commitment). It is a control value of
 *  THIS layer, never a theme — it must not reach localStorage or
 *  data-theme, so it is not a member of the runtime's themes list. */
export const IDENTITY_DEFAULT = 'identity-default';
/** The theme snapshot: an explicitly chosen theme, or IDENTITY_DEFAULT
 *  when no explicit choice exists. The sentinel is a real, selectable
 *  option (never a placeholder), so the control reads honestly in the
 *  no-choice state AND every first click on a real theme fires a change
 *  event by construction. */
export type OakThemeSnapshot = OakThemeName | typeof IDENTITY_DEFAULT;

/** The oakTheme runtime's public API, re-declared verbatim from
 *  `oak-design-system/src/oak-theme.ts` (contract-only edge — see the
 *  module docblock). */
export interface OakThemeRuntime {
  set(t: OakThemeName): void;
  clear(): void;
  get(): OakThemeName;
  choice(): OakThemeName | null;
  themes: OakThemeName[];
  motion: { set(m: OakMotionMode): void; get(): OakMotionMode; modes: OakMotionMode[] };
}

declare global {
  interface Window {
    oakTheme?: OakThemeRuntime;
  }
}

type Listener = () => void;

export interface OakThemeStore {
  subscribe(listener: Listener): () => void;
  getTheme(): OakThemeSnapshot | undefined;
  getMotion(): OakMotionMode | undefined;
  getServerSnapshot(): undefined;
  setTheme(theme: string): void;
  setMotion(mode: string): void;
  themeOptions(): OakThemeSnapshot[] | undefined;
  motionOptions(): OakMotionMode[] | undefined;
}

/** Setters narrow the select's string through the runtime's own lists — no
 *  assertion, and an unknown value (stale option, corruption) is a no-op
 *  exactly as the runtime itself treats it. */
function createSetters(
  resolveRuntime: () => OakThemeRuntime | undefined,
  emit: () => void,
): Pick<OakThemeStore, 'setTheme' | 'setMotion'> {
  return {
    setTheme: (theme: string): void => {
      const runtime = resolveRuntime();
      if (runtime === undefined) {
        return;
      }
      // Choosing the identity default is a CLEAR, never a set: the
      // sentinel must not reach the runtime's membership path, and the
      // runtime's clear() keeps the automatic contrast commitment.
      if (theme === IDENTITY_DEFAULT) {
        runtime.clear();
        emit();
        return;
      }
      const next = runtime.themes.find((t) => t === theme);
      if (next === undefined) {
        return;
      }
      runtime.set(next);
      emit();
    },
    setMotion: (mode: string): void => {
      const runtime = resolveRuntime();
      const next = runtime?.motion.modes.find((m) => m === mode);
      if (next === undefined) {
        return;
      }
      runtime?.motion.set(next);
      emit();
    },
  };
}

export function createOakThemeStore(
  resolveRuntime: () => OakThemeRuntime | undefined,
): OakThemeStore {
  const listeners = new Set<Listener>();
  const emit = (): void => {
    for (const listener of listeners) {
      listener();
    }
  };
  return {
    subscribe: (listener: Listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    // Theme reads the CHOICE through the runtime's choice() accessor, with
    // the no-choice state named honestly as the identity default (DDR-003
    // dated amendment 2026-08-11). undefined = no runtime (the demos'
    // hydration gate) — a DIFFERENT state from no-choice, and the two must
    // never collapse: no-runtime renders the consumers' placeholder shell,
    // no-choice renders the selectable Identity default. Motion needs no
    // sentinel: 'system' IS its no-choice semantic.
    getTheme: () => {
      const runtime = resolveRuntime();
      return runtime === undefined ? undefined : (runtime.choice() ?? IDENTITY_DEFAULT);
    },
    getMotion: () => resolveRuntime()?.motion.get() ?? undefined,
    getServerSnapshot: () => undefined,
    ...createSetters(resolveRuntime, emit),
    // Call contract: consumers read options only after the snapshot gate
    // (theme/motion defined ⇒ runtime present); pre-hydration placeholders
    // carry their own static option shapes. An absent runtime reads
    // undefined — the store fabricates no option values it cannot back.
    // Identity default LEADS the offered list: it is the no-choice default
    // (DDR-003 amendment), so it reads first and the real themes follow.
    themeOptions: () => {
      const runtime = resolveRuntime();
      return runtime === undefined ? undefined : [IDENTITY_DEFAULT, ...runtime.themes];
    },
    motionOptions: () => resolveRuntime()?.motion.modes,
  };
}

/** The app-wide store over the pre-paint inlined runtime. */
export const oakThemeStore: OakThemeStore = createOakThemeStore(() => globalThis.window?.oakTheme);
