---
status: permanent-dated-record
date: 2026-07-28
subject: claude-directory-submission
source: owner-captured screenshots, .agent/reference-local/claude-submission/ (all 20 read)
identity: Squall wakes Apex / claude-code / 459fd1 (Director)
---

# Claude directory submission — complete field and requirement inventory

Discharges MCP-296. The owner walked both flows and captured them; this records what the
**forms actually demand**, which outranks every documentation summary including our own MCP-16
table and MCP-106's 22 July capture. All fifteen connector and five plugin screenshots read.

**Two separate submissions, different directories, different forms:**

| | Connector | Plugin |
| --- | --- | --- |
| URL | `claude.ai/admin-settings/directory/submissions/new` | `.../submissions/plugins/new` |
| Scope | Remote MCP servers only | Plugins for Claude Code & Cowork |
| Steps | 11 | 3 |
| Nature | Connectors Directory | Plugin Directory — "community-driven", separate and complementary |

Both: **submitting does not guarantee inclusion**; Anthropic reviews every submission. The
plugin form adds "during spin up there may be delays in release into the directory."

## READINESS: the two submissions are not at comparable stages

Recording both forms side by side makes them look like parallel paperwork. They are not, and
this is the first thing to understand about them.

**Connector — a runnable process today.** The server is live, already connected as a custom
connector, and the form has captured 40 tools from it. What remains is content (copy,
categories, links), two engineering fixes (tool titles, the description wording behind
acknowledgement 5), and the Name/slug decision. Every outstanding item has an owner and a path.

**Plugin — blocked on the artefact, not on paperwork.** Verified first-hand 2026-07-28: this
repository contains **no plugin**. No `.claude-plugin` directory, no `marketplace.json`, no
`plugin.json`, no plugin workspace (the only `plugin` matches in `pnpm-workspace.yaml` are
eslint plugins). The form's first required field is **Link to plugin** — *"the URL to your
plugin repository"* — followed by name, description, example use cases, and a platforms
declaration whose helper text is *"test that the plugin works with these surfaces before
submitting."*

None of those can be answered truthfully today. **The plugin submission's blocker is that the
plugin does not exist**, and no amount of form-filling reaches it. The owner's stated
preference is to home the plugin definition as a workspace in this repo; that is unbuilt work,
not a documentation gap.

Consequence for planning: treat these as two independent tracks with different critical paths.
The connector's path is content plus two small fixes. The plugin's path starts at "build the
plugin", and until that lands, the plugin form is reference material rather than a task.

## Blocking and decision-grade findings

### 1. Acknowledgement 5 is currently false — BLOCKING

Compliance requires ticking: *"Tool descriptions contain no instructions about model behavior,
other tools, or external instruction sources, and no hidden or encoded text."*

Our live descriptions, read by the form at step 3, include **"PREREQUISITE: You MUST call
`get-curriculum-model` first to understand the curriculum…"** on Browse Curriculum and Explore
Topic. That is an instruction about model behaviour *and* about another tool. Either the
descriptions change before submission or the box cannot honestly be ticked. The reviewer reads
the same text.

### 2. The slug is permanent and currently says "internal preview" — ONE-WAY DOOR

Listing step: **Name** is prefilled "Oak Curriculum App (internal preview)" and **Slug** is
`oak-curriculum-app-internal-preview`, described as *"Permanent after submission. Lowercase
letters, numbers, and hyphens. Pre-filled from the name."*

Submitting as-is permanently brands the directory entry "internal preview". Everything else on
the listing "can be edited after you submit" — the slug cannot. **Fix the Name before
submitting so the slug derives correctly.**

### 3. Authentication may make the Clerk DCR decision unnecessary

Five modes; ours is set to **OAuth 2.0 + DCR** (review summary shows `oauth_dcr`), which the
form confirms is *"supported out of the box — no further action needed."* But it adds:

> For high-traffic servers, prefer CIMD or Anthropic-held credentials — **DCR registers a new
> client per user connection.**

That is MCP-271's sprawl risk, stated by Anthropic. The third mode — **OAuth 2.0 with
Anthropic-held client credentials** ("Anthropic stores a static `client_id` (and secret if
needed) on your behalf") — would mean no DCR at all, removing the entire reason to enable it on
Oak's production Clerk instance. Decide before flipping anything in production. Static bearer
tokens for directory servers are in beta via `mcp-review@anthropic.com`.

### 4. The URL is whichever custom connector is selected, verified live at submission

Step 2 requires the server already connected as a custom connector in the submitting account:
*"We use this live connection to verify the URL and tool list at submission time."* Currently
`https://curriculum-mcp-alpha.oaknational.dev/mcp`. Submitting the canonical address means
adding **that** as a custom connector first, serving the final tool surface.

Review summary confirms what is captured: Transport `streamable-http`, Authless `No`, **"40
tools captured from your live connection"**, Server URL type `universal`.

### 5. Every tool is missing its `title` annotation

Step 3 flags **11 suggestions**, including "Missing annotations: title" on Browse Curriculum,
Download Asset, and Explore Topic. Tools correctly carry `idempotent`; the surface is all
read-only. Mechanical fix.

### 6. [TRUED 2026-07-30 — falsified for MCP Apps; see the note below] No screenshot or carousel requirement exists in either flow

> **TRUED 2026-07-30 — this finding is FALSIFIED for our surface.** It was accurate for the
> 28 July form captures, but the live MCP Apps submission page (verified first-hand
> 2026-07-30, twice: the Director's post-pause verification and the submission-copy review)
> REQUIRES carousel screenshots for connectors that serve a `ui://` widget resource — ours
> does, so the clause binds: 3–5 PNG, ≥1000px, cropped to the app response only, no prompt
> in the image, PAIRED prompt text per screenshot, no video/GIF; a Figma template is linked
> from the page. Do not inherit the paragraph below as current truth; it stands only as the
> record of what the 28 July flow showed. (MCP-293's closure predates this and was made on
> the then-true evidence; the carousel work is tracked on the submission path, not by
> reviving MCP-293.)

Confirmed across all eleven connector steps and all three plugin steps: **no image upload, no
count, no dimensions, no carousel.** The owner's challenge was correct. MCP-293 should be
closed on this evidence.

### 7. Auto-listing IS the default — I had this backwards

**Correction to an earlier revision of this report.** I read the form's "Anthropic reviews every
submission" as contradicting the auto-listing finding. It does not. The review-criteria page
states plainly:

> When you submit a server, it is automatically scanned for policy compliance and, **by default,
> listed in the directory as a community connector.** Anthropic may then escalate listings
> flagged as highly useful to Claude users to verified review, which is higher touch and slower;
> reviewers run a functional test of each tool. This escalation is assessed automatically, and
> you do not need to take any action.

Both statements are true: the review is real and it is **automated**. Verified review is an
escalation, not the default path, and the label *"is a quality signal shown to users; it does
not change how your connector runs once connected."*

Consequence: the nine-business-day review buffer in MCP-106 was derived from a
verified-review-by-default assumption that does not hold. The automated policy scan is what
gates initial listing — which raises the stakes on findings 1 and 5, because **an automated scan
is exactly what catches a prompt-injection pattern or a missing annotation.**

## Connector form — all eleven steps

1. **Introduction** — no fields. Remote MCP servers only; local servers go to Desktop
   Extensions or plugins, which "work in Cowork and show up separately in the directory."
2. **Connection** — select an already-connected custom connector; optional URL configuration.
3. **Tools** — read-only display, read live. Ours: 40 tools, 6 resources, 11 suggestions.
4. **Listing** — *"appears on your connector's directory page and can be edited after you
   submit"* (except the slug):
   - **Name\*** · **Slug\*** (permanent, lowercase/numbers/hyphens, prefilled from name)
   - **One-liner\*** (max 200 chars) · **Description\*** (max 2000 chars, shown on claude.ai)
   - **Categories\*** (at least one, up to 5)
   - Author name (shown "by …") · Author URL — *or* company name + `https://` website
   - Icon — defaults to the MCP server's favicon; custom URL optional; leaving unset recommended
   - **Documentation\*** · **Support\*** (URL or email) · **Privacy policy\***
5. **Use cases** — **Primary use cases\*** (main tasks + example prompts) · **Connection
   requirements\*** (accounts/permissions/setup needed) · **Read/write capabilities\***
   (read only / write only / read and write) → ours `read_only`.
6. **Company** — **Company name\*** · **Company website\*** · Primary contact **Full name\***,
   **Email\*** (prefilled from the Claude account), Role, Anthropic contact (both optional).
7. **Authentication** — **mode\***: OAuth 2.0 + DCR · OAuth 2.0 + Client ID Metadata Document ·
   OAuth 2.0 with Anthropic-held client credentials · Custom URL or credentials at connection
   time · No authentication (authless).
8. **Data handling** — **API ownership\*** (we own / proxy a partner's with permission /
   third-party we don't control — the last *"typically blocks listing"*) → ours `first_party` ·
   **Personal health data\*** → `no` · **Sponsored or promoted content\*** — sponsored,
   promoted and advertising content is **prohibited** in directory connectors.
9. **Test & launch** — *"Provide clear test-account setup and access instructions… write these
   instructions so they contain every link, credential, and step needed to autonomously access
   the MCP server. For enterprise accounts or servers that require a fully populated account,
   provide test credentials that grant access to a fully populated account for review."*
   Fields: **Test setup instructions** (textarea, no asterisk) · **Self-tested** checkbox — *"I
   have run every tool via MCP Inspector or as a custom connector in Claude"* (currently No).
10. **Compliance** — seven acknowledgements, **all required**: developer guidelines read ·
    first-party APIs (or legitimately proxied) · no financial asset transfers · no AI
    image/video/audio generation · **no model-behaviour or other-tool instructions in tool
    descriptions, no hidden or encoded text** · no conversation data beyond function · public
    docs live by publish date. Plus **Additional notes** (optional free text) — *"anything else
    the review team should know."* **This is where the Elasticsearch architecture note goes.**
11. **Review** — full summary plus per-field validation, then **Submit for review**.

**Outstanding required fields at the owner's capture** (from the Review page): One-liner,
Description, Author (or company website), Categories, Documentation, Support URL, Privacy
policy, Company website, Use cases, Connection requirements, and all policy acknowledgements.
Already satisfied: company name, primary contact, contact email, read/write, API ownership,
personal health data, sponsored content, authentication mode.

## Plugin form — all three steps

1. **Introduction** — **authorisation checkbox\***: authorises Anthropic to contact us and
   process the submission under its Privacy Policy; agrees to the Software Directory Terms;
   submitted information is displayed in the Plugin Directory and may appear within Claude Code.
2. **Plugin information**
   - **Link to plugin\*** — *"The URL to your plugin repository"* (e.g. a GitHub repo)
   - Plugin homepage — public homepage or docs site (optional)
   - **Plugin name\*** — *"check your name is not already taken. You may not use brand names
     you do not own"*
   - **Plugin description\*** · **Example use cases\***
3. **Submission details**
   - **Platforms\*** — Claude Code and/or Claude Cowork; *"test that the plugin works with
     these surfaces before submitting"*
   - License type (optional — MIT, Apache 2.0, proprietary, etc.)
   - Privacy policy URL (optional)
   - **Submitter email\*** (prefilled)

Note the plugin form asks for a **repository URL**, which bears on the owner's preference to
home the plugin as a workspace in this monorepo — a repo link is satisfiable either way, but
the plugin must be locatable and installable from it.

## Cross-reference against Anthropic's published sources (fetched 2026-07-28)

Sources: the [Software Directory Policy](https://support.claude.com/en/articles/13145358-anthropic-software-directory-policy),
the [pre-submission checklist / review criteria](https://claude.com/docs/connectors/building/review-criteria),
and the Claude Code [plugin marketplace docs](https://code.claude.com/docs/en/plugin-marketplaces).
**The forms are not the whole contract** — these add requirements the forms never mention.

### Findings the cross-reference HARDENED

**Finding 1 (PREREQUISITE wording) is now triple-sourced and is an explicit rejection reason.**
Review criteria: tool descriptions are rejected if they *"Instruct Claude to call external
software or tools the user didn't request"* or *"Direct Claude to pull behavioral instructions
from external sources"*, closing with **"Describe what the tool does. Do not tell Claude how to
behave."** The policy independently prohibits software that *"intentionally call\[s\] or
coerce\[s\] Claude into calling other external software, tools, databases, or resources unless
requested and intended by a user."* Our "You MUST call `get-curriculum-model` first" is squarely
inside that. Combined with finding 7 (the initial gate is an **automated scan**), this is the
single likeliest cause of an automated rejection.

**Finding 5 (missing titles) is mandatory, not a suggestion, and has a functional consequence.**
Policy: servers must *"provide all applicable annotations for their tools, in particular
readOnlyHint, destructiveHint, and title."* Review criteria: *"Every tool must include a `title`
and the applicable hint… These determine auto-permissions in Claude: read-only tools can run
without per-call confirmation."* So missing titles may also degrade the runtime permission
experience, not just the listing.

### Requirements the forms do NOT state

- **Test credentials are required and must be a fully populated account.** The policy requires
  *"a standard testing account with sample data."* This settles the owner's open question:
  MCP-294 is required **regardless** of whether sign-up restrictions are lifted.
- **At least three working examples of prompts or use cases** (policy). The form's free-text
  "Primary use cases" has a concrete minimum.
- **Token frugality**: *"The amount of tokens a given tool call uses should be roughly
  commensurate with the complexity or impact of the task."* Unmeasured for us.
- **Response sizing**: *"Do not return a full database dump when a summary was requested."*
- **Public documentation required by the publish date** — a blog post or help-centre article
  suffices; may be shared privately with Anthropic during review.
- **Allowed link URIs** are recommended if the server calls `ui/open-link` — declared HTTPS
  origins open without a confirmation prompt. **Worth checking against our download-asset tool**,
  which returns clickable short-lived URLs.
- **Ongoing compliance**: Anthropic conducts *"both initial and ongoing reviews"*; requirements
  apply *"including any future changes, to remain in our Directories."*
- **Separate read and write tools** — a catch-all `api_request` with a `method` parameter is
  rejected. We pass trivially: the surface is entirely read-only.
- **MCPB open-source and "spec will evolve" clauses** in the Software Directory Terms are
  *"required and not waivable."*
- Prohibited independently of the form: querying *"Claude's memory, chat history, conversation
  summaries, or user-generated or uploaded files."* We do none of this.

### Plugin-specific requirements the form does not state

- **The plugin must link a public GitHub repository — "closed-source is not accepted."** Our
  monorepo is public, so homing the plugin here satisfies this.
- **Structure**: a plugin is a directory containing `.claude-plugin/plugin.json`; a marketplace
  is a repo containing `.claude-plugin/marketplace.json` at its root naming each plugin and its
  source. Components a plugin may bundle: skills, agents, hooks, MCP servers, LSP servers,
  monitors — **all of which this estate already has**, so building it is largely packaging.
- **Validate before submitting**: `claude plugin validate`, with `--strict` in CI to treat
  unrecognised-field warnings as errors.
- **Plugins may connect to any Connector approved in the directory** — so the plugin can
  legitimately depend on our own connector once listed.

### Pre-submission steps both sources require

Exercise **every tool** through the MCP Inspector *and* as a custom connector in Claude. This is
the same claim the form's step-9 "Self-tested" checkbox makes, currently answered **No**.

## Owner answers already on the record

- **Sponsored/promoted content**: answered "Other — links back to original content on
  www.thenational.academy in some cases." Honest. Worth a second look: linking to our own source
  content is arguably not sponsored, promoted, or advertising content in the sense the policy
  prohibits, and a plain "No" may be both accurate and less likely to invite a reviewer query.
  Owner's call.
- **API ownership**: `first_party` — correct. The MCP server queries our own Elasticsearch
  cluster with its own server-side credentials, and curriculum content comes from our own API.
  The consuming assistant never contacts Elasticsearch.

*Recorded by Squall wakes Apex (Director, agent).*
