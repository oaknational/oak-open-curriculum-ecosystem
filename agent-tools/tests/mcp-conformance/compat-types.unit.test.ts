import { describe, expect, it } from 'vitest';

import {
  compatErrorEnvelopeSchema,
  compatReportSchema,
} from '../../src/mcp-conformance/compat-types.js';
import { loadCompatReport, loadFixtureRaw } from './test-helpers/fixture-loader.js';

/**
 * The compat operation's FAILURE boundary. Unlike the suites — where a failing
 * run still writes its full report to stdout and the exit code is
 * verdict-neutral — a failed `mcpjam compat` writes nothing to stdout and
 * describes itself only in a structured envelope on stderr. That envelope is
 * therefore the wrapper's sole evidence that a run happened and why it ended,
 * so it is parsed at a strict boundary rather than string-matched.
 *
 * The fixture is the REAL capture from an unauthenticated run against the
 * deployed alpha (2026-08-14): exit 1, zero bytes of stdout, this document on
 * stderr.
 */
const UNAUTH_ENVELOPE = loadFixtureRaw('compat-unauth-alpha-2026-08-14.json');

describe('compatErrorEnvelopeSchema — the failure channel is evidence, not prose', () => {
  it('parses the observed unauthenticated failure envelope', () => {
    const parsed = compatErrorEnvelopeSchema.safeParse(JSON.parse(UNAUTH_ENVELOPE));

    expect(parsed.success).toBe(true);
  });

  it('preserves the vendor code and message verbatim, so the reported cause is the vendor’s own', () => {
    const parsed = compatErrorEnvelopeSchema.parse(JSON.parse(UNAUTH_ENVELOPE));

    // The vendor classifies this 401 as INTERNAL_ERROR. The wrapper reports
    // what the vendor said; interpreting it into a friendlier code would put a
    // guess where the evidence should be.
    expect(parsed.error.code).toBe('INTERNAL_ERROR');
    expect(parsed.error.message).toContain('the server requires authorization (HTTP 401)');
  });

  it('refuses an envelope carrying no failure code', () => {
    const parsed = compatErrorEnvelopeSchema.safeParse({
      error: { message: 'something went wrong' },
    });

    expect(parsed.success).toBe(false);
  });

  it('refuses an envelope carrying no message', () => {
    const parsed = compatErrorEnvelopeSchema.safeParse({ error: { code: 'INTERNAL_ERROR' } });

    expect(parsed.success).toBe(false);
  });

  it('refuses an empty code, which would name no cause at all', () => {
    const parsed = compatErrorEnvelopeSchema.safeParse({
      error: { code: '', message: 'something went wrong' },
    });

    expect(parsed.success).toBe(false);
  });

  it('refuses an unrecognised envelope shape rather than reading a failure as parseable', () => {
    // A success report reaching the failure parser means the operation's own
    // dispatch is wrong. Accepting it here would let the wrapper report a
    // failure it never observed.
    const parsed = compatErrorEnvelopeSchema.safeParse({ hosts: [], summary: {} });

    expect(parsed.success).toBe(false);
  });

  it('refuses an envelope whose root is not an object', () => {
    expect(compatErrorEnvelopeSchema.safeParse('boom').success).toBe(false);
    expect(compatErrorEnvelopeSchema.safeParse(null).success).toBe(false);
  });

  it('admits the optional details the vendor may attach without widening the contract', () => {
    const parsed = compatErrorEnvelopeSchema.safeParse({
      error: { code: 'USAGE_ERROR', message: 'bad flag', details: { source: 'argv' } },
    });

    expect(parsed.success).toBe(true);
  });
});

/**
 * The SUCCESS boundary. The positive cases run against the REAL capture from
 * a compat run over Oak's own served surface (2026-08-15, offline catalogue),
 * so they describe the exact bytes the wrapper meets in production.
 *
 * The rejection cases are built as literals rather than by mutating that
 * capture. Mutating a parsed report into an invalid state needs a type
 * assertion to defeat the very types under test, and this repo bans
 * assertions for exactly that reason: a test that asserts its way past the
 * type system stops describing the boundary it claims to describe.
 */
const OAK_CAPTURE = 'compat-local-oak-2026-08-15.json';

/** A minimal well-formed report; each rejection case overrides one field. */
function minimalReport(): Record<string, unknown> {
  return {
    target: 'http://localhost:3333/mcp',
    catalogSource: 'bundled',
    catalogVersion: 0,
    widgets: { total: 1, appOnly: 0 },
    unknownDimensions: [],
    summary: { works: 1, degraded: 0, blocked: 0, unknown: 0 },
    hosts: [
      {
        hostId: 'claude',
        hostLabel: 'Claude',
        verdict: 'works',
        provenance: 'assumed',
        findings: [],
      },
    ],
  };
}

describe('compatReportSchema — the verdict document is parsed strictly', () => {
  it('parses the observed compat report against Oak’s served surface', () => {
    const parsed = compatReportSchema.safeParse(JSON.parse(loadFixtureRaw(OAK_CAPTURE)));

    expect(parsed.success).toBe(true);
  });

  it('exposes every catalogue host with its verdict and provenance', () => {
    const report = loadCompatReport(OAK_CAPTURE);

    expect(report.hosts).toHaveLength(16);
    expect(report.hosts.map((host) => host.hostId)).toContain('claude');
  });

  it('reads the offline catalogue pin the wrapper depends on for determinism', () => {
    const report = loadCompatReport(OAK_CAPTURE);

    // Fixture-hygiene sentinel: if this goes red, the fixture was re-captured
    // WITHOUT --offline. Re-capture with the pin; never edit these values.
    expect(report.catalogSource, 're-capture the fixture with --offline').toBe('bundled');
    expect(report.catalogVersion, 're-capture the fixture with --offline').toBe(0);
  });

  it('carries findings whose capability is present only where the vendor set one', () => {
    const findings = loadCompatReport(OAK_CAPTURE).hosts.flatMap((host) => host.findings);
    const fallback = findings.find((finding) => finding.code === 'widget_text_fallback');
    const capabilityGap = findings.find((finding) => finding.code === 'capability_unsupported');

    // Guard first: with no fallback finding in the capture at all, the
    // `capability` assertion below would pass vacuously on `undefined`.
    expect(fallback, 'the Oak capture must carry a widget_text_fallback finding').toBeDefined();
    expect(fallback?.capability).toBeUndefined();
    expect(capabilityGap?.capability).toBeDefined();
  });

  it('refuses an unrecognised verdict rather than widening the enum', () => {
    const report = minimalReport();
    report.hosts = [{ ...minimalHost(), verdict: 'mostly-fine' }];

    expect(compatReportSchema.safeParse(report).success).toBe(false);
  });

  it('refuses an unrecognised provenance, which grades how far a verdict can be trusted', () => {
    const report = minimalReport();
    report.hosts = [{ ...minimalHost(), provenance: 'vibes' }];

    expect(compatReportSchema.safeParse(report).success).toBe(false);
  });

  it('refuses an unrecognised finding code, so a new vendor finding class cannot pass unnoticed', () => {
    const report = minimalReport();
    report.hosts = [
      {
        ...minimalHost(),
        findings: [
          {
            lane: 'apps',
            severity: 'degraded',
            code: 'brand_new_class',
            title: 'x',
            detail: 'y',
          },
        ],
      },
    ];

    expect(compatReportSchema.safeParse(report).success).toBe(false);
  });

  it('refuses an empty host list, which carries no verdict semantics', () => {
    const report = minimalReport();
    report.hosts = [];

    expect(compatReportSchema.safeParse(report).success).toBe(false);
  });

  it('refuses an unknown top-level key, so a reporter change surfaces loudly', () => {
    const report = minimalReport();
    report.newVendorField = 'surprise';

    expect(compatReportSchema.safeParse(report).success).toBe(false);
  });

  it('parses a live-catalogue capture — catalogue policy is the invocation’s job, not the parser’s', () => {
    // Not a schema violation — `live` is a real vendor value. The offline pin
    // lives in the composed argv (`composeCompatArgs`), so the parser must
    // still read a capture taken without it rather than destroy the evidence
    // of how that capture was taken.
    const report = minimalReport();
    report.catalogSource = 'live';
    report.catalogVersion = 42;

    expect(compatReportSchema.safeParse(report).success).toBe(true);
  });
});

/** One well-formed host; rejection cases spread over it with one bad field. */
function minimalHost(): Record<string, unknown> {
  return {
    hostId: 'claude',
    hostLabel: 'Claude',
    verdict: 'works',
    provenance: 'assumed',
    findings: [],
  };
}
