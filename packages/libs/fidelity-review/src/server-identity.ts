/*
 * The app-identity sentinel (assurance LC-2): answering is not
 * identity. A startup race or a mistyped --base can bind a DIFFERENT
 * service to the base; capturing it silently presents infrastructure
 * failure as product divergence. Every reachability decision therefore
 * judges the served body for the app's oak-app marker — on the attach
 * path (where the hazard is largest), the spawn-ready path, and the
 * standalone assertion alike.
 */
import { err, ok, type Result } from '@oaknational/result';

import { describeThrown } from './support';

/** What a server told us when probed for identity. */
export interface IdentityProbe {
  readonly status: number;
  readonly body: string;
}

/** The app-identity sentinel: the served page must carry the app's
 *  oak-app marker. `responds` alone proves only that SOMETHING answers
 *  — a startup race or a wrong --base can bind a different service,
 *  and a foreign capture target is the "infrastructure failure
 *  presented as product divergence" class (assurance LC-2/SOL-1). */
export interface ServerSentinel {
  /** Path fetched for the identity check (usually '/'). */
  readonly path: string;
  /** The app marker the body must carry alongside the oak-app meta. */
  readonly marker: string;
}

/** Judge a probed response against the sentinel. Pure: 2xx AND both
 *  the oak-app meta name and the app marker present in the body. */
export function judgeServerIdentity(
  probe: IdentityProbe,
  sentinel: ServerSentinel,
): Result<void, string> {
  if (probe.status < 200 || probe.status >= 300) {
    return err(`server identity check got HTTP ${String(probe.status)} at ${sentinel.path}`);
  }
  if (!probe.body.includes('oak-app') || !probe.body.includes(sentinel.marker)) {
    return err(
      `the server answering is NOT this app (no oak-app marker ${JSON.stringify(sentinel.marker)} at ${sentinel.path}) — a foreign service is bound to the base; refusing to capture it`,
    );
  }
  return ok(undefined);
}

/** Fetch the sentinel path and judge identity (bounded like responds). */
export async function probeIdentity(
  base: string,
  sentinel: ServerSentinel,
): Promise<Result<void, string>> {
  try {
    const response = await fetch(`${base}${sentinel.path}`, {
      signal: AbortSignal.timeout(5000),
    });
    return judgeServerIdentity({ status: response.status, body: await response.text() }, sentinel);
  } catch (error: unknown) {
    return err(`server identity check failed — ${describeThrown(error)}`);
  }
}
