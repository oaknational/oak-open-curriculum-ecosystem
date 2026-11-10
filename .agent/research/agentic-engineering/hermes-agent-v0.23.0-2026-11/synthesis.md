# Synthesis: Hermes Agent v0.23.0 in its own terms

Reader: the owner. Decision served: whether to open the comparison session, and what it may rely
on. Inquiry `hermes-agent-architecture-2026-11`, revision 2. Written 2026-11-10 (UTC) by Swift
holds Aether, a Claude Code cloud session.

## 1. Status

**`provisional`.**

Every statement about what Hermes does at runtime rests on static reading of code and tests at
`NousResearch/hermes-agent` commit `2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19` (tag `v0.23.0`) and
`NousResearch/hermes-agent-self-evolution` commit `0a929e3aa20e15cf04dc7c28492a7d41a5139125`.
Nothing was run and nothing was observed running.

| The status permits | The status forbids |
| --- | --- |
| Relying on a **Fact** row of `evidence-log.md` as a true statement of what the cited line says at the pinned commit | Reading any row as an observation of Hermes behaving that way in use |
| Using the glossary's terms with Hermes's quoted meanings | Extending a row to a later release; the inquiry reopens when a release changes a module in the Phase 4 inventory |
| Using the store cards, L1 to L10 and the own-terms verdict rows as the input to the comparison | Relying on rows marked **Open**, **Assumption to verify** or `[unverified]` without re-reading them |
| Citing the differences between Hermes's documents and its code that the rows record | Reading a difference as a defect report or as adoption advice; neither was in scope |

Why not `validated`: the verification passes were all made by one model family in one session,
several key questions carry `[unverified]` parts (section 4), and static reading cannot reach the
property that matters most to a learning system, which is what the model does with the prompts
and tools the code gives it.

## 2. Verdicts

### 2.1 Repository architecture (Q-A)

Hermes's decomposition and request path are as its documents describe them. Its documented
counts are stale, and its tool dependency chain is drawn as one-way where the measured import
graph is cyclic at function level. Detail: `architecture-map.md`, A6.

### 2.2 Memory, learning and self-improvement (Q-L)

The eleven own-terms verdict rows are in `memory-learning-architecture.md` section 9. In short:

| Id | Verdict |
| --- | --- |
| V-1 | "Creates skills from experience": matches. Two creation paths, both fed by one conversation's transcript. |
| V-2 | "Skills self-improve during use": the update is written after the turn and takes effect at a later load; nothing scores it as an improvement. |
| V-3 | "Nudges itself": the mechanism is a counter-triggered second agent after the reply, not a reminder to the acting agent. |
| V-4 | "Frozen snapshot … until the next session": frozen, and also reloaded after compression and on an operator refresh. |
| V-5 | "Session search with LLM summarization" (README): the tool makes no model call; the user guide agrees with the code. |
| V-6 | "Consent-aware learning loop": both approval gates default to off; one class of write (an unattended review's memory patch or remove) is always held for approval. |
| V-7 | Curator thresholds: 14 and 30 days in code; one line of the guide still says 30 and 90. |
| V-8 | "Only manages agent-created skills": matches; `created_by` is a policy flag set by the review fork or by `adopt`. |
| V-9 | Self-evolution "measurably better … PR … full test suite": the implemented measure is a word-overlap score, and the judge, the test gate and the pull request are not wired. |
| V-10 | Self-evolution "operates ON hermes-agent — not part of it": matches. |
| V-11 | "A deepening model of who you are": with the built-in store alone it is a 1,375-character file the model must make room in. |

Frame verdict per time scale: Hermes's account holds within a turn, within a session, across
sessions and for periodic maintenance, with the wording differences above. It does not hold for
the offline loop, where the code does less than the account. No mechanism exists across
installations or at model weights, and Hermes claims none.

## 3. Reconciling the evidence streams

Four streams were kept apart and then set side by side: the cold pass (code only, made first),
Hermes's own account (quoted), the code read beside that account, and three tests read as
specifications.

| Where the streams agree | Where they disagree, kept visible |
| --- | --- |
| Every durable write the account describes was found by the cold pass before the account was read. | The cold pass found writes the account does not mention: drift `.bak` files, a suppression list, a prompt snapshot cache, a verification evidence database. All were resolved as supporting files, none as a hidden learning store. |
| The three tests read agree with the code they cover. | The README and the code disagree on session search (V-5). |
| The developer guide's tier model matches `build_system_prompt_parts`. | Two developer-guide pages describe compaction as creating a child session; the default configuration compacts in place (ledger row H5). |
| | The self-evolution README and the self-evolution code disagree on three points (V-9). |
| | The example configuration and the code fallback disagree on the skill review interval: 15 against 10. |

## 4. Epistemic Profile

### 4.1 Coverage per key question

| Question | Coverage | Open parts |
| --- | --- | --- |
| A1 entry points | Scripts and the gateway path read in code | The CLI, cron, batch and ACP routes to the agent are documented-only |
| A2 turn | Loop entry, prompt build, tool round and finaliser read in code | The model API call, streaming and in-loop persistence |
| A3 tools | Read in code | Tool search internals |
| A4 extension | Interfaces enumerated from source | Loading location for four interfaces |
| A5 state | Paths cited | Not a full inventory of the home directory |
| A6 match | Measured | — |
| L1 stores | Seven cards read in code | Session database schema and pruning; provider internals |
| L2, L3 writers and triggers | Read in code | Session-end memory extraction for the built-in store |
| L4 re-entry | Read in code | Per-turn provider recall |
| L5 controls | Read in code | The terminal lock check's coverage, beyond its own stated limit |
| L6 retention | Read in code | — |
| L7 evidence of effect | Negative, by a sweep with a known positive | Bounded by the sweep's vocabulary and three trees |
| L8 offline loop | Read in full for `evolve_skill`, `fitness`, `constraints` | Dataset builders and importers read in part |
| L9 research path | Module headers and one document | `evals/`; `batch_runner.py` internals |
| L10 failure modes | Seventeen quoted | Only the documents and prompts read; issue threads were not read |

### 4.2 Rung reached per claim kind

| Claim kind | Highest rung reached |
| --- | --- |
| Intent (what Hermes says a thing is for) | Hermes's documents at the tag, quoted |
| Mechanism (what the code does) | Code read at the tag; tests for three claims |
| Measurement | This session's own commands on the pinned clone |
| Runtime behaviour | Not reached; no claim is worded as observed |

### 4.3 Open conflicts

1. README against code on session search (V-5).
2. Self-evolution README against code on the judge, the test gate and the pull request (V-9).
3. The developer guide against the default configuration on compaction lineage (H5).
4. The example configuration against the code fallback on `skills.creation_nudge_interval`.
5. The user guide against itself on curator thresholds (V-7), and the prompt-assembly page
   against itself on the skills index tier.

### 4.4 Shared-source dependence

- Hermes's README, user guide, developer guide, `AGENTS.md` files, code comments and docstrings
  come from the same maintainers. Agreement among them is one source agreeing with itself.
- Where a mechanism claim cites a docstring or comment, the surrounding code was read; where it
  was not, the row says so.
- This session's verification is one model's. The mechanical checks (732 permalinks resolved;
  166 quotations matched at their cited lines, nine first found a few lines off and corrected)
  are instruments, not a second reader. The fresh-eyes pass in section 5 is the same model
  family and is recorded as a challenge pass, not independent assurance.
- The brief, the Charter and these files share one author lineage.

## 5. Challenge

### 5.1 A frame that changes the answer

The account above treats learning as something the code does. A different frame: the code
supplies stores, triggers and prompts, and the learning is what a model does when given them.
Under that frame the most important statements are the review prompts' instructions ("Be ACTIVE
— most sessions produce at least one skill update") and Hermes's own warning that a weak model
"claimed a save it never made". Static reading can establish the instruction and cannot establish
the behaviour. This frame does not overturn a row; it limits what every mechanism row means.

### 5.2 An omitted scale

The brief's seven time scales leave out the maintainers' own release cycle. Bundled skills,
prompts and defaults change between releases and reach every installation through bundled-skill
sync at start-up and update (cold-pass row C-13). That is a path by which the product's behaviour
changes over time without any installation's own learning. It was noted and not studied.

### 5.3 Bridge claims without support

The bridge from the offline loop back to the runtime (S5 to S2) has no code at the pinned
commit. The bridge from real usage to the offline loop (S2 to S5) has an importer whose input
path was not matched against the runtime's store.

### 5.4 Presence against participation

The gateway request path was traced call by call. Elsewhere, several rows rest on a caller found
by search plus a read of the call line, without the full condition set: the three callers of
`maybe_run_curator`, the callers of `bump_use`, and the lock check's call sites.

### 5.5 Fresh-eyes pass

One read-only subagent was asked five questions, without this session's answers, covering the
five most load-bearing claims: the review triggers, the background write rules and gate
defaults, the curator's scope and thresholds, the memory snapshot and its reload points, and the
self-evolution metric and wiring. Its return and this seat's re-read of each cited line are
recorded in section 8.

## 6. World-Return Contract

| Field | Content |
| --- | --- |
| Next step | The comparison with the Practice: a separate, later session |
| Gate | This pull request merged, and the owner's go-ahead |
| Inputs | The Fact rows of `evidence-log.md`; `architecture-map.md`; `memory-learning-architecture.md` |
| Not begun here | The comparison. No research file describes, contrasts or judges Hermes against the Practice. The own-terms sweep (`rg -n -i 'napkin\|distill\|graduat\|PDR-\|the Practice\|OCE'` over the research files) returned hits only in the Charter's method envelope and scope block, the evidence log's Cricket section, and this file's contract; none describes Hermes. |
| Observation that would reopen | A later Hermes release changes a module named in the brief's Phase 4 inventory; or a row's falsifier is met |
| Owner | Jim |

## 7. Learning signal

Recorded for the embedding Practice; nothing here edits a skill or a rule.

| Observation | Expected | Observed | Affected surface |
| --- | --- | --- | --- |
| The brief assumed the attached repositories would be `NousResearch/*` | Tag fetch from `origin` | The attached clones were the owner's forks; the `hermes-agent` fork serves no tags; the tag was fetched from the public upstream by URL | The brief's Phase 0 |
| The brief assumed OCE's rules and skills might not load from a directory above the clones | Non-loader route | `CLAUDE.md`, the rule adapters and the skills loaded | The brief's Phase 0 |
| Line citations written from windowed reads | Exact | Nine of 122 spot-checked citations were off by one to six lines; a mechanical quotation check found them | Method: check quotations at cited lines mechanically before a file is called done |
| A command of the form `rg PATTERN` with no path, run with a heredoc on the same line | Search of the working tree | The command hung until timeout, reading standard input | Method: give `rg` an explicit path and `< /dev/null` |
| The Cricket frame was written before re-reading the brief's ledger rule | A frame carrying the owner's hold | "No holds" omitted the ledger hold; five of eight seats flagged the frame | The frame's SOURCES block should quote the plan's trigger lines |
| Two file edits made with an inline Python heredoc | The platform's per-file edit tool | Used once for the Cricket frame and Charter, and for citation rewrites | Grounding rule on editing instruments |

## 8. Fresh-eyes results

The subagent returned on all five questions, each with cited lines. This seat re-read 25 of them
mechanically (a substring match at the cited line range, 24 matched; the one miss was a
docstring wrapped across lines) and re-ran its three searches. It is a challenge pass by the
same model family, not independent assurance.

| Question | Its answer against this study's row | What changed |
| --- | --- | --- |
| Review triggers | Agrees: two counters, their resets, and the four spawn conditions | Nothing. It also noted a separate Codex runtime path that spawns the review ([`codex_runtime.py#L709-L712`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/agent/codex_runtime.py#L709-L712)), already in cold-pass row C-36. |
| Background write rules and gate defaults | Agrees: an unattended review's `patch` and `remove` are staged whatever `write_approval` says; `add` follows the gate; both defaults are `False` | Nothing. It confirmed the rule applies to an unattended review, not to an attended one ([`skill_provenance.py#L43-L44`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/skill_provenance.py#L43-L44)). |
| Curator scope and thresholds | Agrees: 14 and 30; curator-managed skills only; pinned, locked and cron-referenced skipped | A detail added to its answer and not to the store card: pinned skills that are not curator-managed also appear in the curator's report and are then skipped ([`skill_usage.py#L720-L729`](https://github.com/NousResearch/hermes-agent/blob/2bd378ed1b8d6bf2192cb26e0a55ff3091e6bd19/tools/skill_usage.py#L720-L729)). |
| Memory snapshot and reload | Agrees on the snapshot and both tiers | **Corrected this study.** It found four further call sites of the prompt invalidation, at session switch and rewind. The study had said the prompt is rebuilt at three points; `memory-learning-architecture.md` L4 now lists all six call sites, and the citation range for the reload was widened to include the line that reloads memory. |
| Self-evolution metric and wiring | Agrees: word overlap; judge never constructed; test gate never called; no git or pull-request call | Two details added to L8: the judge is imported and unused, and a `create_pr` config field exists that nothing reads ([`config.py#L47`](https://github.com/NousResearch/hermes-agent-self-evolution/blob/0a929e3aa20e15cf04dc7c28492a7d41a5139125/evolution/core/config.py#L47)). |

The correction bears on verdict V-4 and ledger row H2: the snapshot is frozen within a
conversation, and "only in the next session" is narrower than the code by more rebuild points
than this study first counted.
