/**
 * Thin external-store adapter over the design system's `oakTheme` runtime
 * (public/oak-theme.js, inlined pre-paint by app/layout.tsx), shaped for
 * React's `useSyncExternalStore`: the runtime owns the state (localStorage +
 * html attributes); this module adds the change notification React needs to
 * re-render when a control writes through it. Server snapshots are undefined
 * by design — theme is client state, and server HTML stays theme-neutral.
 *
 * The theme snapshot is the CHOICE model, never the applied html attribute:
 * the runtime's automatic `prefers-contrast: more` path also writes
 * `data-theme`, so the applied attribute cannot distinguish an explicit
 * choice from an OS-triggered default (PR #637 review). The store reads the
 * runtime's persisted choice — plus its own record of writes made through
 * it, which survives a failed persistence write — and renders '' when no
 * explicit choice exists. The storage key is the runtime's contract, read
 * here and written only by the runtime; a `choice()` runtime accessor is
 * the recorded kit-contract cure (MCP-388).
 *
 * The store is a factory (`createOakThemeStore`) with the runtime and
 * stored-choice resolvers injected, so tests build a store over simple
 * fakes instead of mutating globals (no-global-state-in-tests / ADR-078);
 * the app-wide instance below binds the real inlined runtime and storage.
 *
 * Second in-estate copy of the hub's adapter CONTRACT — the copies
 * CONVERGED on the choice-model cure at MCP-372 slice 1 (this copy landed
 * it first in PR #637; the hub's lib/oak-theme-store.ts now mirrors it).
 * Canonical owner: the owned React binding tier per ADR-213 (React code
 * never enters the CSS package) — intake recorded on MCP-134; the final
 * shape waits on the kit's choice() accessor (MCP-388).
 */

export type OakThemeName = 'light' | 'dark' | 'system' | 'high-contrast' | 'colour-safe';
export type OakMotionMode = 'system' | 'reduced' | 'full';
/** The theme snapshot: an explicitly chosen theme, or '' when no explicit
 *  choice exists — the state where a brand's polarity default (or the OS
 *  contrast route) governs. A select pinned to a real value in that state
 *  would misreport the page AND make the first click on that value a dead
 *  control (selects only fire change when the value actually changes). */
type OakThemeSnapshot = OakThemeName | '';

export interface OakThemeRuntime {
  get(): OakThemeName;
  set(t: OakThemeName): void;
  themes: OakThemeName[];
  motion: { get(): OakMotionMode; set(m: OakMotionMode): void; modes: OakMotionMode[] };
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
  themeOptions(): OakThemeName[];
  motionOptions(): OakMotionMode[];
}

/** The runtime's persistence key (oak-theme.js `KEY`). Read here, written
 *  only by the runtime. */
const RUNTIME_STORAGE_KEY = 'oak-theme';

/** A stored-choice resolver over any raw reader: a throwing reader
 *  (private mode, storage security errors) reads as no-choice, exactly as
 *  the runtime's own stored() treats it. Exported so the conversion is
 *  unit-testable with a throwing fake instead of an unreachable default. */
export function createStoredChoiceResolver(
  readItem: () => string | null,
): () => string | undefined {
  return () => {
    try {
      return readItem() ?? undefined;
    } catch {
      return undefined;
    }
  };
}

const resolveGlobalStoredChoice = createStoredChoiceResolver(() =>
  globalThis.localStorage.getItem(RUNTIME_STORAGE_KEY),
);

/** Setters narrow the select's string through the runtime's own lists — no
 *  assertion, and an unknown value (stale option, corruption) is a no-op
 *  exactly as the runtime itself treats it. A landed theme choice is
 *  reported back so the store's session-choice record stays current. */
function createSetters(
  resolveRuntime: () => OakThemeRuntime | undefined,
  recordChoice: (theme: OakThemeName) => void,
  emit: () => void,
): Pick<OakThemeStore, 'setTheme' | 'setMotion'> {
  return {
    setTheme: (theme: string): void => {
      const runtime = resolveRuntime();
      const next = runtime?.themes.find((t) => t === theme);
      if (next === undefined) {
        return;
      }
      runtime?.set(next);
      recordChoice(next);
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
  resolveStoredChoice: () => string | undefined = resolveGlobalStoredChoice,
): OakThemeStore {
  const listeners = new Set<Listener>();
  const emit = (): void => {
    for (const listener of listeners) {
      listener();
    }
  };
  // A choice made through THIS store in THIS session: kept so an explicit
  // set() whose persistence failed (private mode, quota) still renders as
  // the choice it is — mirroring the runtime's own in-memory `current`.
  let sessionChoice: OakThemeName | undefined;
  return {
    subscribe: (listener: Listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    // Theme reads the CHOICE model (session write, then persisted choice) —
    // see OakThemeSnapshot for why the applied attribute cannot serve.
    // Motion needs no such split: the runtime's 'system' IS its no-choice
    // semantic (no attribute set).
    getTheme: () => {
      const runtime = resolveRuntime();
      if (runtime === undefined) {
        return undefined;
      }
      const choice = sessionChoice ?? resolveStoredChoice();
      return runtime.themes.find((t) => t === choice) ?? '';
    },
    getMotion: () => resolveRuntime()?.motion.get() ?? undefined,
    getServerSnapshot: () => undefined,
    ...createSetters(
      resolveRuntime,
      (theme) => {
        sessionChoice = theme;
      },
      emit,
    ),
    // Call contract: the switchboard reads options only after the snapshot
    // gate (theme/motion defined ⇒ runtime present); its pre-hydration
    // placeholders carry their own static option shapes. The fallbacks are
    // a type-level floor, not a rendered no-runtime path.
    themeOptions: () => resolveRuntime()?.themes ?? ['light'],
    motionOptions: () => resolveRuntime()?.motion.modes ?? ['system'],
  };
}

/** The app-wide store over the pre-paint inlined runtime. */
export const oakThemeStore: OakThemeStore = createOakThemeStore(() => globalThis.window?.oakTheme);
