/*
 * The staging half of the evidence-integrity keystone (EI-1): one
 * capture run's write session. Arms stage every shot through
 * `stage()` — hashed, recorded, written to the isolated staging area —
 * and ONLY a successful run calls `promote()`, which moves each staged
 * file to its canonical declared path and writes the manifest LAST (the
 * run's commit record; capture-manifest.ts owns its shape). A failed or
 * suspect run simply never promotes: the staged shots remain as
 * diagnostics and the canonical evidence set — and its manifest — stay
 * exactly as the last good run left them.
 *
 * Stateful but io-injected: the ordered promote-then-manifest sequence
 * and every refusal prove over a call-logging fake.
 */
import { err, ok, type Result } from '@oaknational/result';

import {
  CaptureManifestSchema,
  contentHashOf,
  isPromotableTarget,
  type CaptureManifestEntry,
} from './capture-manifest';

/** The staging io a session drives — real implementation in
 *  evidence-io.ts (nodeCaptureStageIo); fakes everywhere else. */
export interface CaptureStageIo {
  /** Write bytes into the isolated staging area at the declared path. */
  readonly stageWrite: (relativePath: string, bytes: Buffer) => Result<void, string>;
  /** Move one staged file to its canonical declared path. */
  readonly promoteFile: (relativePath: string) => Result<void, string>;
  /** Write the manifest at its canonical location — called LAST, and
   *  implemented as an atomic rename so a torn manifest is a parse
   *  failure, never a plausible half-truth. */
  readonly writeManifest: (manifestJson: string) => Result<void, string>;
}

export interface CaptureSessionMeta {
  readonly base: string;
  readonly widthCssPx: number;
  readonly deviceScaleFactor: number;
  readonly startedAt: string;
  /** Injected clock for the promotion stamp — no hidden Date. */
  readonly now: () => string;
}

export interface CaptureSession {
  /** Stage one shot at its declared demo-root-relative path. Refuses a
   *  non-promotable target outright — the vendor tree is unreachable
   *  from a capture session by construction. */
  readonly stage: (relativePath: string, bytes: Buffer) => Result<void, string>;
  /** Promote every staged file, then commit the manifest. */
  readonly promote: () => Result<void, string>;
}

/** Open one run's capture session over the injected staging io. */
export function createCaptureSession(io: CaptureStageIo, meta: CaptureSessionMeta): CaptureSession {
  const entries = new Map<string, CaptureManifestEntry>();
  return {
    stage: (relativePath, bytes) => {
      if (!isPromotableTarget(relativePath)) {
        return err(
          `capture session refuses to stage ${relativePath} — evidence lands only under demo-evidence/ (the vendor tree is read-only reference material)`,
        );
      }
      const wrote = io.stageWrite(relativePath, bytes);
      if (!wrote.ok) {
        return wrote;
      }
      entries.set(relativePath, {
        relativePath,
        widthCssPx: meta.widthCssPx,
        deviceScaleFactor: meta.deviceScaleFactor,
        contentHash: contentHashOf(bytes),
      });
      return ok(undefined);
    },
    promote: () => {
      if (entries.size === 0) {
        return err('capture session has nothing to promote — no shot was staged');
      }
      for (const relativePath of entries.keys()) {
        const moved = io.promoteFile(relativePath);
        if (!moved.ok) {
          // Fail BEFORE the manifest write: the previous manifest stays
          // in place and hash verification refuses the mixed set.
          return moved;
        }
      }
      const manifest = CaptureManifestSchema.safeParse({
        version: 1,
        base: meta.base,
        startedAt: meta.startedAt,
        promotedAt: meta.now(),
        entries: [...entries.values()],
      });
      if (!manifest.success) {
        return err(`capture session built an invalid manifest — ${manifest.error.message}`);
      }
      return io.writeManifest(JSON.stringify(manifest.data, null, 2));
    },
  };
}
