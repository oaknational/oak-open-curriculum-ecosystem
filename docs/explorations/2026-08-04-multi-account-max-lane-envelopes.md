---
title: Multi-account Max operation as lane envelopes
date: 2026-08-04
status: active
---

# Running multiple Max accounts as lane envelopes

**An operating model for one-person multi-account capacity, the fragmentation
cures, and the post-arbitrage hedge.**

Every vendor fact in this exploration was read first-hand from Anthropic's
published documentation or consumer terms on 2026-08-04, and re-verified
against the sources listed in the References section on 2026-08-09. They are
time-pinned, not guaranteed to persist; §9 lists the re-verification triggers,
and §11 separates verified fact from estimate and owner's call.

## 1. Summary

One person holding several Max x20 accounts — each genuinely theirs, never
accessed by anyone else, running on their own laptop or on VMs whose OS user is
that same person — is inside Anthropic's consumer terms as written today, and
delivers token throughput at an estimated 10–40× less cost than metered API
billing (an estimate; §7 gives the exact measurement path).

The arrangement has two real costs. **Fragmentation**: auth, data, attention,
and visibility scatter across accounts. **Fragility**: the price advantage is a
subsidy with an unknown expiry date, not a floor.

Both are curable. Fragmentation falls to near zero _recurring_ cost by
re-founding the accounts as **lane-budget envelopes** — each account a
fixed-price capacity envelope allocated to a lane of work — and applying one
structural cure per fragmentation dimension (§5). What remains is a one-time
provisioning cost per account and two named irreducible residuals. Fragility is
hedged by billing portability (the agents' logic lives in git and is
account-independent; the billing identity is configuration) plus
token-efficiency disciplines that pay in window-budget today and in dollars
under any future regime (§8).

The reframe doing the work throughout: **the fragmentation is not a defect of
the setup — isolation is the product.** Structural cost attribution, physical
budget enforcement, and blast-radius containment are properties a single
consolidated account would not have. The job is not to eliminate the boundaries
but to make crossing them free where crossing them is wanted.

## 2. Standing facts (verified 2026-08-04; sources re-read 2026-08-09)

Each fact below was read first-hand from the named source on the pin date and
again on 2026-08-09; the References section carries every URL and access date.

1. **The consumer terms do not limit how many accounts one person may hold.**
   (Anthropic [Consumer Terms](https://www.anthropic.com/legal/consumer-terms).)
2. **Account sharing is prohibited**: "You may not share your Account login
   information … or make your Account available to anyone else." One person
   operating several accounts they own is not sharing; any other human using
   one of them is.
   ([Consumer Terms](https://www.anthropic.com/legal/consumer-terms).)
3. **Automated access is prohibited** "except when you are accessing our
   Services via an Anthropic API Key **or where we otherwise explicitly permit
   it**." Claude Code's own product surface on subscription auth — scheduled
   tasks, channels, headless `-p` mode, Remote Control, unattended sessions —
   is that explicit permission. The prohibition targets scripting the claude.ai
   web surface, not using Claude Code as shipped.
   ([Consumer Terms](https://www.anthropic.com/legal/consumer-terms);
   [Use Claude Code with your Pro or Max plan](https://support.claude.com/en/articles/11145838-use-claude-code-with-your-pro-or-max-plan).)
4. **Usage limits** on subscription plans are a rolling 5-hour window plus a
   weekly window, shared across all models **and with claude.ai chat and Cowork
   on the same login**.
   ([What is the Max plan?](https://support.claude.com/en/articles/11049741-what-is-the-max-plan);
   [How do usage and length limits work?](https://support.claude.com/en/articles/11647753-how-do-usage-and-length-limits-work);
   [costs docs](https://code.claude.com/docs/en/costs).)
5. **Usage credits** allow metered continuation past an allowance. While
   drawing on them, prompt-cache lifetime drops from 1 hour to 5 minutes —
   heavy overflow is priced twice, once in metered tokens and once in extra
   cache misses.
   ([Manage usage credits for paid Claude plans](https://support.claude.com/en/articles/12429409-manage-usage-credits-for-paid-claude-plans);
   [costs docs](https://code.claude.com/docs/en/costs).)
6. **OpenTelemetry export works on every auth type** and streams per-user token
   and cost metrics to your own observability stack.
   ([Costs docs](https://code.claude.com/docs/en/costs).)
7. **Channels** (research preview) push external events into a running session
   over an MCP server, are two-way, and can declare a **permission relay**
   capability so an allowlisted remote sender can approve or deny tool use.
   Auth: claude.ai login or Console API key. Custom channels are buildable;
   during the preview they need the development flag or an org
   `allowedChannelPlugins` entry.
   ([Channels docs](https://code.claude.com/docs/en/channels).)
8. **`/usage` prices sessions at standard list rates**, giving a per-session
   API-equivalent dollar figure regardless of plan.
   ([Costs docs](https://code.claude.com/docs/en/costs).)
9. **Products serving other people must use API keys**: offering claude.ai
   login or subscription rate limits to third parties is not permitted.
   ([Agent SDK overview](https://code.claude.com/docs/en/agent-sdk/overview).)
10. **Enterprise/Team seats do not sell a bigger per-identity envelope**:
    allowances are per-seat, one member per seat, with the same window
    structure; continuation past the allowance is usage credits at metered
    rates. Consolidation into one business identity at subscription economics
    is not a product that exists.
    ([Costs docs](https://code.claude.com/docs/en/costs);
    [pricing](https://claude.com/pricing).)

## 3. The operating model: accounts are ledgers, not identities

The word "account" carries two senses: the auth sense (an identity that logs
in) and the accounting sense (a ledger that budget flows through). The entire
model is the move from the first sense to the second.

Under the auth sense, N accounts for one person is fragmentation of an
identity — a workaround, with the pain that implies. Under the accounting
sense, N accounts is a **chart of accounts**: each subscription is a
fixed-price capacity envelope, and each envelope is allocated to a **lane of
work** — a named stream of outcomes. Capacity maps to outcomes instead of to
"all my work for a period of time".

Four properties fall out structurally — none of which need building,
monitoring, or vigilance:

- **Attribution is structural, not observed.** The account boundary _is_ the
  cost boundary. Metered billing needs workspaces, tagging, and discipline that
  decays; here, which credentials a lane runs under _is_ the attribution. The
  observability pane (§5, Visibility) reads it out; nothing has to remember to
  tag.
- **Budget enforcement is physical — given one provisioned invariant: usage
  credits stay disabled on every lane account.** With usage credits enabled, an
  exhausted window continues on metered billing (§2.5) and the fixed-price
  envelope silently becomes an open meter. The envelope holds if and only if
  usage credits are off; provisioning (P1) sets and verifies that per account,
  so the guarantee is checked structure, not memory. With the invariant held, a
  lane cannot overspend its envelope; the window throttles it. No spend alerts
  anyone must read, no caps anyone must check — an envelope that runs dry. This
  is structure-over-vigilance applied to money.
- **Blast radius is contained.** With usage credits disabled (the same
  invariant), a runaway loop in one lane exhausts its own account and stops.
  Every other lane's capacity — and the owner's interactive work — is
  untouched. Under a single pooled account, the same runaway starves
  everything.
- **Priority becomes an allocation act, and exhaustion becomes signal.**
  Importance ordering stops being a stated rule and becomes resourcing: a
  protected lane (e.g. a research floor) is literally an envelope the other
  lanes cannot consume. A lane maxing its window mid-week is a clean, legible
  fact — _this lane's ambition exceeds its allocation_ — prompting a deliberate
  reallocation decision rather than silent overspend or mystery contention.

**The trade this accepts, named honestly**: fixed envelopes are non-fungible
mid-window. An idle week in lane A cannot serve a triple-hungry week in lane B.
Dynamic pooling would maximise utilisation but destroy structural attribution
and blast-radius containment. The recommended posture is **fixed-with-float**
(§5, Capacity): most envelopes fixed to lanes, one unassigned float envelope
for burst, reallocation only at named boundaries. The fixed/dynamic balance is
an owner-tunable dial, not doctrine.

## 4. Topology: one human, many envelopes, any machines

**The invariant that carries compliance: every account belongs to exactly one
human, permanently — one human may hold many accounts, but no account is ever
shared.** Accounts are budget lines, never people. Machines are execution
substrate and do not affect the identity question, provided every machine is
the person's own (their laptop, or VMs whose OS user is that person) and every
session on them is operated by or for that person alone.

Two topologies, both compliant, mixable:

- **Laptop, multiple envelopes.** Credential isolation via one
  `CLAUDE_CONFIG_DIR` per envelope. OS-level isolation is not required — what
  matters is that each Claude Code process resolves the right credentials, and
  the config dir carries them.
- **VM per lane, OS user = the person.** The VM boundary gives credential
  isolation for free (each VM's `~/.claude` belongs to one envelope), plus
  resource isolation and clean lifecycle. The OS username matching the person
  is fine and natural; it is each account's exclusivity to the one human that
  must hold, and it does.

The mechanism, either way:

```bash
# One config dir per envelope; the fleet registry is the source of truth
# for the lane <-> account <-> config-dir <-> machine mapping.
export CLAUDE_CONFIG_DIR="$HOME/.claude-envelopes/lane-research"
claude --channels plugin:fleet-bridge@estate
```

For headless server lanes, mint a long-lived model-request token per account
once, interactively:

```bash
# Per account, one-time, interactive:
claude setup-token
# Then on the lane's VM:
export CLAUDE_CODE_OAUTH_TOKEN="<that lane's token>"
```

The **registry** (a tracked file in the estate) is load-bearing: it maps lane →
account → config dir → machines → channel identity. An agent starting under the
wrong envelope corrupts the ledger invisibly; enforcement belongs in
provisioning config read from the registry, never in anyone's memory.

## 5. The fragmentation ledger and its cures

Every fragmentation cost, its structural cure, and what honestly remains.
"Near zero" here means **near-zero recurring cost**; the one-time provisioning
cost per account is real and is paid once.

| Dimension                | What fragments                                                                                | Structural cure                                                                                                                                                                                                                                       | Residual                                                                                                                                           |
| ------------------------ | --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Auth**                 | Logins, OAuth tokens, trusted-device enrolments per account                                   | Registry-driven `CLAUDE_CONFIG_DIR` per envelope; `setup-token` for headless lanes; a provisioning script that takes a new account from signup to registered envelope in one pass; credentials in the password manager                                | One-time ceremony per account; zero recurring                                                                                                      |
| **Data**                 | Session lists, artifacts, routines, connectors, chat history live per account on claude.ai    | Git is the only durable home — already estate doctrine. Everything claude.ai-side is a **disposable rendering surface**, regenerable from the repo. Designate a single account for artifact publishing and one for routines, recorded in the registry | None recurring, _provided the doctrine holds_ — the cure is a posture, and it is auditable (does anything durable exist only account-side?)        |
| **Attention**            | The mobile app binds one account; N accounts' worth of "Claude needs you" has nowhere to land | An account-agnostic **channel aggregation plane**: one custom channel (or bot) every lane's sessions report into, with permission relay where remote approve/deny is wanted. One designated Remote Control primary account for direct mobile steering | Choosing the one primary. Note this cure ends _better_ than a consolidated business account would: one unified attention surface across everything |
| **Visibility**           | No aggregate `/usage`; consumption is invisible across accounts                               | OpenTelemetry export from every lane into the one observability stack already run (works on every auth type). Yields the aggregate ledger, per-lane utilisation, and the measured multiplier (§7)                                                     | Build-once; then zero recurring                                                                                                                    |
| **Capacity fungibility** | Idle window in lane A cannot serve lane B mid-window                                          | **Float envelope** (one unassigned account for burst) + reallocation of envelope assignments only at fold boundaries                                                                                                                                  | **Irreducible mid-window.** This is the price of structural attribution; the float bounds it, nothing eliminates it                                |
| **Workflow**             | Cross-lane work (coordination, reviews spanning lanes) has no natural home                    | A named **overheads envelope**                                                                                                                                                                                                                        | If skipped, attribution smears silently — the residual is a discipline, not a mechanism                                                            |

Two further disciplines protect the ledger's integrity:

- **The personal account.** Windows are shared with claude.ai chat on the same
  login (§2.4), so the owner's interactive use needs its own envelope or it
  silently taxes whichever lane it lands on.
- **No mid-window borrowing.** When a lane exhausts its envelope, the answer is
  the float or a boundary reallocation — never quietly running that lane on
  another lane's credentials. (The envelope-budgeting tradition, which this
  model is an instance of, is unambiguous: inter-envelope borrowing is the
  mechanism by which envelope systems die. See appendix.)

## 6. Operating disciplines

The recurring rhythm, kept deliberately small:

1. **Exhaustion protocol.** A lane hitting its window is signal, not failure:
   the lane pauses; at the next boundary the owner decides — grant the float,
   add an envelope, or deprioritise. Nothing works around it.
2. **Reallocation ceremony.** Envelope↔lane assignments change only at fold
   boundaries (the estate's existing convergence rhythm), recorded in the
   registry. Ad-hoc reassignment is how attribution rots.
3. **Window-aware scheduling.** Heavy fleet sweeps launch early in a lane's
   5-hour window rather than straddling a reset; scheduled tasks fire with full
   context each tick, so idle always-on sessions are kept context-lean.
4. **Context-lean defaults everywhere.** Small CLAUDE.md, skills over preloaded
   instructions, subagents for verbose operations, hooks that pre-filter
   output. These spend window-budget today and dollars under any future
   regime — they are the efficiency practice that survives repricing (§8).
5. **Measurement always on.** The OTel pane runs continuously; the per-lane
   multiplier and utilisation figures are read at boundaries, not reconstructed
   under duress.

## 7. The arbitrage, measured

**Why it exists.** Subscriptions are priced against typical usage; Anthropic's
own published enterprise figures
([costs docs](https://code.claude.com/docs/en/costs)) put average metered
consumption at $150–250 per developer per month — roughly one x20
subscription's list price. A user who
maxes the windows extracts a large multiple of typical consumption at flat
price.

**Magnitude — estimate, and the exact measurement path.** For a fleet maxing
5–7 x20 accounts weekly (≈ $1,000–1,400/month at list; verify current pricing
in your billing currency), the API-equivalent burn is plausibly 10–40× the
subscription cost. That range is an **estimate**. Two first-hand measurements
replace it:

- `/usage` prices every session at standard list rates (§2.8); summing across
  lanes for a representative week gives the true API-equivalent figure per lane
  and in total.
- The OTel pane (§5, Visibility) gives the same continuously, plus per-lane
  **utilisation** — what fraction of each envelope's windows is actually
  consumed. (The cloud-FinOps vocabulary transplants exactly: subscription =
  reserved capacity, API = on-demand, and utilisation-of-commitment is the
  health metric. See appendix.)

The measured per-lane multiplier is not a curiosity — it is the input to the
migration ranking in §8.

## 8. Non-persistence, and the models that come after

**The arbitrage is not guaranteed to persist, and the direction of travel is
visible.** Weekly caps were introduced precisely in response to continuous
multi-session heavy use (unverified against Anthropic's public surfaces,
2026-08-09 — the stated rationale went to subscribers by email in 2025-07 and
survives only in press reporting). The usage-credit cache-lifetime penalty (§2.5) prices
heavy overflow twice. Consumer terms and pricing can change without notice, and
multi-account extraction at 10–40× is the exact usage shape future revisions
would target. Nothing in the current setup is cheating — and none of it is a
floor. **Treat the arbitrage as a subsidy with an unknown expiry date.**

**Watch triggers** (each one prompts re-running the decision procedure below):
pricing or plan-structure announcements; consumer-terms diffs (the
account-count silence in §2.1 is the clause to watch); window/cap changes; any
new enforcement or account-linking behaviour; changes to the usage-credit
mechanism.

**The hedge is portability, and it is nearly free.** The CLI and the Agent SDK
are the same engine — same tools, same agent loop, same context management
([Agent SDK overview](https://code.claude.com/docs/en/agent-sdk/overview)) —
with the full Claude Code system prompt available in the SDK as the
`claude_code` preset
([modifying system prompts](https://code.claude.com/docs/en/agent-sdk/modifying-system-prompts)). Everything that makes the lanes work — CLAUDE.md, skills,
hooks, channel wiring, lane logic — lives in git and is account-independent.
The billing identity is configuration in the registry. A forced migration is
therefore a config swap, not an architecture change.

**Post-arbitrage models of efficiency, in preference order:**

1. **API + Console workspaces — the metered mirror of the lane model.** Lane →
   workspace; workspace spend limits replace windows as the physical envelope;
   attribution stays structural. The lane model survives repricing intact —
   only the envelope's substance changes from window-allowance to dollars. This
   is the strongest argument for adopting the lane model now: it is the one
   operating model that is _invariant across billing regimes_.
2. **Enterprise seat + usage credits**, where an organisational context fits —
   consolidated identity, metered overflow. Economics converge to API rates at
   high volume, so this is a data-and-auth-consolidation choice, not a cost
   one.
3. **Tokens-per-outcome efficiency as the permanent asset.** Under cheap
   capacity, waste is invisible — the soft-budget-constraint problem: an actor
   whose budget constraint never binds does not economise. The hard envelopes
   bind today at the window; practising context-lean design, model-tier
   gradients (cheap models for mechanical legs, expensive ones for judgement),
   cache-friendly session shapes, and batch-shaped work builds the cost
   structure that makes _any_ future regime affordable. The discipline, not the
   subsidy, is the durable asset.

**The decision procedure, prepared in advance:** maintain the per-lane measured
multiplier (§7). If the arbitrage closes, the ranking answers immediately:
lanes whose value-per-token justifies API rates migrate to workspaces; lanes
that only made sense at subsidy prices are killed or shrunk deliberately. The
point of measuring now is that repricing arrives as a spreadsheet decision, not
a crisis.

## 9. Compliance boundaries — the three bright lines

1. **Each account stays exclusive to its one human, forever.** One person may
   hold many accounts; no other person ever accesses any of them, for any
   reason, including collaborators. (This is the single written-terms clause
   the setup could drift across; §2.2.)
2. **Nothing on subscription auth serves third parties.** The moment agents do
   work _for other people as a product or service_, that workload moves to API
   keys (§2.9).
3. **Accounts remain genuinely the person's**: their payment, their control,
   their machines.

Re-verify the terms and the product mechanics **at time of use** whenever the
use materially changes or a watch trigger (§8) fires. Every vendor fact here is
a 2026-08-04 snapshot, re-verified 2026-08-09 against the References sources.

## 10. Proposals

Each with its warrant and its falsifier, per the exploration contract.

- **P1 — Registry-driven envelope provisioning.** One tracked registry file
  (lane → account → config dir → machines → channel identity) plus a
  provisioning script from signup to registered envelope, including verifying
  that usage credits are disabled on the account (§3's envelope invariant).
  _Warrant_: kills recurring auth cost; makes mis-attribution structurally
  hard. _Falsifier_: if
  a month after adoption, account juggling still consumes owner attention in a
  typical week, the cure has failed and the mechanism needs redesign.
- **P2 — The channel aggregation plane.** One custom channel every lane reports
  into, permission relay where wanted, one Remote Control primary. _Warrant_:
  cures attention fragmentation beyond what a consolidated business account
  would offer. _Falsifier_: attention items still being missed, or lanes still
  stalling on unrelayed permission prompts, after the plane is live.
- **P3 — The OTel unified ledger.** All lanes exporting to the existing
  observability stack. _Warrant_: measurement precedes every migration
  decision; also the only aggregate usage view that exists. _Falsifier_: if the
  pane cannot produce per-lane multiplier and utilisation figures within a week
  of running, it is the wrong instrument.
- **P4 — Float and overheads envelopes.** One unassigned burst account; one
  named home for cross-lane work. _Warrant_: lumpy demand and cross-lane work
  are structural, and unhomed they erode either throughput or attribution.
  _Falsifier_: a float unused for a full season means over-provisioning — drop
  to N−1 accounts.
- **P5 — Boundary-only reallocation.** Envelope assignments change at fold
  boundaries only. _Warrant_: envelope systems die by ad-hoc borrowing; the
  ceremony is the immune system. _Falsifier_: any observed mid-window
  credential borrowing means the discipline is not holding — redesign the
  mechanism (e.g. make lane credentials physically unavailable to other lanes)
  rather than restating the rule.
- **P6 — The portability fire drill.** Once, deliberately: run one lane for a
  day on an API key via the same registry mechanics, then swap it back.
  _Warrant_: a hedge that has never been exercised is aspirational; the drill
  converts §8's "config swap" claim from assertion to demonstrated fact and
  surfaces the hidden couplings now. _Falsifier_: if the swap takes more than
  an hour of real work, billing portability is not yet true — and that is
  exactly the finding the drill exists to force.

**Assumptions that changed in the making** (the exploration's honest ledger):
"fragmentation is a cost to eliminate" became "isolation is the product; make
wanted crossings free"; "near zero" split into near-zero _recurring_ with a
real one-time cost and two named irreducibles; "the lane model is a clever
adaptation" became "the lane model is the regime-invariant operating model, and
the subsidy is the temporary part".

**Unresolved evidence that could materially change this synthesis**: current
pricing in the billing currency actually paid; the measured (not estimated)
per-lane multipliers; whether Anthropic's terms acquire account-count or
account-linking language; channels graduating from research preview (or its
custom-channel path changing); the true size of the one-time provisioning cost
once P1 is scripted.

## 11. Verification ledger

| Status                                                    | Item                                                                                                                                                                   |
| --------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Fact** (read first-hand 2026-08-04; re-read 2026-08-09) | Everything in §2, with sources linked there and in §References                                                                                                         |
| **Estimate**                                              | The 10–40× multiplier; the ≈$200/month x20 list price; the $1,000–1,400/month fleet cost                                                                               |
| **Owner's call**                                          | Lane taxonomy; number of envelopes; float size; which account is the Remote Control primary; the fixed-vs-dynamic allocation dial                                      |
| **To verify at time of use**                              | Current pricing in billing currency; terms diffs against the §2 snapshot; channels preview status; seat-allowance sizes if the Enterprise comparison ever becomes live |

## Appendix — play harvest

Associations surfaced by the free-play pass over this material. Marked as
associations — reports that a resemblance appeared — never as findings.

- **This is shaped like envelope budgeting** (the cash-envelope tradition;
  [Wikipedia: Envelope system](https://en.wikipedia.org/wiki/Envelope_system)).
  Kept because it imports a mature failure catalogue: envelope systems fail by
  inter-envelope borrowing, by category proliferation (too many envelopes →
  admin swamps benefit), and by treating an empty envelope as shame rather than
  signal. (The failure catalogue is this document's reading of the tradition's
  practice lore, not the linked article's content.) All three transplant
  directly (P5, P4's falsifier, and the §6 exhaustion protocol respectively).
- **This is shaped like cloud FinOps** — reserved instances vs on-demand
  ([FinOps Framework](https://www.finops.org/framework/)). Kept because the
  discipline that grew around reserved capacity (utilisation-of-commitment as
  the health metric, rightsizing at review boundaries, coverage planning) is
  the mature template for envelope operations, and its vocabulary drops in
  unchanged (§7).
- **This reminded me of the soft budget constraint** (Kornai; see Kornai,
  Maskin and Roland,
  ["Understanding the Soft Budget Constraint"](https://www.aeaweb.org/articles?id=10.1257/002205103771799999),
  Journal of Economic Literature 41(4), 2003): an actor whose budget never
  binds does not economise. Kept as the inversion that makes the arbitrage's
  _closing_ partly benign — hard envelopes are already teaching the efficiency
  that repricing would otherwise force traumatically (§8.3).
- **The word "account" itself** carries the auth sense and the ledger sense;
  the whole model is the move from one to the other. Kept as §3's opening.
- **This looks shaped like database sharding**
  ([Wikipedia: Shard (database architecture)](https://en.wikipedia.org/wiki/Shard_%28database_architecture%29)) —
  the registry as shard map, cross-lane work as the expensive cross-shard join.
  Kept small: it predicts where the pain concentrates (§5, Workflow).
- **Discarded, visibly**: "the 5-hour windows as a liturgy of hours" — a
  monastic-rhythm metaphor that arrived fluently and added colour but no
  content; the practical residue (window-aware scheduling) stands on its own in
  §6.3. Discarded per the confabulation guard.

## References

Every source below was fetched first-hand on 2026-08-09; §2's facts were
originally read on 2026-08-04 from the same surfaces.

Anthropic sources:

- Anthropic,
  [Consumer Terms of Service](https://www.anthropic.com/legal/consumer-terms)
  (effective 2025-10-08; accessed 2026-08-09) — account-count silence (§2.1),
  the account-sharing prohibition (§2.2), the automated-access clause (§2.3).
- Claude Code docs,
  [Manage costs effectively](https://code.claude.com/docs/en/costs) (accessed
  2026-08-09) — seat windows shared with Claude chat and Cowork (§2.4, §2.10),
  the usage-credit cache-lifetime drop from 1 hour to 5 minutes (§2.5),
  OpenTelemetry export on every setup (§2.6), `/usage` priced at standard list
  rates (§2.8), per-seat allowances and usage-credit continuation (§2.10), and
  the $150–250 per developer per month enterprise figure (§7).
- Claude Help Center,
  [What is the Max plan?](https://support.claude.com/en/articles/11049741-what-is-the-max-plan)
  (accessed 2026-08-09) — Max 5x/20x tiers and list prices, the five-hour
  session reset, the weekly limit across all models (§2.4, §7, §11).
- Claude Help Center,
  [How do usage and length limits work?](https://support.claude.com/en/articles/11647753-how-do-usage-and-length-limits-work)
  (accessed 2026-08-09) — all Claude product surfaces on one login count
  towards the same usage limit (§2.4).
- Claude Help Center,
  [Use Claude Code with your Pro or Max plan](https://support.claude.com/en/articles/11145838-use-claude-code-with-your-pro-or-max-plan)
  (accessed 2026-08-09) — usage shared across Claude and Claude Code on one
  subscription; Claude Code on subscription auth as a supported product
  surface (§2.3, §2.4).
- Claude Help Center,
  [Manage usage credits for paid Claude plans](https://support.claude.com/en/articles/12429409-manage-usage-credits-for-paid-claude-plans)
  (accessed 2026-08-09) — usage credits as opt-in, explicitly enabled metered
  continuation at standard API rates (§2.5, §3).
- Claude Code docs,
  [Push events into a running session with channels](https://code.claude.com/docs/en/channels)
  (accessed 2026-08-09) — research-preview status, two-way MCP event push,
  permission relay, claude.ai or Console API key auth, custom channels, the
  development flag, `allowedChannelPlugins` (§2.7).
- Claude Agent SDK docs,
  [Agent SDK overview](https://code.claude.com/docs/en/agent-sdk/overview)
  (accessed 2026-08-09) — "Anthropic does not allow third party developers to
  offer claude.ai login or rate limits for their products" (§2.9); the SDK
  gives "the same tools, agent loop, and context management that power Claude
  Code" (§8).
- Claude Agent SDK docs,
  [Modifying system prompts](https://code.claude.com/docs/en/agent-sdk/modifying-system-prompts)
  (accessed 2026-08-09) — the `claude_code` system-prompt preset (§8).
- Claude, [Pricing](https://claude.com/pricing) (accessed 2026-08-09) —
  per-seat Team pricing and the Enterprise seat-plus-usage structure (§2.10).

External concepts adopted in the appendix:

- Wikipedia,
  [Envelope system](https://en.wikipedia.org/wiki/Envelope_system) (accessed
  2026-08-09) — the cash-envelope budgeting tradition.
- FinOps Foundation, [FinOps Framework](https://www.finops.org/framework/)
  (accessed 2026-08-09) — the cloud financial-operations discipline, including
  rate and usage optimisation.
- Kornai, Maskin and Roland,
  ["Understanding the Soft Budget Constraint"](https://www.aeaweb.org/articles?id=10.1257/002205103771799999),
  Journal of Economic Literature 41(4), 2003, pp. 1095–1136 (accessed
  2026-08-09) — the soft-budget-constraint concept.
- Wikipedia,
  [Shard (database architecture)](https://en.wikipedia.org/wiki/Shard_%28database_architecture%29)
  (accessed 2026-08-09) — horizontal partitioning and the cost of cross-shard
  access.

One claim remains unverified against an Anthropic-published surface: §8's
statement of _why_ weekly caps were introduced. Anthropic's stated rationale
(continuous 24/7 background use, account sharing and reselling) went to
subscribers by email in 2025-07 and survives only in press reporting; it is
marked unverified at the claim.
