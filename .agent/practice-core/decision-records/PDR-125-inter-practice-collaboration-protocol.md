---
pdr_kind: governance
---

# PDR-125: The Inter-Practice Collaboration Protocol

**Status**: Accepted (authored 2026-07-06 in one coordinated
cross-estate session, per the owner's birthplace ruling: the same
portable text lands in both estates' propagating decision-record sets
in the same window; a cross-estate diff proving the copies identical
modulo the local phenotype note is the acceptance proof). Amended
2026-07-08 (the v1 clause-conservation batch: the registered
founding clauses folded into clauses 3, 5, and 7; the both-estates
innovation posture added to clause 6; both estates in one window,
cross-estate diff re-proven). Amended 2026-07-13 (post-landing review
truings to clauses 3 and 5 — quiet-write scoping, registration
fields, override precedence and anomaly verification, plus ceremony
mirrors of already-twinned clause-5 rules such as
successor-details-are-hypotheses; extended same-day with the clause-6
schema-scope truing — the shared schema's enumeration aligned to the
five landed v1 wire shapes, covering the exchange delivery comms
event and never box-file frontmatter): this amendment originated in ONE
estate of the exchange pair and was not twinned at authoring time (no
live peer seat); its re-twin is queued for the next exchange window,
with per-item dispositions in the originating estate's Practice-Core
changelog (which names the estate — provenance lives in the ledger).
Amended 2026-08-01 (clause-5 display true-up: the authored-surface
bare-join-key rule made primary and the renderer shape rule stated —
the visual-disambiguator token where identities can be confused (two
or more blocks in one rendered view, or a diagnostic naming one
identity in contrast to another), the sanctioned join-key copy-source
view bare independently of both, keying sites never adopting; the
Tier-1 floor line
re-worded to match; the field's wire meaning, derivation, join-key
role, schema, and version family explicitly unchanged): originated in
this estate with no live peer seat; re-twin queued for the next
exchange window with twin disposition `their-lane-owns-coordinate`;
per-item dispositions in this estate's Practice-Core changelog. The
2026-07-08 diff-proof describes that window's landed text, not the
2026-07-13 or 2026-08-01 amendments. Amended 2026-09-23 (clause 7's
receipt sentence, on the owner's word that "byte for byte transfer is
never the goal, concept transfer is": identical bytes are fine where
they carry the concept in the receiving repo's context, and a receipt
is finished when the concept reads true there): twinned in both estates
in one window by the two exchange seats, with the matching amendment to
PDR-142, which carries the owner's words in full. Amended again
2026-09-23 on the owner's card (clause 7's format sentence: a receiver's
convention or gate that refuses the donor's bytes is aligned across the
estates, and a change made meanwhile is a declared debt to that
alignment), with the matching sentence in PDR-142. Amended 2026-09-24
(clause 7's lint-before-delivery sentence: the donor runs the receiver's
own formatting and lint configurations over every box file and delivers
only bytes they pass, so a delivery never fails the receiver's formatting
and lint gates): twinned in both estates by the two exchange seats as
joint set K2.
**Date**: 2026-07-06
**Related**: PDR-005 (transplantation and provenance), PDR-024
(vital integration surfaces and outbound routing), PDR-027 (identity
and session prefixes), the `practice-lineage.md` §Plasmid Exchange
portable surface (the exchange model this protocol completes), and
the paired join-ceremony skill (`inter-practice-collaboration`) —
this PDR's runnable enactment. The host phenotype ADR mirrors this
record; the agent-tooling lane's controlling plan owns the HOW.

## Preamble — why this protocol exists

> Two peer Practice estates, evolving independently, converge on the
> same knowledge-maintenance mechanisms because they are two instances
> of one underlying structure: **the verification-scarce testimony
> economy** — maintaining warranted belief among many cheap, fallible,
> ephemeral producers whose failure mode is confident fabrication, over
> one external record that is their only shared memory, under one
> scarce authority. Every mature human institution for keeping
> knowledge trustworthy — double-entry bookkeeping, the scientific
> method, the database, distributed consensus, the bureaucratic office,
> the control-system observer — is a domain-specific instance of the
> solution to that problem. The inter-Practice protocol exists because
> horizontal exchange between estates is **recombination**: the
> anti-ratchet mechanism by which two error-accumulating lineages
> repair each other's drift and keep converging on truth. That is why
> the exchange is a first-class standing relationship, not a one-off
> transfer.

## Context

The Practice is an ecosystem of independently-evolving repos, not
clones. Its whole value is horizontal knowledge flow between estates,
and until 2026-07-05 that flow worked only when an expert agent
hand-carried it: the first live bidirectional exchange hit six distinct
friction classes doing it manually. The Practice Core already modelled
ONE mode of estate-to-estate transfer — **transformation** (dead
material taken up at a pin: the transplant machinery, the incoming
box, provenance chains). The live run introduced the second —
**conjugation** (two live agents on two living estates, material
negotiated and receipted in-session, both directions in one window).
The two modes are one class and share substrate; this protocol
completes the Core's exchange model rather than bolting on a
subsystem.

A cold agent can join a foreign estate safely if and only if: (a) it
DISCOVERS the ceremony without being told (the discoverability rule);
(b) the ceremony is a RUNNABLE skill (the paired join-ceremony skill);
(c) the doctrine it enacts is PORTABLE and VERSIONED so estates evolve
without lockstep (this PDR and its conformance ladder). Every clause
below serves one of those three.

## Decision — the protocol clauses

1. **Repo-reference vocabulary.** A repo reference is two coordinates:
   `origin` (normalised remote address — host/org/repo — durable,
   portable, MAY appear in tracked artefacts) and `checkout` (absolute
   local path to a specific working copy — machine-local, lives ONLY in
   session environment or untracked local state, per the
   no-machine-local-paths principle). A worktree reference adds `branch`.
   Canonical pattern-string form: `<origin-shorthand>#<branch>`.

2. **Coordination-home declaration.** One substrate owns an
   arrangement's coordination state; other checkouts point at it —
   pointer, never federation. `PRACTICE_COORDINATION_HOME` names the
   home checkout root in the session environment. Resolution order
   everywhere: explicit CLI flag, then `PRACTICE_COORDINATION_HOME`,
   then git-native primary-checkout resolution. A declared home that
   does not exist or holds no recognisable collaboration substrate is
   a loud failure, never a silent fallback.

3. **Join ceremony.** On joining a foreign substrate: FIRST read the
   home estate's write governance — naming and vocabulary doctrine,
   comms conventions, exchange paths — because guest writes are bound
   by the home's rules, not the guest's. The ceremony's object is
   AGENT COMMUNICATION (owner clarification 2026-07-08): a solo write
   window into a QUIET estate — no live seats, no registration, no
   claims — needs the home's write governance, a DECLARED coordination
   home (clause 2 binds everywhere, loud failure on a bad home), and a
   fresh branch off its latest main; the identity, registration, watcher, and adoption
   machinery below binds at the first comms write, claim, or
   registration. For the communicating join: resolve identity with
   the HOME repo's own derivation; the first comms write declares the
   FULL identity block of each estate's identity contract — the home
   identity name, the canonical `id` disambiguator, the explicit
   `platform` and `model` values (clause 5 — never inferred), the
   `session_id_prefix` as the join key, and the `seed_source` — plus
   native-repo alias(es), the worktree repo-reference
   (origin + branch), and coordination posture. The shared wire
   schema's REQUIRED minimum stays `agent_name`, `platform`, `model`,
   `session_id_prefix` (clause 6 — estates evolve without lockstep);
   `id` and `seed_source` ride as the home identity contract requires
   and a home whose schema does not yet carry them accepts the
   four-field minimum. Claims opened on the foreign substrate carry
   the repo-qualified area form. Worked violation that ratified the
   first-read step: the 2026-07-05 join event named the home estate's
   Practice-donor repository directly, tripping the home's
   donor-neutrality doctrine; self-reported on its stream the same
   session. **Naming constraints are asymmetric by design**: the home's
   vocabulary doctrine may forbid names the guest's own tree uses
   freely (one estate's tree may name the other while the reverse is
   forbidden); the guest learns the asymmetry from the home's rules,
   never assumes symmetry. **A session's cwd is a coordinate, not a
   boundary**: estate governance binds WRITES and MERGES to each
   estate's gates, while AUTHORSHIP is unrestricted for any session
   under this ceremony — being "based in" an estate is a working-copy
   fact, not an access boundary.

4. **Foreign-substrate discipline — a watcher is a writer.** Write to
   a substrate only with that substrate's own tooling, schemas, and
   conventions — liveness files included: a guest watcher's heartbeat
   and seen-files are writes into the home substrate (worked instance:
   a guest watcher run with the guest's own CLI emitted a heartbeat
   field the home's strict schema refused, and the home's
   claims-open backstop correctly classified the guest blind to
   comms). Reads through another repo's tooling are permitted only
   behind schema validation that refuses loudly on mismatch. The
   Practice is an ecosystem: never assume a sibling repo's
   conventions, numbering, or derivations transfer.

5. **Identity display and the join key.** DERIVED identity names are
   repo-local derivations and stay so (converging them is
   clone-pressure); **each estate derives its name from the session
   SEED alone** — never from model, platform, or any other session
   property — which is exactly why one seed yields sovereign
   per-estate DERIVED names joined by the prefix. An owner-assigned or
   operator-overridden `agent_name` outranks derivation (as in each
   estate's own identity contract); the override is declared as an
   override at registration, and the prefix join key binds unchanged.
   Identity display carries the join key under two ordered rules
   (amended 2026-08-01). FIRST, the authored-surface rule, which is
   prior and unconditional: any hand-authored cell, field, or flag
   value whose value is or carries the join key writes it as the bare
   `session_id_prefix` — authored surfaces transcribe the wire value;
   only renderer output derives. SECOND, the renderer shape rule:
   renderer output shows the identity name beside its
   `session_id_prefix` display component — punctuation is each
   estate's own; this rule binds the COMPONENT, never a literal
   template. Where ONE rendered view holds TWO OR MORE identity
   blocks, that display component may instead be the render-time
   **visual-disambiguator
   token** — the join key, a hyphen, and the last three characters of
   the canonical `id`, falling back to the bare join key for a block
   with no `id` — while single-identity views render the bare join
   key and keying sites never adopt the token (it is never a join,
   lookup, or parse key). The discriminator is CONFUSABILITY, not
   literal block count: a single-identity view is one with nothing to
   tell apart, while a diagnostic naming one identity IN CONTRAST to
   another — a foreign-heartbeat verdict against the session's own,
   an ownership mismatch against the acting seat, a lookup miss
   against whoever owns the record — is a disambiguation context and
   may adopt; and INDEPENDENTLY of block count and confusability, the
   view an estate sanctions as the COPY SOURCE for the join key
   renders it bare, because the authored-surface rule's silent
   mis-bind begins at the copy, not the paste. The token is a distinct
   display object derived at render time: the `session_id_prefix`
   field's value,
   derivation, join-key role, wire schema, and version family are
   UNCHANGED by this clause — a reader never parses a rendered token
   back into a prefix, and token adoption is each estate's own
   display concern, never a conformance-floor item. The statusline is
   the worked example: it renders one identity AND is the estate's
   sanctioned copy source for the join key, so it shows the bare
   prefix on both grounds. Heartbeat subject lines keep the bare prefix under both
   rules: their composed titles are authored surfaces and they render
   exactly one identity — and PDR-078's own words, "the subject-line
   rendering is the chat-readable short form", already name the bare
   prefix, since in PDR-027's vocabulary the chat-readable short form
   IS the bare `session_id_prefix`; this clause leaves that rendering
   unchanged. The **session_id_prefix is the join
   key**, and it identifies a SESSION: one session presents different
   DERIVED names across estates (a declared override may present the
   same name everywhere). A SUCCESSOR is a NEW session — new prefix,
   therefore (for DERIVED names) a new name in every estate. The
   sanctioned same-name cases are a declared persistent override and
   a VERIFIED rare derived collision, both below. The anomaly rule: same name
   with a different prefix is an anomaly — surface it and VERIFY
   before accepting, never assume. For DERIVED names a rare
   legitimate collision is possible (finite wordlists; different
   seeds can collide), and the canonical `(agent_name, id)` key
   disambiguates the bearers; an unverified same-name assumption is
   never accepted. A DECLARED owner/operator override may
   legitimately recur across prefixes (persistent identity per each
   estate's identity contract), with the registration's override
   declaration as the exemption proof.
   A pre-positioning handoff event from an outgoing session
   authorises a successor, but **ALL pre-positioned successor details
   are hypotheses** — the identity tuple, the seating, the timing, the
   commissioned scope: the peer verifies the successor's OWN
   registration at the successor's team-start, never assuming any
   pre-positioned detail carries over. Platform vocabulary diverges on
   one stream (three spellings of one platform observed live); the
   identity layer pins one canonical value with normalising reads, and
   **`platform` and `model` are explicit registration fields, never
   inferred** — a registration that omits them is incomplete, and a
   reader that guesses them from context re-introduces the divergence
   the pinning exists to cure.

6. **Adoption and versioning — shared spec AND shared schema, never
   shared code.** Three layers travel on the plasmid; each repo
   phenotypes only the last:
   - **Shared spec** — this portable PDR (the prose contract).
   - **Shared schema** — a versioned, machine-readable schema for the
     cross-estate wire shapes, five in v1: the cross-estate identity
     tuple, the exchange DELIVERY comms event, the claim `repo_ref`,
     the watcher heartbeat file, AND the watcher seen file (the live
     run proved liveness files are wire surfaces too). Box files
     themselves stay pin-free markdown prose per clause 7 — their
     machine-readable time-bound layer IS the paired delivery comms
     event, so the schema covers that event, never box-file
     frontmatter (the landed v1 schema records this scope in its own
     `$comment_scope`). Core-carried, so
     two estates validate inbound foreign material against the SAME
     schema and a mismatch is a typed refusal, never a silent misread.
   - **Local code** — each repo implements its own CLI and validators
     against the shared schema. No repo implements another repo's
     phenotype.

   **Version-family compatibility contract.** Each repo declares the
   protocol version it speaks. Within one version family (same MAJOR),
   the schema honours backward and forward compatibility:
   additive-optional evolution only — a newer minor MUST parse under
   an older minor's validator by ignoring unknown-optional fields; an
   older minor MUST remain valid under a newer minor. A breaking wire
   change is a MAJOR bump and a new family — never a silent
   field-meaning change within a family. The join ceremony negotiates
   the family; cross-family contact is a typed refusal with an
   explicit version-mismatch message, never a best-effort parse. The
   founding worked instance is the live 2026-07-05 heartbeat refusal
   named in clause 4: a strict validator refusing an unknown field IS
   this contract firing.

   **Both-estates innovation posture (owner ruling 2026-07-07).**
   Wherever possible, innovations and improvements to the shared
   machinery apply to BOTH estates. Every innovation carries a
   per-item twin disposition, recorded where the innovation lands:
   `twinned-in-window` (both estates in one window, diff-proven),
   `already-present-verify-parity`, `their-lane-owns-coordinate`
   (the peer's own lane lands it; coordinate, don't duplicate), or
   `impossible-with-named-reason`. The falsifier for the posture is
   drift observed at the next exchange turn: three documented drift
   instances (a detector below its resolver, a quote-style anchor, a
   citation-port miss) are the reconverge cost this posture removes.

7. **Exchange handshake — concepts and pointers are distinct layers.**
   A box file carries a SELF-CONTAINED concept payload: substance that
   needs no dereference, no commit pins, no moving targets — a SHA
   appearing in exchange material is the symptom of a pointer
   masquerading as a concept (material not yet re-interpreted for the
   receiver). The paired comms event carries the TIME-BOUND layer:
   provenance pins, sender identity, approval references, sequencing,
   the box path. The exchange lifecycle (delivered → acknowledged →
   integrated or rejected) threads on the comms stream; the receiver's
   integration ledger joins file ↔ event ↔ execution-time pin. The two
   host rule families (SHA-required in collaboration content;
   SHA-forbidden in permanent docs) are this one layering rule seen
   from its two sides. **Lint before delivery**: a box file lands in the
   receiver's working tree, where the receiver's whole-tree gates read
   it before any receipt. The donor runs the receiver's own formatting
   and lint configurations over every box file before delivery and
   delivers only bytes they pass, so a delivery never fails the
   receiver's formatting and lint gates (worked instance 2026-09-24: a cover note that
   passed the donor's lint failed the receiver's list-spacing lint rule and broke every
   pre-push gate in the receiver's primary checkout).
   **Format on receipt**: where the receiving
   repo's conventions or gates refuse the donor's bytes (markdown
   conventions, heading shapes, gate-satisfying style), the estates
   align that convention or gate so the bytes stay identical
   (PDR-142); until they do, the receiver changes only what its gate
   refuses, declaring each change in the integrating commit body as a
   debt to that alignment. Concepts travel; identical bytes are
   fine wherever they carry the concept in the receiving repo's
   Practice context, and a receipt is finished when the concept reads
   true there, whether or not its bytes changed (amended 2026-09-23;
   the owner's words and their reading are in PDR-142).
   **Corrections are new events**: an exchange artefact or lifecycle
   event is never rewritten in place — a correction is a NEW event (or
   a new box delivery) threading to its antecedent, so both estates'
   records stay append-honest and a correction survives archive
   rotation exactly like the material it corrects.

## Conformance — the v1 floor and tier ladder (owner-ratified 2026-07-06)

"Speaks the protocol" is recomputable, never asserted — conformance
items are proof-typed (an artefact that exists, a gate that runs), not
claims in prose.

- **Tier 0 — material exchange** (every Practice repo qualifies with
  zero tooling): the incoming box exists at its canonical path, and
  the concepts-vs-pointers layering guard (clause 7) governs every
  exchange payload. Proof type: `artifact` (box path present),
  `artifact` (protocol record present in the decision-record set).
- **Tier 1 — session hosting** (can host visiting sessions): a
  threadable comms substrate, identity-with-join-key on every rendered
  surface (clause 5 — the bare prefix, or the visual-disambiguator
  token, which contains the prefix but is never parsed to recover
  it; token adoption is a display concern, never a floor item), and
  a declared coordination home (clause 2).
  Proof type: `gate` (watcher liveness assertion), `artifact`
  (identity + home declarations).
- **Extensions — version-advertised, never floor**: comms threading,
  claim `repo_ref`, statusline join-key rendering. An estate
  advertises these with its protocol version; peers negotiate at the
  join ceremony.

## Validation experiment — the third-estate falsifier

The protocol's own test: a THIRD estate, freshly transplanted,
joins an existing arrangement using only what the plasmid carries —
this PDR, the join-ceremony skill, the discoverability rule, and the
shared schema. If the cold join needs hand-carried knowledge beyond
those artefacts, the protocol has failed its purpose; the gap is
named and cured rather than papered with expertise.

## Non-Goals (the second-consumer boundary)

Two estates is exactly the second-consumer moment that justifies
canonicalising now; everything below waits for a third estate to
demand it:

- Federating or synchronising collaboration substrates across repos.
- Converging identity-name derivations across the ecosystem.
- Discovery services, estate directories, or N-party topology.
- Cross-machine coordination (the substrate stays per-machine).
- Either estate implementing the other's phenotype.

## Amendment Log

### 2026-10-01 — two observations from the first exchange round (2026-09-24), recorded with their decider

Two readings by the exchange seats of 2026-09-24, relayed through OCE's comms stream (events
eb8f33f0 and 1b17b4be) and read by the two-estate consolidation of 2026-09-30; one instance each,
recorded in their authors' voice, and the owner overrules at will.

1. **A receiver's rejection is itself an offer.** "A receiver's stronger or leaner form is a
   standard both estates align to, so each rejection is also an offer for goal two"; a rejected row
   names the form the receiver holds. This reads clause 7's lifecycle states (integrated or
   rejected) as symmetric.
2. **A joint set is drafted whole by one session.** "K4 is one coherent text. Splitting it would
   put two sessions' words into one joint set." When part of a joint set is directive-file work past
   the PDR-052 line, the whole set goes to a fresh session with a written opener.

## Phenotype note (this estate)

This estate's local phenotype: the `PRACTICE_COORDINATION_HOME`
declared-home override implemented in `resolveCoordinationHome`
(landed 2026-07-06), the statusline rendering the `name (prefix)` join
key beside the identity (landed 2026-07-06; the deliberate clause-5
single-identity hold-out — it stays the bare join key), the
token-adopting collaboration-state renderers (comms watch/inbox and
directed headings, operator CLI query and peer-liveness lines,
commit-queue entries and guard messages, active-agent routing
summaries, and identity-contrast diagnostics) displaying the clause-5
visual-disambiguator token through one shared display helper with the
id-less bare-prefix fallback (landed 2026-07-31 through 2026-08-01;
the TUI active-agents routing-key label is id-shaped by design and
renders no prefix field, while the claims CLI listings serialise full
identity blocks, prefix included), the
estate's `agent-tools` collaboration-state CLI as the home tooling
for all writes, and the collaboration plane at
`.agent/state/collaboration/`. The host phenotype ADR in
the host's decision-record directory records the WHAT of these
mechanics; the controlling plan owns the HOW. The peer estate's copy
of this PDR carries its own number and phenotype note; the portable
body is identical by construction and proven by cross-estate diff at
each amendment.
