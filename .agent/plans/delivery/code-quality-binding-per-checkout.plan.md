---
id: code-quality-binding-per-checkout
node_type: delivery
name: "The code-quality IDE binding and the studio project id are per-checkout"
overview: "Untrack the two zero-code identity files a tool reads — the SonarLint connected-mode binding and the design-studio sync config — behind tracked examples, so this checkout binds to its own projects and the rule that spelled a project key points at the binding instead."
status: ratified
ratified_by: Jim Cresswell (owner)
ratified_date: 2026-09-08
ratified_where: "PR #85 (2026-09-08), whose body quotes the owner's card answer verbatim: 'Ratify 22, 23 and 25; hold 21 and 24'"
serves: organisational-identity-below-the-tree
impact_areas:
  - practice-and-estate
  - design-system
tickets: []
depends_on: []
owner_gates: []
last_updated: 2026-09-08
---

# The code-quality IDE binding and the studio project id are per-checkout

## Goal

Two tracked files that a tool reads carry one organisation's project identity as a
literal: the SonarLint connected-mode binding (organisation, project key, region) and the
design-studio sync config (an account-bound project id). After this lands, both are
untracked per-checkout files behind tracked `.example` twins, this checkout's copies name
its own projects, the IDE's workspace settings no longer carry a duplicate binding, and the
one rule that spelled a project key points at the binding file. This is the owner-named
first slice of the strategic node and the shape every later slice reuses. A link to the
design studio is optional tooling for a checkout, never a design-system expectation — the
owner's word (2026-09-05, on this slice's "design-studio project id"): nothing in this
project is linked to Claude Design; it can be, but that is not part of the design system,
it is not an expectation — so the sync config this slice untracks is a per-checkout choice
and its absence is a valid state.

## User groups and value

- **An organisation running this repository as its own**: its IDE binds to its own
  code-quality project and its own studio project by copying two examples; no tracked edit,
  no conflict at the next upstream sync.
- **Contributors on this line**: the code-quality CLI and IDE resolve the project this
  checkout is actually bound to, so a wrong-organisation analysis cannot happen silently.
- **The platform's maintainers**: the first two members of the per-checkout file class
  land with no code, proving the tree shape before the shared resolver is built.

## Mechanism

Rung (b) of the strategic node's ladder, no code:

1. Gitignore `.sonarlint/connectedMode.json` and `.design-sync/config.json`, each beside
   a comment naming its example and the values to enter (the merge-bot line is the
   precedent). Both files are consumed as JSON, which has no comment syntax, so the
   examples carry placeholder values only and every instruction lives in the ignore
   comments and the engineering doc.
2. Add `.sonarlint/connectedMode.json.example` (placeholder organisation, an
   `<org>_<repo>` project key, the region) and `.design-sync/config.json.example` (a
   placeholder project id, the other fields unchanged since they describe the package, not
   the account). Both parse as JSON as they stand.
3. Untrack both files (`git rm --cached`). Only the implementing checkout keeps its
   working copies: every other existing clone loses both tracked files when it
   fast-forwards over the deletion, and the new ignore rules hide the absence. The
   merge-bot engineering doc already records this hazard for its own file; this slice
   carries the same migration note there and in the PR body — copy each file aside before
   updating, or recreate it from the example afterwards — and the values an existing Oak
   clone re-enters are the ones the tracked files carried until now.
4. Remove the duplicate `sonarlint.connectedMode.project` block from the tracked IDE
   workspace settings: the IDE extension reads the shared binding file as its suggestion and
   writes an accepted binding back into workspace settings, so a tracked copy is a pin that
   regenerates; the untracked binding file is the one home.
5. In the sonarqube-mcp rule, replace the spelled project key with the sentence that the
   key is read from this clone's binding file, and say where the example lives. The
   quality-tooling coupling doc names the same key in prose that describes the binding;
   it takes the same sentence.
6. True the studio's notes: they currently require the sync config to target one named
   canonical project and to point nowhere else, which stops being true when the project id
   is per-checkout; the notes now say the id names this checkout's own studio project.
7. In the merge-bot engineering doc's per-checkout section, add the two files to the list
   of per-checkout identity files, so the adoption reader finds them in one place.

The remote code-quality MCP server needs none of this: its organisation arrives as a
request header on the user-scope server entry, already below the tree.

## Acceptance criteria (each with a proof — required)

- **Only examples are tracked.** `git ls-files .sonarlint .design-sync` lists
  `connectedMode.json.example`, `config.json.example` and the studio's notes and
  conventions files, and neither instance file. Proof: `repo-safe`, the command in the PR
  body and the pre-push gate's clean run.
- **No spelled key on a live surface.** `git grep -n 'oaknational_' -- .agent/rules
  .agent/skills .agent/directives .vscode .sonarlint docs/engineering '*.example'` returns
  nothing: the rule, the coupling doc, the IDE settings and both examples carry no project
  key. The scope names the surfaces a tool or a session reads; plans, dated records and the
  README's badges are outside it, and the strategic node's validator later holds the whole
  tree. Proof: `repo-safe`, the command in the PR body.
- **Both examples parse as JSON as they stand.** Reading each example's text through
  `JSON.parse` exits zero, so copying an example to its instance name yields a file the IDE
  extension and the studio tool accept before any value is entered. Proof: `repo-safe`, the
  two commands in the PR body.
- **This checkout binds to its own projects.** The IDE's connected-mode suggestion offers
  the organisation and project named in the untracked binding, and the studio sync tool
  reads the project id from the untracked config. Proof, on a configured checkout:
  `owner-held`, two confirmations recorded on the PR — the IDE's bind prompt or bound
  status on this checkout, and one studio sync invocation whose output names the
  configured project id. On a checkout that leaves the sync config absent (a valid
  state, above): `repo-safe` — the full gate suite passes with no studio binding and no
  gate or script requires the config; the studio confirmations are not owed.
- **A cold clone is told what to copy.** The ignore comments beside both entries name the
  example each file is copied from and where its values come from, and the merge-bot
  engineering doc's per-checkout section lists both files with the same instructions; the
  examples themselves carry placeholder values only. Proof: `repo-safe`, the docs
  validators in the aggregate gate and the ignore lines quoted in the PR body.

## Todos

One single-story PR within the default round budget: the seven mechanism steps above, with
the PR body carrying the two `git` proofs and the two JSON-parse proofs. On a configured
checkout the PR also carries the owner's two confirmations (the IDE's bind prompt or bound
status; one studio sync invocation naming the configured project id); on a checkout that
leaves the sync config absent, the repo-safe gate proof stands in and the confirmations
are not owed, as the acceptance criterion above branches.

## Out of scope

- The shared checkout-config resolver and every agent-tools reader (the PR-throughput
  repository constant, the dependency census scope): the next slices, once this shape has
  landed.
- The harness client configs naming the error-reporting organisation, the error-reporting
  CLI files, the workflow triggers and the adapter prefix: their own slices, each with its
  rung.
- README badges and the code-quality exclusions file: canonical identity and portable
  mechanism respectively; neither is a pin.
- The validator: it lands in its own slice seeded with the census, after which this slice's
  grep proofs become census-row deletions.
