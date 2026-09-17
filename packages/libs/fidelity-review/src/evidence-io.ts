/*
 * Where evidence lives under a demo root and how the run touches it —
 * the evidence-io seam, split by ROLE so each consumer's fake stays
 * minimal and a capture arm can never reach a diff-write leg
 * (assurance-round reshape, 2026-08-09): reads and writes are
 * Result-typed — an fs failure is a mechanical run failure with a
 * message, never an exception escaping into a catch-all. Paths are
 * demo-root-relative exactly as the pairing map declares them.
 * nodeEvidenceIo is the ONE real implementation; every test tier uses
 * plain fakes and in-memory PNGs.
 */
import fs from 'node:fs';
import path from 'node:path';

import { err, ok, type Result } from '@oaknational/result';

import { describeThrown } from './support';

/** The run's report directory for a demo root. The renderer's evidence
 *  links assume this EXACT position — two levels below the demo root
 *  (fidelity-html resolves `../../<evidence>`), so the location is the
 *  package's convention, never a caller choice. */
export function reportDirFor(demoDir: string): string {
  return path.join(demoDir, 'demo-evidence', 'fidelity-report');
}

/** The owner-edited disposition register's location under a demo root. */
export function registerPathFor(demoDir: string): string {
  return path.join(demoDir, 'fidelity-register.json');
}

/** Reading declared evidence. `exists` stays boolean: ABSENT evidence
 *  is a reportable row (missing-evidence), not a failure — an
 *  UNREADABLE existing file is the failure. */
export interface EvidenceReadIo {
  readonly exists: (demoRelativePath: string) => boolean;
  readonly read: (demoRelativePath: string) => Result<Buffer, string>;
}

/** Writing the per-pair diff PNGs into the report directory. */
export interface DiffWriteIo {
  readonly writeDiff: (diffPngName: string, bytes: Buffer) => Result<void, string>;
}

/** Reading the owner-edited disposition register: `undefined` means the
 *  file is absent (its own named refusal), a string is its raw JSON. */
export interface RegisterReadIo {
  readonly readRegister: () => Result<string | undefined, string>;
}

/** Writing the report surface (results.json, index.html). */
export interface ReportWriteIo {
  readonly writeReportFile: (name: string, content: string) => Result<void, string>;
}

/** Reading the capture manifest (the run's commit record): `undefined`
 *  means no capture has ever promoted — its own named refusal. */
export interface ManifestReadIo {
  readonly readManifest: () => Result<string | undefined, string>;
}

export interface EvidenceIo
  extends EvidenceReadIo, DiffWriteIo, RegisterReadIo, ReportWriteIo, ManifestReadIo {}

/** Read a text file that may legitimately be absent (absent is its own
 *  named state, never an error); an unreadable EXISTING file errs.
 *  Exported for the sibling real-io modules (run-lease-io). */
export function readTextIfExists(
  filePath: string,
  label: string,
): Result<string | undefined, string> {
  try {
    if (!fs.existsSync(filePath)) {
      return ok(undefined);
    }
    return ok(fs.readFileSync(filePath, 'utf8'));
  } catch (error: unknown) {
    return err(`${label} unreadable at ${filePath} — ${describeThrown(error)}`);
  }
}

/** The one real EvidenceIo: node fs rooted at `demoDir`, every leg
 *  catching into a Result so no fs throw escapes the seam. */
export function nodeEvidenceIo(demoDir: string): EvidenceIo {
  const reportDir = reportDirFor(demoDir);
  return {
    exists: (rel) => fs.existsSync(path.resolve(demoDir, rel)),
    read: (rel) => {
      try {
        return ok(fs.readFileSync(path.resolve(demoDir, rel)));
      } catch (error: unknown) {
        return err(`evidence unreadable at ${rel} — ${describeThrown(error)}`);
      }
    },
    writeDiff: (name, bytes) => {
      try {
        fs.writeFileSync(path.join(reportDir, name), bytes);
        return ok(undefined);
      } catch (error: unknown) {
        return err(`diff write failed at ${name} — ${describeThrown(error)}`);
      }
    },
    readRegister: () => readTextIfExists(registerPathFor(demoDir), 'register'),
    writeReportFile: (name, content) => {
      try {
        fs.writeFileSync(path.join(reportDir, name), content);
        return ok(undefined);
      } catch (error: unknown) {
        return err(`report write failed at ${name} — ${describeThrown(error)}`);
      }
    },
    readManifest: () =>
      readTextIfExists(
        path.join(demoDir, 'demo-evidence', CAPTURE_MANIFEST_NAME),
        'capture manifest',
      ),
  };
}

import { CAPTURE_MANIFEST_NAME } from './capture-manifest';
import type { CaptureStageIo } from './capture-session';

/** The one real CaptureStageIo: staging under
 *  demo-evidence/.staging/<runId>/ (same filesystem as the canonical
 *  tree, so every promotion rename is atomic per file), promotion by
 *  rename to the declared path, and the manifest committed by
 *  temp-write + rename so a torn write is a parse failure, never a
 *  plausible half-truth. */
export function nodeCaptureStageIo(demoDir: string, runId: string): CaptureStageIo {
  const stagingDir = path.join(demoDir, 'demo-evidence', '.staging', runId);
  return {
    stageWrite: (rel, bytes) => {
      try {
        const target = path.join(stagingDir, rel);
        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.writeFileSync(target, bytes);
        return ok(undefined);
      } catch (error: unknown) {
        return err(`stage write failed at ${rel} — ${describeThrown(error)}`);
      }
    },
    promoteFile: (rel) => {
      try {
        const target = path.resolve(demoDir, rel);
        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.renameSync(path.join(stagingDir, rel), target);
        return ok(undefined);
      } catch (error: unknown) {
        return err(`promotion failed at ${rel} — ${describeThrown(error)}`);
      }
    },
    writeManifest: (manifestJson) => {
      try {
        const evidenceDir = path.join(demoDir, 'demo-evidence');
        const tempPath = path.join(evidenceDir, `.${CAPTURE_MANIFEST_NAME}.tmp`);
        fs.writeFileSync(tempPath, manifestJson);
        fs.renameSync(tempPath, path.join(evidenceDir, CAPTURE_MANIFEST_NAME));
        return ok(undefined);
      } catch (error: unknown) {
        return err(`manifest write failed — ${describeThrown(error)}`);
      }
    },
  };
}
