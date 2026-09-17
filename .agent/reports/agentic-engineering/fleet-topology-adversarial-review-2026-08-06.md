# Fleet topology trial: flat adversarial fleet with vendor-doc verifiers (2026-08-06)

Run `wf_6c238b59-841`, dispatched by an owner-directed implementer seat (Baobab turns
Seedling, 66aee6) at owner word, over the MCP-517 diagnosis (Clerk wrong-domain
handshake) and its proposed fix. Deliverables: MCP-517 corrected, MCP-518 minted, both
owner-assigned. This record is the experiment side, companion to
[the 2026-08-01 cross-examination trial](fleet-topology-cross-examination-2026-08-01.md):
what the topology was, what it cost, and what the trial taught.

## Topology

Owner-specified mix, one flat stage, no in-workflow synthesis: 23 agents in a single
`parallel()` barrier — 17 adversaries (10 haiku/high, 4 sonnet/medium, 2 opus/medium,
1 fable/low frame-challenger), each holding ONE narrow attack lens, plus 6 opus/high
vendor-doc verifiers (Vercel, Clerk, Express, Express-on-Vercel, Cloudflare, MCP)
checking a numbered claims register (C1–C17) against official documentation and
installed source. Schema-forced structured output on every seat (verdict + findings
with severity/confidence/evidence/failure-scenario for adversaries; per-claim
CONFIRMED/REFUTED/UNCLEAR + new-facts for verifiers). Synthesis was deliberately
reserved for the dispatching seat, in-context.

## Cost

23/23 legs completed, 0 errors, 0 schema failures: ~2.76M subagent tokens, 842 tool
uses, 17.4 min wall-clock (concurrency-capped ~10). Transcript footprint 9.3MB
(per-seat min/median/max ≈ 166KB / 407KB / 620KB). Per-leg journal:
session 66aee6, `subagents/workflows/wf_6c238b59-841/journal.jsonl`.

## Findings

1. **The 2026-08-01 dispatch defect RECURRED, verbatim: Workflow args arrived as a
   JSON-encoded string, so every prompt interpolated `undefined` for the brief path.**
   The prior record's named habit ("after composing a Workflow call, check the args
   field is a bare JSON value") did not fire at dispatch time — a live instance of
   `passive-guidance-loses-to-artefact-gravity`. Two instances in five days across two
   different dispatching seats graduates the cure from habit to structure: verify the
   interpolated value appears in at least one composed prompt BEFORE fan-out (a
   one-line assert in the script: `if (!args?.briefPath) throw`), and prefer schema
   guards inside the script over dispatcher diligence.
2. **Self-recovery under the broken dispatch correlated with capability tier, and it
   split three ways.** Strong seats (both opus/medium adversaries, sonnet security,
   the opus/high verifiers) FOUND the brief by searching the filesystem and delivered
   grounded work. Three seats honestly self-voided, citing the missing object — the
   prompt's "an empty findings list is a valid outcome" licence was quoted back in two
   of the three, so the licence measurably works and should stay in every adversarial
   prompt. Weak seats (2 of 10 haiku) proceeded against an INVENTED object (one
   reviewed a nonexistent PR; one rediscovered an already-fixed defect as new). Same
   double-edge as the 2026-08-01 finding 5, now with a tier gradient attached.
3. **Verdict and confidence labels are only trustworthy above a capability floor.**
   Every haiku `confirmed` needed line-item re-verification at synthesis; two haiku
   `BROKEN` verdicts dissolved on inspection (real mechanism, wrong severity or wrong
   object). Haiku seats earned their cost as POINTERS — five of ten surfaced places
   worth checking, including one genuine adjacent defect (`deriveSelfOrigin`
   normalisation) — but their schema labels cannot be consumed as verdicts. Budget
   the synthesis pass accordingly: haiku output is leads, not evidence.
4. **The opus/high vendor-doc verifiers were the highest-yield seats per token, by a
   wide margin.** All six delivered decision-changing material; the run's only two
   claim REFUTATIONS (C7 handshake-return mechanics, C13 loop-bound semantics), the
   reclassification of the whole fix (Clerk's own behind-a-proxy guide mandates the
   two headers the shim writes — vendor contract, not workaround), the Vercel-launcher
   Host-derivation fact that eliminated an entire implementation family, and the
   discovery that the estate was citing a superseded MCP spec revision all came from
   this block. Echoes the 2026-08-01 finding 4 (specialist grounding legs), scaled up.
5. **Evidence access outranks model tier for verdict authority.** The fable/low
   frame-challenger's one substantive nuance ("the fix is a side-channel workaround
   for a missing Clerk API surface") was WRONG — refuted by the Clerk verifier's
   vendor-guide discovery — because the frame seat reasoned without web access. A
   frame-challenger without the evidence reach of the verifier block can only
   challenge the frame's internal coherence, not its factual ground; weight verdicts
   by what each seat could SEE, not by what it is.
6. **Reserving synthesis for the dispatching seat (no in-workflow judge) was
   vindicated.** Triage repeatedly required session-held context no workflow seat
   possessed: recognising the invented-PR confabulation required knowing no PR
   exists; discounting the config-availability seat required knowing #803 had merged
   hours earlier; folding the cross-origin-Referer trigger into the right ticket
   required the owner's per-surface ruling from the live conversation. A judge stage
   would have averaged these instead of adjudicating them.
7. **Schema-forced output creates verdict pressure, and confabulation is partly its
   artefact.** A seat that cannot find the review object must still fill the schema;
   UNCERTAIN absorbed the honest cases, but not all. Cheap cure for the next run: a
   leading `object_grounded: yes|no` field, so "I could not ground the object" is a
   first-class answer rather than a failure the seat routes around.
8. **Operational residue worth keeping:** the workflow inherited the shell's
   PERSISTENT cwd (the run's project dir landed under an app subdirectory — same
   class as the comms-watcher cwd rule: arm orchestration from repo root); journal
   `result` rows carry only `agentId`, so labels must ride the RETURN value (the
   `{kind, label, result}` wrapper is what made synthesis possible — keep it); the
   Monitor 1h `timeout` backstop killed and cleanly re-armed the comms watcher
   mid-run, as designed.

## Free-play harvest (marked as associations, one visible discard)

- The broken dispatch was, accidentally, the best calibration probe the fleet has
  run: it measured which seats stay grounded under ambiguity — a property invisible
  in a healthy dispatch. This is shaped like deliberate fault-injection; a tiny
  "canary defect" leg in future large fleets could calibrate per-seat trust before
  synthesis weighs their outputs. (Speculative seed, not doctrine.)
- Haiku confabulation under forced schemas reminded me of
  `verdict-momentum-score-the-actual-object` — the seats scored an imagined object.
  The `object_grounded` field (finding 7) is that memory's mechanical form.
- Discarded, visibly: transcript-size-as-quality-metric. The largest transcript
  belonged to a wandering haiku seat; the correlation is confounded beyond use.

## Disposition

Flat single-barrier topology with lens-per-seat adversaries and a vendor-doc verifier
block is recommended for evidence-review fleets at this scale; the verifier block is
the part to protect under budget pressure, the haiku block the part to trim first
(or re-price as lead-generation). The args assert graduates to a script-side check on
every parameterised Workflow dispatch (second instance in five days). `object_grounded`
goes into the next adversarial schema. Synthesis stays with the dispatching seat
whenever the review's ground truth partly lives in session context.
