/**
 * What every token on the page currently resolves to, read out of the
 * browser rather than computed in JavaScript.
 *
 * Shaped as an external store over the DOM, for React's
 * `useSyncExternalStore` — the same shape the kit's theme store uses over
 * its runtime, and for the same reason: the state lives outside React (here,
 * in the cascade), so React needs a subscription rather than an effect that
 * pushes values into state.
 *
 * TWO READS, BECAUSE THEY ANSWER DIFFERENT QUESTIONS. A custom property's
 * computed value is the token stream after `var()` substitution, so
 * `--text-primary` reads back as its `light-dark(…)` expression rather than
 * as a colour. The standard property that CONSUMES it reports a used value,
 * so colour, shadow and filter specimens are read from the painted property
 * and show what the browser actually paints — with the expression kept
 * beside it, which is how a `color-mix()` or `calc()` token shows both as
 * written and as applied.
 *
 * RE-READING IS EVENT-DRIVEN, NEVER TIMED. Everything that can change what
 * a token resolves to is watched at its cause — the cause taxonomy and its
 * listeners live in `live-token-causes.ts`.
 *
 * BUT THE CAUSE IS NOT THE MOMENT TO READ, and that distinction is the
 * whole of what this module got wrong first time round. A `<head>` mutation
 * fires when the link is APPENDED, which is before its styles are in the
 * cascade — so reading there returned the outgoing identity's values, and
 * the page sat with correctly re-painted swatches beside stale numbers.
 * Since what is printed is what the browser PAINTS, the moment to read it is
 * the frame in which it paints: every cause schedules a read on the next
 * animation frame. That is a rendering-lifecycle callback, not a settle
 * timeout — no duration is guessed, nothing is tuned to one machine's speed,
 * and several causes landing together coalesce into a single pass over the
 * rows instead of one pass each.
 */
import { createFrameScheduler } from './frame-scheduler';
import { observe } from './live-token-causes';

/** One token's current value. */
export interface LiveValue {
  /** What the browser paints: the used value where a painted property
   *  resolves one, the custom property's own value otherwise. */
  readonly value: string;
  /** The custom property as computed — the expression, for the tokens whose
   *  value is a function rather than a literal. */
  readonly expression: string;
}

export type LiveValues = ReadonlyMap<string, LiveValue>;

export interface LiveTokenValueStore {
  subscribe(listener: () => void): () => void;
  getSnapshot(): LiveValues;
  /** No values on the server: the whole point is that they come from a
   *  browser. Rows fall back to the value the kit declares. */
  getServerSnapshot(): LiveValues;
}

const NO_VALUES: LiveValues = new Map();

/**
 * One pass over every rendered row, so the whole table costs a single style
 * flush instead of one per token. Rows carry their token name; the specimen
 * inside carries the painted property to read back, when there is one.
 */
/** One row's reading. Styles are resolved through the row's OWN window,
 *  never the ambient one, which keeps the reader correct for an element
 *  living in a document other than this script's. */
function readRow(row: HTMLElement, view: Window): LiveValue {
  const name = row.dataset['token'] ?? '';
  const expression = view.getComputedStyle(row).getPropertyValue(name).trim();
  const paint = row.querySelector<HTMLElement>('[data-resolve]');
  const property = paint?.dataset['resolve'];
  const resolved =
    paint === null || property === undefined
      ? ''
      : view.getComputedStyle(paint).getPropertyValue(property).trim();
  return { value: resolved === '' ? expression : resolved, expression };
}

export function readTokenValues(scope: ParentNode): LiveValues {
  const values = new Map<string, LiveValue>();
  for (const row of scope.querySelectorAll<HTMLElement>('[data-token]')) {
    const name = row.dataset['token'];
    const view = row.ownerDocument.defaultView;
    // An empty attribute is a MISSING name, not the name of a token: the
    // dataset reports '' rather than undefined for `data-token=""`, and
    // letting that through would put an unnamed entry in the map.
    if (name !== undefined && name !== '' && view !== null) {
      values.set(name, readRow(row, view));
    }
  }
  return values;
}

function liveValuesEqual(a: LiveValues, b: LiveValues): boolean {
  if (a === b) {
    return true;
  }
  if (a.size !== b.size) {
    return false;
  }
  for (const [name, value] of a) {
    const other = b.get(name);
    if (other?.value !== value.value || other?.expression !== value.expression) {
      return false;
    }
  }
  return true;
}

export function createLiveTokenValueStore(
  resolveDocument: () => Document | null,
): LiveTokenValueStore {
  const listeners = new Set<() => void>();
  let snapshot: LiveValues = NO_VALUES;

  const reread = (): void => {
    const document = resolveDocument();
    const next = document === null ? NO_VALUES : readTokenValues(document);
    // Snapshot IDENTITY is the render gate: useSyncExternalStore re-renders
    // on object change, and the document-wide observer makes unrelated DOM
    // mutations common causes — an equal recompute keeps the SAME object so
    // the observe→read cycle is render-free by construction, never by the
    // read happening to be textually stable.
    if (!liveValuesEqual(snapshot, next)) {
      snapshot = next;
    }
    for (const listener of listeners) {
      listener();
    }
  };
  const scheduler = createFrameScheduler(resolveDocument, reread);

  return {
    subscribe: (listener: () => void): (() => void) => {
      listeners.add(listener);
      const document = resolveDocument();
      const stop = document === null ? null : observe(document, scheduler.schedule);
      // The opening read is immediate: the rows are already painted by the
      // time React subscribes, so there is nothing to wait a frame for.
      reread();
      return () => {
        listeners.delete(listener);
        stop?.();
        scheduler.cancel();
      };
    },
    getSnapshot: () => snapshot,
    getServerSnapshot: () => NO_VALUES,
  };
}

/** The page-wide store over the real document. */
export const liveTokenValues: LiveTokenValueStore = createLiveTokenValueStore(
  () => globalThis.document ?? null,
);
