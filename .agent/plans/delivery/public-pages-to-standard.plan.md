---
id: public-pages-to-standard
node_type: delivery
name: Public pages to standard
overview: Bring the README and the pages it links to the standard of the public-explanatory-system node, hold it with one check, and record the method as a skill.
status: ratified
ratified_by: "Jim Cresswell (owner)"
ratified_date: 2026-11-13
ratified_where: "The owner's approval, through plan mode, of the plan 'The repository's public explanatory system, README first' in the session of Sandpiper guards Wind (690653), 2026-11-13"
serves: public-explanatory-system
impact_areas:
  - practice-and-estate
  - packaging-and-distribution
tickets: []
depends_on: []
last_updated: 2026-11-15
---

# Public pages to standard

## Goal

The README is a front page of about 160 lines whose first paragraph tells any reader what the
repository is, who it is for and where it stands; every page it links agrees with it, with Oak's
site and with the code; and a public page that links into working material fails a check.

## User groups and value

As the strategic node states them: teachers, ministers and their advisers, journalists, chief
executives, chief technology officers, developers and connected assistants. The value is offered,
not proven.

## Mechanism

The repository states only what it uniquely knows and links to Oak for the rest. Detail leaves the
README for the page that owns it, moved whole, and every link, prose mention and generated copy
that pointed at it moves in the same change. Public copy is assembled from approved wording (Oak's
site, the vision, the signed-off strategy bets, the connector listing copy), each sentence listed
with its source, and the owner reads the rendered branch before the pull request opens.

Approved sources read on 2026-11-13, to be re-read at pickup:

- `https://www.thenational.academy/ai-plugin`: the connection steps; ChatGPT and Claude available,
  Gemini and Copilot "Coming soon"; "This is new, and still in development."
- `https://support.thenational.academy/using-oak-mcp-claude` and `/using-oak-mcp-openai`.
- The GDS Way README guidance,
  `https://gds-way.digital.cabinet-office.gov.uk/manuals/readme-guidance.html`.

What the pages disagreed on when this was written, to be settled at their sources:

| Fact | One page | Another |
| --- | --- | --- |
| Is it live? | `README.md` "Public Beta" | `docs/strategy/stream-mcp-app.md` lists four go-live gates as "production blocker"; the app's README says "private alpha" |
| Assistants supported | README: four, present tense | Oak's page: two available |
| MCP tools | README, the app's README: 37 | the generated `served-tool-table.md` |
| What Oak is | curriculum guide: "an independent UK public body" | listing copy: "a public body sponsored by the Department for Education" |
| Installing the SDK | README presents it as available | the SDK's README: "Not yet on the registry" |
| Reporting issues | README gives the issues address | `CONTRIBUTING.md`: outside issues are not accepted |
| Written by agents | README: "every line … written entirely by agents" | the commit history of that period is almost wholly under one human name with co-author lines |

The README outline:

1. Title and one row of badges; nothing else before the first paragraph.
2. One paragraph, no heading: what this is, who it is for, where it stands, who Oak is.
3. Find what you need: five lines by intention, the first sending teachers to Oak's page.
4. Status: a pointer to Oak's page; releases; that the SDK is not yet on the registry.
5. What's here: one table, no counts; one sentence on what `.agent/` is.
6. Build with it: the MCP address, the API key, the SDK, the data licence.
7. How it's built: schema-first and agent-directed, three sentences each, with links.
8. Quick Start: four commands, then the setup guide. The heading keeps its name.
9. Licence, credits, security, contact.

## Acceptance criteria (each with a proof)

1. The README's first paragraph alone tells a reader what this is, who it is for, where it stands
   and that it is open. Proof: `owner-held` — the owner's read of the rendered page, recorded on
   the pull request.
2. A teacher reaches Oak's connection page in one click from the first screen. Proof: `repo-safe`
   — the link, checked by `validate-markdown-links`, its target read by the reviewer.
3. No public page carries its own value for a fact Oak publishes or the code knows. Proof: a
   reviewer sweep against the table above, recorded on the pull request; no machine check exists.
4. A developer with a fresh clone reaches a passing `pnpm test && pnpm type-check && pnpm lint`
   from the README and the setup guide. Proof: `repo-safe` — the run, recorded on the pull
   request, and CI's install and test jobs.
5. No public page links into working material. Proof: `repo-safe` — `validate-reference-direction`
   over the public pages, blocking, in `pnpm check`.
6. Every page in the table below has its change, and no other linked page was rewritten. Proof:
   `repo-safe` — this node's table, read by the closing review.
7. The skill is generated and indexed. Proof: `repo-safe` — `pnpm skills:check` and
   `pnpm portability:check`.

## Todos

Each is one pull request with the default budget of two review rounds. Done before this node:
the fork's programme notice and fork wording left the entry pages.

1. **Move, do not rewrite.** Done: `docs/engineering/setup.md` holds the README's prerequisites,
   Windows (via WSL) path and key commands; `docs/architecture/README.md` holds the workspace
   tables and the six invariants; the links in `CONTRIBUTING.md`, the indexes, the orientation
   skill and its served copy point at the new homes; ADR-159 and ADR-202 carry clarification notes.
   Two things did not move with it. The "Engineering Practice" section is narrative, so it moves
   with todo 2 after the owner's read, and the `#engineering-practice` link in `.agent/HUMANS.md`
   and the "seven files" count move then. The reviewer briefs
   (`.agent/sub-agents/templates/onboarding-expert.md`, `docs-adr-expert.md`) name paths in the
   sibling estate's layout; that is its own observation, not a README coupling.
2. **The README's opening and outline**, after the owner's answers and read. Done: the README
   is a repository README of 153 lines on the outline above, landed as fork pull request 428
   (`e9abb2a83`, 2026-11-16) and carried to Oak by the reunification merge. It names no
   individual contributors and does not describe Oak, at the owner's rulings of 2026-11-15.
3. **The other public pages**, after the owner's read: the table below.
4. **The check.** `agent-tools/src/validators/reference-direction/` polices the public pages,
   test-first, landed blocking; `agent-tools/src/merge-bot/change-class.ts` stops classing
   `README.md` as a records change.
5. **Close.** A skill, `.agent/skills/domain-craft/write-documentation/`, authored by
   `.agent/skills/lever-authoring/author-skills/` with a small evaluation suite, pointing at the
   existing rules and adding only what this work proved, each with its count of separate cases; a
   dated amendment to ADR-212 naming the public as an audience and where each kind of fact lives;
   this node archived.

| Page | Change (todo) |
| --- | --- |
| `README.md` | Detail moved out (1); opening and outline (2). |
| `docs/engineering/setup.md` | New (1). |
| `docs/architecture/README.md`, `docs/foundation/agentic-engineering-system.md` | Receive the moved sections; "seven files" becomes a link (1). |
| `CONTRIBUTING.md` | Links re-pointed (1); its statement on outside issues and the README's made to agree (3). |
| `VISION.md` | Links to the backlog plan and the reports folder out; the dated note becomes one sentence naming ADR-227 (3). |
| `docs/README.md` | Cut to an index by route; "Last Updated" line and backlog links out (3). |
| `docs/foundation/README.md` | The April report, the backlog link and the "Session 8" aside out (3). |
| `docs/domain/curriculum-guide.md` | The description of Oak and the line about Aila trued (3). |
| `docs/strategy/README.md`, `stream-mcp-app.md`, `stream-agentic-framework.md`, `measures.md` | Backlog-plan citations retired; the go-live gates trued to the owner's answer. Choice IDs untouched: `validate-plan-corpus` reads them (3). |
| `docs/strategy/stream-innovation-kit.md` | The passage calling the fourth stream unresolved trued (3). |
| `apps/oak-curriculum-mcp-streamable-http/README.md` | Stale status lines out; the tool paragraph points at `served-tool-table.md` (3). |
| `packages/sdks/oak-curriculum-sdk/README.md` | The install section leads with "not yet on the registry" (3). |
| `.agent/memory/operational/threads/paused/sector-engagement.next-session.md` | The broken link to the README's components heading repaired (3). |

Every other page the README links gets link and wording checks only.

## Owner inputs

The owner answered all seven on 2026-11-15.

1. Teachers are sent to `https://www.thenational.academy/ai-plugin`. Confirmed.
2. Oak is described as in the listing copy: "a public body sponsored by the Department for
   Education". Confirmed.
3. Privacy and accessibility link to Oak's own published pages; the repository writes neither.
   Confirmed.
4. Status: the README states no status of its own. It quotes Oak's page ("This is new, and still
   in development.") and links there for what is available. The "Public Beta" sentence goes.
5. Product name: "Oak National Academy plugin" where the page speaks to teachers and other
   non-technical readers, matching Oak's site; "Oak Curriculum MCP server" in the sections for
   people who build with it.
6. How the code is written: AI agents write it, directed and reviewed by Oak's engineers, with a
   link to the page that explains the method. No person is named. The "every line … written
   entirely by agents" sentence goes.
7. What comes next: the front page says nothing. ADR-227 stays linked from the architecture page.

The same day the owner ruled that no decision record names Engraph as a party; package names and
repository links that contain the word stay.

## Out of scope

- A rendered documentation website: a later decision.
- Any page that restates what Oak publishes: Oak's site is the home.
- A rewrite of the strategy pages, the decision records, the Practice Core or working material.
- A check for a link to a heading in another file: estate-wide, its own lane.
- Word lists for fork or status wording: the fork stops producing fork wording at the merge.
