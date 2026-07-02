import type { Baseline } from './recall-schemas.js';

/**
 * Frozen recall-calibration baseline for the napkin Discovery rerun (v2).
 *
 * Eighteen known-present patterns drawn from the three attested prior-synthesis arcs
 * (claims-doctrine, collaboration-protocol, validation/TDD), each with its population
 * hand-pinned as REVIEWED DATA — not auto-derived (the v2 design rejects a blind typing
 * engine; the run author already knows the populations). The headline recall denominator is
 * the emergent subset; single-window structural defects are out-of-remit and reported
 * separately, never scored as Discovery misses.
 *
 * Population pinning follows the v1 proving run's first-hand assessment
 * (`napkin-discovery-pass-1-2026-06-29.md` §Recall): the eight single-window baselines below
 * are exactly the eight it identified as structural defects an emergence pass is designed not
 * to surface (no cross-window recurrence). The v2 count of 18 is reached by splitting CP-2
 * into the recurring commit-window assumption (emergent) plus the COMMIT_EDITMSG single-writer
 * mechanism (single-window), and VT-4 into the two reviewer-mechanics points (both
 * single-window), and treating the substrate-is-doctrine meta through-line as the arc's
 * framing rather than a counted pattern.
 *
 * Frozen and version-controlled before the rerun. Treat changes as a recalibration of the
 * gate, not an edit.
 */
const S0513 = 'historical-napkin-synthesis-2026-05-13.md';
const S0529 = 'historical-napkin-synthesis-2026-05-29.md';

export const RECALL_BASELINES: readonly Baseline[] = [
  // --- Emergent subset (within Discovery's remit; the headline-recall denominator) ---
  {
    id: 'capture-does-not-cure',
    statement:
      'declarative capture is not procedural inhibition — an agent holding a rule still walks into the named failure seconds later; only a structural action-time interrupt has traction',
    kind: 'recurrence',
    population: 'emergent',
    sourceCitations: [
      { synthesis: S0513, locator: '§F1 capture-doesn’t-cure' },
      { synthesis: S0529, locator: '§A1 rule-traction gap' },
    ],
  },
  {
    id: 'inherited-state-is-a-hypothesis',
    statement:
      'thread records, closeout broadcasts and prior grounding describe past disk state, not current truth; agents claimed "foundation complete" without running a gate',
    kind: 'recurrence',
    population: 'emergent',
    sourceCitations: [
      { synthesis: S0529, locator: '§C7 inherited state is a hypothesis' },
      { synthesis: S0513, locator: '§F5 thread-record drift' },
    ],
  },
  {
    id: 'coordinator-amplifies-unseen-defect',
    statement:
      'a coordinator writes coordination artefacts subject to the very gates and races it manages (over-write), with caution misread as licence to do nothing (under-write) as the inverse',
    kind: 'recurrence',
    population: 'emergent',
    sourceCitations: [{ synthesis: S0513, locator: '§F2 coordinator amplifies the unseen defect' }],
  },
  {
    id: 'commit-window-single-agent-assumption',
    statement:
      'the multi-agent commit-window protocol assumes single-agent ownership, so cross-agent handover or concurrent staging produces wrong-attribution commits',
    kind: 'recurrence',
    population: 'emergent',
    sourceCitations: [
      { synthesis: S0513, locator: '§F4 commit-window assumes single-agent ownership' },
    ],
  },
  {
    id: 'repo-wide-autofix-sweep-footgun',
    statement:
      'repo-wide auto-fix (format:root / markdownlint:root) lets pre-commit promote auto-fix output into the staged set, absorbing peer-owned files in a multi-agent dirty tree',
    kind: 'behavioural',
    population: 'emergent',
    sourceCitations: [{ synthesis: S0529, locator: '§B3 repo-wide auto-fix sweep footgun' }],
  },
  {
    id: 'cron-template-overrides-owner-direction',
    statement:
      'a cron prompt body that says "return to whatever task is in flight" fires before the agent reads owner direction, silently overriding pause/stop/hold every cycle',
    kind: 'behavioural',
    population: 'emergent',
    sourceCitations: [{ synthesis: S0529, locator: '§C4 cron-prompt-template override' }],
  },
  {
    id: 'compaction-is-a-checkpoint',
    statement:
      'compaction is a checkpoint not a continuation: monitors are not preserved and crons only non-deterministically, so post-compaction must re-verify watcher, cron, staged set, and claims',
    kind: 'regime',
    population: 'emergent',
    sourceCitations: [{ synthesis: S0529, locator: '§C5 compaction is a checkpoint' }],
  },
  {
    id: 'peer-primary-topology-regime',
    statement:
      'peer-primary topology (dual loops, disjoint lanes, no coordinator) is a distinct operating mode whose cost is shared-resource contention, not coordination protocol',
    kind: 'regime',
    population: 'emergent',
    sourceCitations: [{ synthesis: S0529, locator: '§C1 peer-primary topology' }],
  },
  {
    id: 'claims-open-minimum-field-silent-reject',
    statement:
      'omitting any required flag from `claims open` produces a silent rejection — a recurring helper friction at the claims boundary',
    kind: 'behavioural',
    population: 'emergent',
    sourceCitations: [
      { synthesis: S0529, locator: '§F4 claims-open minimum-field silent rejection' },
    ],
  },
  {
    id: 're-run-git-status-post-gate',
    statement:
      'a long gate run can widen the diff surface while it runs, so a cleanliness or handoff claim from a pre-gate status is a recurring false-clean assertion; recompute status post-gate',
    kind: 'behavioural',
    population: 'emergent',
    sourceCitations: [{ synthesis: S0529, locator: '§B5 re-run git status after long gate runs' }],
  },
  // --- Single-window subset (out-of-remit structural defects; reported, not scored) ---
  {
    id: 'completion-language-overload',
    statement:
      'completion language conflates four distinct states (slice landed / claim closed / workstream accepted / user value delivered); truthful closeout needs an explicit verdict',
    kind: 'meta',
    population: 'single-window',
    sourceCitations: [
      { synthesis: S0513, locator: '§F3 completion language overloaded' },
      { synthesis: S0529, locator: '§D2 truthful closeout verdicts' },
    ],
  },
  {
    id: 'commit-editmsg-single-writer',
    statement:
      '.git/COMMIT_EDITMSG is single-writer, so concurrent message-file writes during a handover produce a wrong-attribution commit',
    kind: 'behavioural',
    population: 'single-window',
    sourceCitations: [{ synthesis: S0529, locator: '§B1 COMMIT_EDITMSG single-writer' }],
  },
  {
    id: 'record-staged-full-index-fingerprint',
    statement:
      'commit-queue `record-staged` fingerprints the full git index rather than the declared intent.files, so peer-staged content rides into unrelated commits',
    kind: 'behavioural',
    population: 'single-window',
    sourceCitations: [
      { synthesis: S0529, locator: '§B2 record-staged fingerprints the full index' },
    ],
  },
  {
    id: 'identity-tuple-insufficiency',
    statement:
      'the (agent_name, platform, session_id_prefix) routing tuple cannot disambiguate whether three names are one renamed session or three separate sessions',
    kind: 'behavioural',
    population: 'single-window',
    sourceCitations: [{ synthesis: S0513, locator: '§F7 identity routing-tuple insufficient' }],
  },
  {
    id: 'presence-vs-ownership-collapse',
    statement:
      'the team-start template’s "Claimed paths" field makes agents open source claims at presence-announcement time, turning rendezvous into a herd claim event',
    kind: 'behavioural',
    population: 'single-window',
    sourceCitations: [{ synthesis: S0529, locator: '§C2 presence-vs-ownership collapse' }],
  },
  {
    id: 'skill-invocation-not-owner-direction',
    statement:
      'a skill invocation is not owner direction — the agent must not treat being handed a skill as a standing instruction superseding explicit owner input',
    kind: 'behavioural',
    population: 'single-window',
    sourceCitations: [{ synthesis: S0529, locator: '§C3 skill-invocation is not owner-direction' }],
  },
  {
    id: 'reviewer-pre-execution-catch',
    statement:
      'pre-execution review surfaces what the author cannot see because the reviewer lacks the author’s prior-context rationalisation — the mechanism static gates and post-review miss',
    kind: 'behavioural',
    population: 'single-window',
    sourceCitations: [{ synthesis: S0529, locator: '§E1 pre-execution review catches the unseen' }],
  },
  {
    id: 'reviewer-cycle-split-on-convergence',
    statement:
      'when reviewers converge on blocking a planned cycle, scope-narrow to a successor cycle rather than carry known-bad scope forward',
    kind: 'behavioural',
    population: 'single-window',
    sourceCitations: [{ synthesis: S0529, locator: '§E2 cycle-split on reviewer convergence' }],
  },
];
