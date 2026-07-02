/**
 * Stage prompts for the corpus-analysis workflow pipeline.
 *
 * @remarks
 * The single home of the four prompt builders — moved VERBATIM from the retired
 * hand-authored workflow scripts (the migration commit carries the byte-diff evidence).
 * The prompt text is behaviour: a wording change changes what the agents extract, so
 * edits here are corpus-analysis design changes, not copy tweaks. Pure string builders;
 * unit tests pin the load-bearing clauses (grain, kind rule, falsifiers).
 *
 * @packageDocumentation
 */

import type { AdversaryLens, Candidate, LeafSignal } from '../judgment-schemas.js';
import type { Baseline } from '../recall-schemas.js';
import type { DispositionedCandidate, GroundingLeaf, PartitionWindow } from './stage-io.js';

/** The baseline projection the meta agent sees: `{id, population, statement}` only. */
export type MetaBaseline = Pick<Baseline, 'id' | 'population' | 'statement'>;

/** MAP — extract atomic actuator-grained leaf signals from one corpus window. */
export function mapPrompt(w: PartitionWindow): string {
  return [
    'You are the MAP stage of a corpus-analysis pipeline over an AI engineering agent\'s working-memory "napkin" corpus (dated session notes capturing mistakes, corrections, surprises, and what works).',
    `This is ONE time-contiguous window: ${w.window}.`,
    'Use the Read tool to read EVERY one of these files IN FULL before extracting (paths are relative to the repository root):',
    w.files.map((f) => `  - ${f}`).join('\n'),
    '',
    'Extract high-recall atomic LEAF signals across these five spanning categories:',
    '  - motif: a recurring theme, practice, or idea',
    '  - surprise: something unexpected, counter-intuitive, or that violated an expectation',
    '  - tension: a conflict, trade-off, friction, or competing pull',
    '  - shift: a change over time, a regime change, an abandoned or adopted approach',
    '  - behavioural-reflex: a repeated agent action or habit (good or bad)',
    '',
    'GRAIN — name the ACTUATOR, not just the theme. Every leaf statement MUST name the concrete mechanism the signal operates THROUGH: the specific file or path, the command or script, the lifecycle moment (session-open / pre-commit / compaction / closeout / heartbeat / …), the prompt or template, the identity tuple, or the config/flag. "commit hygiene improved" is a theme; "pre-commit promoted peer-owned files into the staged set because format:root auto-fix ran repo-wide" names the actuator. Two signals that share a theme but operate through DIFFERENT actuators are TWO leaves, never one — distinct actuators MUST stay separable downstream.',
    'TIME-POINT — for a shift or behavioural-reflex that changed over time, the statement MUST name WHEN (the dated entry / this window) the change occurred and in which DIRECTION, and the grounding should cite the time-point(s) that anchor the before/after.',
    '',
    'Recall over precision — FALSE POSITIVES ARE WELCOME. A typical window yields 20-40 leaves.',
    'Each leaf: a unique id prefixed with the window (e.g. ' +
      w.window +
      '-L01), the window id, the category, a one-sentence statement (naming its actuator per GRAIN above), grounding (>=1 citation: napkinDate = the dated entry, quote = a short verbatim excerpt that anchors the signal), and your confidence (low/med/high).',
    'Emit ONLY leaves for THIS window.',
  ].join('\n');
}

/** REDUCE — cluster leaves into mechanism-grained and longitudinal candidates. */
export function reducePrompt(leaves: readonly LeafSignal[]): string {
  return [
    'You are the REDUCE stage. Below are atomic LEAF signals extracted across the time-contiguous windows of an AI-agent napkin corpus (each leaf names the concrete ACTUATOR it operates through). Cluster them into CANDIDATE patterns.',
    '',
    'CLUSTER BY MECHANISM, NOT THEME. A candidate is ONE coherent mechanism — the specific actuator (file / command / lifecycle-moment / template / identity-tuple / config) a set of leaves share. Keep DISTINCT actuators as SEPARATE candidates even when they share a broad theme: do NOT merge distinct mechanisms into a broad thematic parent — that dissolves the grain this run exists to preserve. Equally, do NOT shatter a single genuinely-broad recurring mechanism into per-window fragments — a real broad pattern that spans many windows stays ONE coherent candidate.',
    '',
    'There is NO target candidate count. Emit as many distinct-mechanism candidates as the leaves genuinely support — neither pad nor merge to hit a number. A mechanism strongly attested even within a SINGLE window MAY be a candidate (its remit is judged downstream); cross-window recurrence is valuable but is NOT a precondition for emitting a candidate.',
    '',
    'SURFACE LONGITUDINAL PATTERNS as first-class candidates, not only flat recurrences. Use the kind field precisely:',
    '  - trajectory: a mechanism whose character or strength changes across the corpus timeline (name the direction).',
    '  - regime: a distinct operating MODE active in some windows and not others (name which windows).',
    "  - relational-lagged: one mechanism's appearance systematically PRECEDING another's later.",
    "  - distributional: a mechanism's frequency or spread shifting across the timeline.",
    'For ANY longitudinal candidate (trajectory / regime / relational-lagged / distributional), supportingWindows MUST span the windows the claim actually covers, and the pattern statement MUST name the direction of change (or which windows the regime is active in) with its time-points. A longitudinal claim whose grounding is UNIFORM across all the windows it spans is an artefact of even sampling — do NOT emit it as longitudinal.',
    '',
    'For each candidate emit: a unique id (e.g. C01); a one-sentence pattern statement (CONCISE — name the actuator and, for longitudinal kinds, the temporal structure; do not pad); a kind (see the KIND rule below); isAbsenceClaim (true ONLY for negative-space findings); supportingWindows (ALL the DISTINCT window ids it appears in); supportingLeafIds (UP TO 10 of the MOST REPRESENTATIVE leaf ids that best ground the candidate — NOT all of them); and groundingCount (the TRUE total count of leaves you clustered, even though you list only the representative ids).',
    'KIND RULE: `kind` is the PATTERN\'s type, NEVER a leaf category. It MUST be EXACTLY one of: recurrence | trajectory | relational-lagged | regime | distributional | behavioural | absence | meta. Do NOT emit a leaf category (motif | surprise | tension | shift | behavioural-reflex) as a kind — map a "shift" leaf to kind "trajectory" or "regime", and "motif"/"surprise"/"tension" leaves to the mechanism\'s kind (usually "recurrence" or "behavioural").',
    '',
    'ALSO run the NEGATIVE-SPACE probe and emit any findings as absence candidates (isAbsenceClaim:true, kind:"absence"):',
    '  - temporal: a pattern clearly present early in the corpus then absent later (or vice-versa).',
    '  - structural: the napkin is declared to track "mistakes, corrections, surprises, and what works" — is any one of those declared categories conspicuously absent from the actual contents?',
    '',
    'Output COMPACT JSON only — the structured object and nothing else (no prose, no markdown, no preamble).',
    '',
    'LEAVES:',
    JSON.stringify(leaves),
  ].join('\n');
}

/**
 * Assemble the verbatim grounding excerpts for one candidate from its representative
 * leaf ids — the exact lines the voter judges `grounded` against.
 */
export function assembleGroundingLines(
  candidate: Candidate,
  leafById: ReadonlyMap<string, GroundingLeaf>,
): string {
  return candidate.supportingLeafIds
    .flatMap((id) => {
      const leaf = leafById.get(id);
      return leaf === undefined
        ? []
        : leaf.grounding.map((g) => `  - [${leaf.window} ${g.napkinDate}] ${g.quote}`);
    })
    .join('\n');
}

/** VALIDATE — one adversary voter's judgment of one candidate. */
export function votePrompt(input: {
  readonly candidate: Candidate;
  readonly lens: AdversaryLens | undefined;
  readonly groundingLines: string;
}): string {
  const { candidate, lens, groundingLines } = input;
  return [
    'You are an ADVERSARY voter judging ONE candidate emergent pattern from a corpus-analysis run over an AI engineering agent\'s working-memory "napkin" corpus. Be SKEPTICAL: a FALSE KEEP (ratifying a pattern that is not actually real) is the costly, asymmetric error — when uncertain, fail the test.',
    '',
    `Candidate: ${candidate.pattern}`,
    `Kind: ${candidate.kind}   Absence-claim: ${candidate.isAbsenceClaim}   Spans windows: ${candidate.supportingWindows.join(', ')}`,
    'Supporting grounding (verbatim corpus excerpts clustered into this candidate):',
    groundingLines || '  (no grounding citations were attached)',
    '',
    lens
      ? `Judge PRIMARILY through the "${lens}" lens (correctness-grounding = is it truly anchored in the cited entries; base-rate = would it appear in any comparable corpus by chance; null-reproduction = does a plausible null hypothesis reproduce it).`
      : 'Judge across all four tests evenly.',
    '',
    "Judge ONLY from the evidence supplied in this prompt — you have no tools: the grounding above was extracted mechanically from the pinned corpus, survivors' quotes are re-verified deterministically after the run, and your turn budget is tight. Respond with the single required structured output call — nothing else.",
    '',
    'Emit, for EACH of the four conjunctive apophenia tests, pass (boolean) + confidence (low/med/high):',
    '  - grounded: genuinely anchored in the cited corpus entries (quotes real and on-point, not hallucinated or mis-attributed)?',
    '  - baseRateHolds: more than the base rate — would NOT trivially appear in any comparable corpus by coincidence?',
    '  - survivesNull: survives a null hypothesis — a real signal, not noise dressed as a pattern?',
    '  - notArtefact: a real phenomenon, NOT an artefact of how the corpus was written, sampled, or how leaves were clustered?',
    candidate.isAbsenceClaim
      ? '  (ABSENCE claim: "grounded" means shown GENUINELY ABSENT, not merely unsampled — the falsifier is finding it present somewhere in the corpus.)'
      : '',
    ['trajectory', 'regime', 'relational-lagged', 'distributional'].includes(candidate.kind)
      ? `  (LONGITUDINAL claim (kind=${candidate.kind}): "grounded" and "notArtefact" ADDITIONALLY require the cited grounding to PARTITION across the corpus timeline in a way that MATCHES the claim — a trajectory/distributional must show early-vs-late grounding that DIFFERS in the claimed direction; a regime must show the mode present in some windows and absent in others; a relational-lagged must show one mechanism's windows preceding the other's. Grounding that is UNIFORM across all the windows the candidate spans is an even-sampling artefact, not a longitudinal signal — fail notArtefact (and fail grounded when the temporal structure IS the substance of the claim).)`
      : '',
    '',
    "Also rate the candidate's importance (low/med/high). Do NOT emit any keep/kill/reroute decision — only the four test judgments and importance; the disposition is computed deterministically downstream.",
  ].join('\n');
}

/** META — per-baseline recall matches + per-candidate corroboration claims. */
export function metaPrompt(
  candidatesWithDisposition: readonly DispositionedCandidate[],
  baselines: readonly MetaBaseline[],
): string {
  return [
    'You are the META stage — the recall calibration. For EACH of the 18 known-present baseline patterns below (drawn from prior hand-authored syntheses of THIS corpus), judge whether this Discovery run RE-FOUND it, and via which candidate.',
    '',
    'The run\'s FINDINGS are the candidates with disposition "keep" or "reroute". A baseline matched only by a "kill"/"held-for-review" candidate counts as MISSED (the run did not surface it as a finding).',
    '',
    'For each baseline emit a RECALL-MATCH: baselineId, verdict, matchedCandidateId, note.',
    '  verdict ∈ subsumes (a finding fully covers and extends the baseline) | refines (captures it at finer grain) | equal (same grain) | partial (overlaps but misses substance) | missed (not re-found among findings).',
    '  matchedCandidateId: REQUIRED for any non-missed verdict (name the candidate id); OMIT IT ENTIRELY for "missed".',
    '  note: one sentence.',
    '',
    'ALSO, for each KEPT candidate that you believe has already graduated to a durable home, emit a corroboration claim: candidateId + claimedHomePaths (on-disk file paths under .agent/memory/active/patterns/ or .agent/rules/ that encode this pattern). Verify with Glob/Grep/Read before naming a path — your read-only search tools exist for exactly this; a downstream check re-verifies each path exists. Never invent a path you have not seen.',
    '',
    "ALSO emit discountNote (a qualitative caveat on this run's reliability) and synthesisNotes (3-8 key qualitative takeaways). Emit NO numbers, fractions, or aggregate recall — only per-item judgments and prose.",
    '',
    'BASELINES (18):',
    JSON.stringify(baselines),
    '',
    'CANDIDATES (with disposition):',
    JSON.stringify(candidatesWithDisposition),
  ].join('\n');
}
