# Recommendation — the amended Cloudflare WAF rule for the MCP surface

**Date**: 2026-08-21
**Author**: Seat S3 (Implementer, PDR-117), `mcp-submission-drive` thread, staffed by the
Director seat "Tulip mends Bark" (session `e6d535`)
**Scope**: the exact configuration change recommended for `Cloud-Config#558`, the measurement
design for the observation window, and the rate-limit rules for the OAuth endpoints
**Status**: **SUPERSEDED IN PART — see the correction in §0a. The HCL in §3.1, §3.2 and §3.3
cannot be applied; Cloudflare rejects its structure. The measurement design in §4, §5 and §6
stands unchanged and is still wanted.**

---

## 0a. CORRECTION, 2026-08-21 — the recommended HCL cannot be applied

**Added by Seat S4** (Implementer, PDR-117, `mcp-submission-drive`, Director seat "Tulip mends
Bark", session `e6d535`) **after a real apply of `Cloud-Config#558` failed.** Nothing below
deletes this document's HCL. It is marked, not removed, so a reader can see what was proposed
and why Cloudflare refused it.

### 0a.1 What was measured

The owner confirmed an apply of `Cloud-Config#558` in the `cloudflare-rulesets` Terraform Cloud
workspace at **14:47:14**. It **errored at 14:47:51** — run `run-VTjEwK6Yq7rwvUzr`, target
`cloudflare_ruleset.http_request_firewall_managed`:

```text
Error: error updating ruleset with ID "c48dd2c4d3a44c039737cc1982422afe"
  more than one rule is trying to execute the same managed ruleset (20014)
  at firewall_managed_rules.tf line 22
```

**Nothing landed.** The apply counters read `additions/changes/destructions: None`, and
Cloudflare rejects the ruleset PATCH atomically, so there is no half-applied state. Verified
independently at the edge: `/probe.sql` returns 403 on both `mcp.thenational.academy` and
`www.thenational.academy` (the pre-existing "Block SQL requests" custom rule), the control
`/probe.txt` returns 404 on both — so the 403s are the WAF and not a broken zone — and the MCP
surface is healthy (`/mcp/healthz` 200, `POST /mcp` 401).

### 0a.2 The constraint is on the STRUCTURE, so both amendments fail identically

`Cloud-Config#558` adds a second `execute` rule for the OWASP Core Ruleset
(`4814384a9e5d4991b9815dcfc25d2f1f`) in the zone's `http_request_firewall_managed` phase: one
scoped `http.host eq "mcp.thenational.academy"`, one scoped `ne`. **Cloudflare forbids that
shape.** Vendor-documented, verbatim, from Cloudflare's account-level managed-rulesets page
read live on 2026-08-21:

> At the zone level, each WAF managed ruleset can only be deployed once. At the account level,
> you can deploy each managed ruleset more than once.

**Therefore §2.1 and §2.2 do not cure the defect.** Changing `action = "block"` to `"log"` and
`score_threshold = 40` to `60` changes values inside a structure Cloudflare will not accept.
The amended HCL in §3.1 fails with the same `20014` at the same line. The two amendments were
correct about *what the values should be*; they are inert until the structure changes.

Nor can one execute rule carry both behaviours. Cloudflare's override documentation, read live
on the same date, supports three override levels — ruleset, tag/category, and rule — and
**none of them accepts a filter expression.** An override applies uniformly to its scope. So a
single zone-level execute rule cannot give `mcp.thenational.academy` one action and threshold
while giving every other host another.

### 0a.3 §3.3 contains a SECOND, independent instance of the same defect

Flagged loudly because it is not obvious and it is load-bearing for §4's Day 0 gate G1.

Section 3.3 adds an `execute` rule for the **Cloudflare Managed Ruleset** scoped to the MCP
host, while §3.3's own premise is that the fenced `rules[0]` placeholder *is the
dashboard-managed deployment of that same ruleset*. If that premise holds, §3.3's rule is a
second zone-level deployment of the Cloudflare Managed Ruleset and hits `20014` for exactly the
same reason. Gate G1 as written ("**Both** managed rulesets scoped to the MCP host") is
therefore unreachable in its current form.

One corroboration worth recording: `rules[0]` executing the Cloudflare Managed Ruleset has
coexisted with an OWASP execute rule in this phase for a long time without error. That
confirms the limit is **one deployment per managed ruleset**, not a cap on the number of
execute rules in a phase.

### 0a.4 A green `terraform plan` is NOT evidence a Cloudflare ruleset apply will succeed

**This belongs in this document as a general caution, not as a footnote to one defect.**

`20014` is **invisible to `terraform plan`**. The plan for `#558` was clean. The HCL was valid
v4.29.0 syntax. Terraform's own validation passed. The rule is enforced only by Cloudflare's
API at PATCH time, so nothing in the Terraform toolchain — and nothing any reviewer held before
the apply — could have caught it. For `cloudflare_ruleset` changes, treat a plan as proof that
Terraform understands the configuration and **not** as proof that Cloudflare will accept it.

### 0a.5 A moving `latest-change-at` is NOT evidence that state changed

On this workspace, `latest-change-at` **moved to 14:47:50** even though the apply errored and
wrote nothing. It records an **attempt**. It had been used as a positive control earlier the
same day, and on this occasion it would have misled the reader into believing the change
landed.

### 0a.6 What in this document still stands

**All of it except the HCL.** The measurement design is unaffected by the structural constraint
and is still wanted, specifically:

- **§4.1** — the Day 0 gate, with the caveat that G1 needs restating against whatever structure
  replaces §3.1 (see §0a.3).
- **§4.2** — the weekly control probe, the step that makes a zero mean something.
- **§4.3** — what to count and against what denominator.
- **§4.4** — the named list of deliberate tester requests, because passive observation will
  under-sample the interesting case.
- **§4.5** — the nine conjunctive Day 14 criteria, and the principle that enforcement happens
  when the exit criteria are met and not when the calendar says so.
- **Any actual `block` during the window is a defect, not a datum.**
- **§5** — the false-positive design and the honest scope of the problem.
- **§6** — the rate-limit rules on `/oauth/register` and `/oauth/token`, which are custom rules
  in a different phase and are **not** affected by `20014`.
- **§1.3** — the sequencing hazard. `Cloud-Config#561` has since merged (`main` is now at
  `fa179f2a1`), which discharges that specific item.

### 0a.7 The consequence for `Cloud-Config@main`

`Cloud-Config#558` **merged** at 2026-08-21T13:34:22Z. Its
`infrastructure/cloudflare/rulesets/firewall_managed_rules.tf` is byte-identical between that
merge commit and current `origin/main`. **So `Cloud-Config@main` now declares a configuration
Cloudflare will not accept, and any apply in the `cloudflare-rulesets` workspace from `main`
fails** — including applies for unrelated changes that are already waiting in that workspace.
Curing that is the first call on this lane, ahead of any new feature.

---

## 0. What this is, and what was touched

This document is the **written recommendation** for the amended WAF rule. It is the successor
step to Seat S2's review (this repository's PR 932,
`.agent/reports/security/mcp-edge-waf-security-review-2026-08-21.md`), which measured the
problem. This document decides the configuration.

**Nothing was applied.** No `terraform plan`, no `terraform apply`, no ruleset edit, no
dashboard change. **`oaknational/Cloud-Config` was read strictly read-only, through `gh api`
only.** The owner's branch `feat/MCP-622-mcp-waf-block` was not pushed to, rebased, or
commented on; no local Cloud-Config checkout was entered, and no branch there was switched.
No pull request was raised against that repository.

The rollout — log-only for around two weeks with internal people testing and reviewing, then
enforce — is the owner's, and §4 is written so that it produces a decision rather than an
elapsed fortnight.

### Refs read, named

Every configuration claim below names the ref it came from.

| Source | Ref read | How |
| --- | --- | --- |
| `oaknational/Cloud-Config` Terraform | **`main` at `f2a1c2981`** (2026-08-21T13:27Z) | `gh api .../contents/...?ref=...` |
| `Cloud-Config` PRs 557, 558, 561 | PR head, body and file patches as of 2026-08-21 | `gh api .../pulls/...` |
| Seat S2's review | branch `origin/docs/mcp-edge-waf-security-review` (PR 932, **open**) | `git show` |
| Live edge behaviour | production, 2026-08-21, **benign GETs only** | `curl` (§1.3) |
| Cloudflare product behaviour | `developers.cloudflare.com`, read live 2026-08-21 | `WebFetch`, quoted in §2.4 |
| Terraform provider schema | `cloudflare/terraform-provider-cloudflare` **`v4.29.0`** `docs/resources/ruleset.md` | raw GitHub |

The provider constraint matters and is easy to get wrong: `terraform.tf` on
`Cloud-Config@main` pins `cloudflare/cloudflare` at **`~> 4.29.0`**. All HCL below is v4
syntax, verified field by field against the v4.29.0 schema. Provider v5 restructured
`cloudflare_ruleset` and its idiom would not apply here.

### Measurement versus inference

Statements are labelled. **Measured** means I ran the instrument and quote its output.
**Inferred** means I reasoned from a measurement or from vendor documentation and could be
wrong. **Vendor-documented** means I quote Cloudflare's own current documentation. A control
probe validates the *instrument*, never the *inference*.

---

## 1. What has changed since Seat S2's review — read this before anything else

Three things moved in the hours after that review was written. Two simplify the
recommendation. One is a hazard that nobody has recorded yet.

### 1.1 `Cloud-Config#557` is now merged

**Measured.** `#557` (proxy `mcp.thenational.academy`) merged at **2026-08-21T13:27:05Z**, and
`main` moved to `f2a1c2981`. S2's report records it as open, and S2's §2 correction ("applied
live, open as a PR") was accurate when written and is now stale. The declared and live states
agree on proxying.

### 1.2 The MCP surface now has ONE front door — S2's "two front doors" gap is closed

This removes a caveat rather than adding one, so it is worth stating plainly.

**Measured, 2026-08-21, benign `GET` requests only:**

```text
404  https://www.thenational.academy/mcp
404  https://www.thenational.academy/.well-known/oauth-protected-resource/mcp
404  https://www.thenational.academy/.well-known/oauth-authorization-server
404  https://www.thenational.academy/mcp/healthz
200  https://mcp.thenational.academy/mcp/healthz
200  https://mcp.thenational.academy/.well-known/oauth-authorization-server
```

The `www` route is gone from the live edge; `mcp.thenational.academy` serves. **So
host-scoping every rule to `mcp.thenational.academy` is no longer a partial-coverage gap** —
it is complete coverage of the protocol's front door. S2's Gap 2 is discharged, and the
Director's independent check of the same four `www` paths agrees with mine.

### 1.3 But `Cloud-Config#561` is NOT merged, and that is a live hazard — flagged loudly

**Measured.** `#561` ("remove the `www.thenational.academy` MCP routing rules") is
**`state: open`, `merged: false`, `merged_at: null`**. Its change is live at the edge — my
404s prove that — but it is **not in the declaration**. On `Cloud-Config@main` at `f2a1c2981`
the `http_request_origin` ruleset still declares:

```text
description = "Serve the Oak MCP app at www.thenational.academy/mcp (MCP-172)"
expression  = "(http.host eq \"www.thenational.academy\") and (http.request.uri.path eq \"/mcp\" or ...)"
origin      = curriculum-mcp-alpha.oaknational.dev:443
```

and `config_settings.tf` still declares the paired cache-bypass rule for the same scope.

**The consequence, stated as sharply as I can.** The rules recommended in this document land in
`firewall_managed_rules.tf` and `rate_limits.tf` — **the same `cloudflare-rulesets` workspace**
as those stale `www` declarations. **An untargeted `terraform apply` on that workspace to land
this WAF change would simultaneously re-create the `www` MCP front door**, restoring the second
door that §1.2 just measured as closed, and re-pointing it at the unproxied alpha origin. It
would also apply the pre-existing drift S2 recorded on `http_ratelimit` and
`http_request_firewall_custom`, which includes deleting a rate-limit rule that exists in
Cloudflare and not in the repository.

**Therefore: `#561` must merge before, or in the same apply as, the change recommended here.**
That is not a preference; it is the difference between a change that narrows the surface and
one that silently re-widens it. This is the single most important sequencing fact in this
document and it is new since S2's review.

---

## 2. The two amendments to `Cloud-Config#558`

`#558` was authored **2026-08-20T12:01Z**, before the owner's security brief of 2026-08-21.
Today's ruling supersedes it. `#558` is a correct and well-reasoned change that reaches the
right destination one step early; the amendment is two values, and both are mechanical
consequences of the ruling rather than corrections of judgement.

`#558` currently sets, on the `mcp.thenational.academy`-scoped execute rule:

```hcl
        rules {
          id              = local.owasp_score_exceeded_rule[0].id
          action          = "block"
          score_threshold = 40
        }
```

Everything else it does is right and stays: the OWASP Core Ruleset, paranoia level 1 only with
`paranoia-level-2/3/4` explicitly disabled, the host-scoped `execute` rule in preference to a
skip rule (which is what the `#551` reviewers asked for), and the narrowing of the zone-wide
rule's expression.

### 2.1 Amendment 1 — `action = "block"` becomes `action = "log"`

The owner's rollout is log-only for around two weeks with internal testing and review, then
enforcement. `#558` goes straight to enforcement.

**This is not procedural.** Seat S2 measured, with controls, that **curriculum-shaped JSON-RPC
bodies are blocked at the edge in production today**, and that two of the blocked payloads are
entirely legitimate KS4 computing teacher requests. `#558` as written does not cure that; it
formalises it into a clean 403 — which is a real improvement in *failure mode* for a
non-browser client and no improvement at all in *false-positive rate*. Log-only for the window
is what unblocks those requests while the evidence is gathered, which is precisely what the
owner asked for and why.

**Vendor-documented, and load-bearing for §2.3:** Cloudflare's rules-language actions
reference states that `log` is **non-terminating** and **"Only available on Enterprise
plans"**, and describes it as "Recommended for validating rules before committing to a more
severe action". Oak's zone is Enterprise (Logpush, 30-day Security Events retention).
Cloudflare's OWASP configure-via-API page lists `log` explicitly among the actions the
Inbound Anomaly Score Exceeded rule may be set to, alongside `block`, `managed_challenge`,
`js_challenge` and `challenge`.

`managed_challenge` is never an option on this host, in either stage, for the reason `#558`
itself gives: a non-browser MCP client cannot solve a challenge, so it presents as a hung
connection with nothing to report.

### 2.2 Amendment 2 — `score_threshold = 40` becomes `score_threshold = 60`

The owner's ruling is "lowest paranoia level and high anomaly threshold". `#558` has the
paranoia level exactly right. The threshold is the vendor-vocabulary trap.

**Vendor-documented**, from Cloudflare's OWASP Core Ruleset concepts page. There are exactly
three thresholds:

| Cloudflare's dashboard label | Numeric threshold | Effect |
| --- | --- | --- |
| **Low** | 60 and higher | **Fewest** requests actioned — fewest false positives |
| **Medium** | 40 and higher (**default**; what `main` and `#558` set) | Baseline |
| **High** | 25 and higher | **Most** requests actioned — most false positives |

And, verbatim from that page: *"Configuring a Low threshold means that more rules will have to
match the current request for the WAF to apply the configured ruleset action."*

**The number and the label run in opposite directions.** The ruling is unambiguous and the
intent is exactly right — a permissive threshold, fewer false positives. In Cloudflare's
vocabulary that intent is **the number 60**, and the UI labels 60 "Low". Cloudflare's own
API example on its OWASP configuration page uses `"score_threshold": 60`.

**Implementation instruction: specify the number, never the label.** Selecting the dashboard
option labelled "High" would set 25, the most sensitive setting, and would make the
false-positive problem S2 measured considerably worse.

**One deliberate consequence, stated so it is a choice and not an accident.** Logging at 60
means the window observes only requests scoring 60 or above; requests scoring 40–59 are
invisible to it. That is the right trade, because the threshold is already decided by the
ruling and the window's question is "is 60-and-block safe to enforce", not "which threshold".
It also keeps Stage 2 to a single-field change, which is the version hardest to get wrong. If
anyone ever wants the 40–59 band, the instrument is Security Analytics or the
`firewallEventsAdaptive` GraphQL dataset over the OWASP contributing rules — not a second
Terraform rule.

### 2.3 The zone-wide exclusion stays as `#558` writes it — and its character changes

`#558` narrows the zone-wide rule from `expression = "true"` to
`expression = "(http.host ne \"mcp.thenational.academy\")"`, and explains it as an efficiency
measure: "Excluding it here keeps the ruleset from running twice for the same request."

**Verdict: keep it exactly as written. But under a `log` action that exclusion stops being an
efficiency measure and becomes the safeguard the whole design rests on.**

The reasoning is short and it is the thing a naive amendment gets wrong. `block` is
terminating; `log` is not. With `#558`'s `block`, the MCP-scoped rule ends evaluation and a
later zone-wide rule never runs, so the exclusion really is only tidiness. Change the action
to `log` and the MCP-scoped rule **falls through**. If the zone-wide rule still read
`expression = "true"`, it would then execute the same ruleset over the same request at
threshold 40 with `action = "managed_challenge"` — and Oak's MCP clients would receive exactly
the silent hang the owner ruled out, from a rule nobody amended.

So: the exclusion is mandatory, and the comment above it should say why. Anyone reviewing the
plan should confirm the zone-wide rule's expression is the `ne` form and not `true`.

### 2.4 The vendor facts this rests on, with their sources

Verified first-hand on 2026-08-21 rather than inherited, because S2's report and this
recommendation would otherwise share a single unverified chain.

| Fact | Source |
| --- | --- |
| Thresholds are 60 / 40 (default) / 25, labelled Low / Medium / High | `waf/managed-rules/reference/owasp-core-ruleset/concepts/` |
| `log` is non-terminating and Enterprise-only | `ruleset-engine/rules-language/actions/` |
| `block` and `managed_challenge` are terminating | same |
| The anomaly-score rule accepts `log`; example uses `score_threshold: 60` | `waf/managed-rules/reference/owasp-core-ruleset/configure-api/` |
| OWASP Core Ruleset ID `4814384a9e5d4991b9815dcfc25d2f1f`; score rule `6179ae15870a4bb7b2d480d4843b323c` | same |
| Cloudflare Managed Ruleset ID `efb7b8c949ac4650a09736fc376e9aee`; rules carry individual default actions; a dashboard deployment applies to all incoming traffic by default | `waf/managed-rules/reference/cloudflare-managed-ruleset/` |
| Paranoia levels PL1–PL4 are cumulative; PL1 is the default | OWASP concepts page |
| A ruleset-level override sets one action for **all** rules in a managed ruleset with **no rule IDs required**; precedence is ruleset < tag < rule | `ruleset-engine/managed-rulesets/override-managed-ruleset/` |
| Rate-limiting `period` values: 10, 60, 120, 300, 600, 3600. `mitigation_timeout`: 0, 10, 60, 120, 300, 600, 3600, 86400 | `waf/rate-limiting-rules/parameters/` |
| A custom response is available **only** on the `block` action; status 400–499, body up to 30 KB | same |
| `cf.unique_visitor_id` and `ip.src` cannot both be characteristics of one rule | same |
| WAF inspects up to **128 KB** of a request body on Enterprise; the 1 MB rollout was rolled back because it increased false positives in the Cloudflare Managed Ruleset and the OWASP Core Ruleset | `changelog/post/2025-12-05-waf-max-payload-size-change/` |
| HTTP phase order is `http_request_firewall_custom` → `http_ratelimit` → `http_request_firewall_managed` | `ruleset-engine/reference/phases-list/` |
| Within one phase, **account-level rules are evaluated before zone-level rules** | `ruleset-engine/about/phases/` |
| `overrides` supports a top-level `action`; rule-level overrides support `action` and `score_threshold`; `ratelimit` supports `characteristics`, `period`, `requests_per_period`, `mitigation_timeout`, `counting_expression`, `requests_to_origin`; `logging` is documented as **"Only valid for skip action"** | provider **v4.29.0** `docs/resources/ruleset.md` |

**One correction to S2's report on a vendor number.** S2 states "Enterprise supports periods up
to 65,535 seconds". Cloudflare's current rate-limiting parameters page enumerates the available
API values for the counting period as **10, 60, 120, 300, 600, 3600** with no Enterprise
extension named. The §6 rules use documented values only.

---

## 3. The exact amended HCL

Copy-pasteable, v4.29.0 syntax, in the idiom of the existing files. **Not applied.**

### 3.1 `infrastructure/cloudflare/rulesets/firewall_managed_rules.tf` — Stage 1 (the window)

> **⚠ DO NOT APPLY — see §0a.** Cloudflare rejects this structure with error
> `20014` (*"more than one rule is trying to execute the same managed ruleset"*),
> measured on a real apply on 2026-08-21. **The vendor constraint is normative:
> "At the zone level, each WAF managed ruleset can only be deployed once."** The
> values below are right; the two-execute-rule shape they sit in is not. Left in
> place deliberately so the proposal and its refutation are both legible.

This is the amendment to `#558`. Replace `#558`'s added rule with this one, and amend the
comment on the zone-wide rule below it.

```hcl
  # mcp.thenational.academy serves the MCP protocol to non-browser clients,
  # which cannot solve an interactive challenge: a managed_challenge presents to
  # them as a hung connection rather than a refusal, and nothing surfaces it --
  # a Cloudflare rejection never reaches the application, so it is invisible to
  # the app's error reporting. This host therefore runs the SAME ruleset at the
  # SAME paranoia level (1) as the rest of the zone, and differs in two ways:
  #
  #   action = "log"          Observation only, for the two-week measurement
  #                           window. Becomes "block" at Stage 2 and NEVER
  #                           managed_challenge (see above). "log" is
  #                           non-terminating and is an Enterprise-only action.
  #
  #   score_threshold = 60    The LEAST sensitive of the three documented
  #                           thresholds (60 / 40 default / 25). Cloudflare's
  #                           dashboard LABELS 60 as "Low": the label names
  #                           sensitivity, not the number, and the two run in
  #                           opposite directions. A high anomaly threshold --
  #                           fewer requests actioned, fewer false positives --
  #                           is THIS value. Do NOT pick the dashboard option
  #                           labelled "High": that is 25, the most sensitive
  #                           setting, and it would make false positives worse.
  #
  # Requested in review of PR #551 by @johnrobeds and @rjkward.
  rules {
    action = "execute"
    action_parameters {
      id = data.cloudflare_rulesets.owasp_core.rulesets[0].id

      overrides {
        # Matches the zone-wide rule below: paranoia-level-1 only.
        categories {
          category = "paranoia-level-2"
          enabled  = false
        }
        categories {
          category = "paranoia-level-3"
          enabled  = false
        }
        categories {
          category = "paranoia-level-4"
          enabled  = false
        }
        rules {
          id              = local.owasp_score_exceeded_rule[0].id
          action          = "log"
          score_threshold = 60
        }
      }
    }
    description = "MCP surface: OWASP Core, log-only observation window (MCP-622)"
    expression  = "(http.host eq \"mcp.thenational.academy\")"
    enabled     = true
  }
```

And the zone-wide rule's expression, unchanged from `#558` but with the reason corrected:

```hcl
    # Every host except the MCP protocol endpoint, which has its own execute
    # rule above. This exclusion is LOAD-BEARING, not an optimisation: the MCP
    # rule's action is "log", which is NON-TERMINATING, so without this
    # exclusion the request would fall through to this rule and be evaluated
    # again at threshold 40 with action managed_challenge -- delivering to MCP
    # clients exactly the silent hang the host-scoped rule exists to avoid.
    # Reviewers: confirm the plan shows this expression, not "true".
    expression = "(http.host ne \"mcp.thenational.academy\")"
    enabled    = true
```

### 3.2 Stage 2 — enforcement, after §4's exit criteria are met

> **⚠ DO NOT APPLY — see §0a.** Cloudflare rejects this structure with error
> `20014` (*"more than one rule is trying to execute the same managed ruleset"*),
> measured on a real apply on 2026-08-21. **The vendor constraint is normative:
> "At the zone level, each WAF managed ruleset can only be deployed once."** The
> values below are right; the two-execute-rule shape they sit in is not. Left in
> place deliberately so the proposal and its refutation are both legible.

One field, in one place:

```diff
         rules {
           id              = local.owasp_score_exceeded_rule[0].id
-          action          = "log"
+          action          = "block"
           score_threshold = 60
         }
```

`score_threshold` does not move. Rollback is the same edit in reverse.

**At Stage 2, add a custom block response.** A `block` action supports one, and Cloudflare's
default is an HTML interstitial. An MCP client that receives HTML where JSON-RPC was expected
reports a parse failure, not a refusal — which is what every request S2 measured as blocked
received. This is on the *zone-wide* execute rule's sibling scope, so it belongs on the
host-scoped rule:

```hcl
    action = "execute"
    action_parameters {
      id = data.cloudflare_rulesets.owasp_core.rulesets[0].id
      # ... overrides as above, with action = "block" ...
      response {
        status_code  = 403
        content      = "{\"error\":\"forbidden\",\"error_description\":\"Request blocked by the Oak edge firewall.\"}"
        content_type = "application/json"
      }
    }
```

**[verify at plan time]** A custom `response` on an `execute` rule is accepted by the schema;
whether the API honours it for a managed-ruleset block on this zone should be confirmed in the
plan output rather than assumed. If it is rejected, the fallback is a custom error response
configured at the ruleset level in the dashboard, and the recommendation stands without it.

### 3.3 The Cloudflare Managed Ruleset — what CAN be authored blind, and the one step that cannot

> **⚠ PARTIALLY DEAD — see §0a.3.** The ruleset-level-override analysis in this
> section is SOUND and stands. What does not is any part that adds a SECOND
> `execute` rule for the same managed ruleset — Cloudflare rejects that shape
> (`20014`), and §0a.3 records that this section contains an independent instance
> of the same defect. Read the override reasoning; do not copy the structure.

**This corrects S2 §7.3, which concluded the override "cannot be written blind".** Part of it
can, and the part that cannot is narrower and sharper than that section implies.

**What can be written without any dashboard access.** A **ruleset-level** override sets one
action for every rule in a managed ruleset and requires no rule IDs at all — Cloudflare's
override documentation gives exactly this shape, and provider v4.29.0 exposes `overrides.action`
for it. So the log-only treatment for the signature-based ruleset is authorable today:

```hcl
data "cloudflare_rulesets" "cloudflare_managed" {
  zone_id = data.cloudflare_zone.thenational.id

  filter {
    name = "Cloudflare Managed Ruleset"
  }
}
```

```hcl
  # The Cloudflare Managed Ruleset is SIGNATURE-based: unlike OWASP it does not
  # accumulate a score, so a single rule match is enough to act. That makes it
  # the more likely false-positive source on JSON-RPC request bodies, not the
  # less -- and Cloudflare's own 2025-12-05 payload-limit rollback names this
  # ruleset first among the two that produced the false-positive surge.
  #
  # A RULESET-LEVEL override sets one action for every rule in the ruleset and
  # needs no rule IDs, so this can be authored without dashboard access.
  # Precedence is ruleset < tag < rule, so a later rule-level exclusion earned
  # by the window's evidence will still win over this.
  rules {
    action = "execute"
    action_parameters {
      id = data.cloudflare_rulesets.cloudflare_managed.rulesets[0].id

      overrides {
        action = "log"
      }
    }
    description = "MCP surface: Cloudflare Managed Ruleset, log-only observation window (MCP-622)"
    expression  = "(http.host eq \"mcp.thenational.academy\")"
    enabled     = true
  }
```

**[verify at plan time]** `filter { name = ... }` on the `cloudflare_rulesets` data source is
the idiom this file already uses for OWASP, and `rulesets[0]` assumes exactly one match. Confirm
the plan resolves it to one ruleset. The documented ID
`efb7b8c949ac4650a09736fc376e9aee` is the pin if the filter proves ambiguous.

**What cannot be written from that repository, and why it blocks the window.** The existing
`rules[0]` placeholder is the dashboard-managed deployment of this same ruleset, fenced by
`lifecycle { ignore_changes = [rules[0]] }`, and the owner read its scope from the dashboard
on 2026-08-20: **"Execution scope: All incoming requests"**.

`rules[0]` is **index 0** — it executes **first** in the phase. So:

- It evaluates the Managed Ruleset over MCP traffic with each rule's own default action, and
  most of those defaults are `block`, which is **terminating**.
- **No rule added later in this resource can prevent that.** The log rule above would simply
  never be reached for any request `rules[0]` blocks. It is not merely additive-but-harmless;
  for the traffic that matters it is dead code.
- Nothing can be placed before index 0 while `ignore_changes` pins it there, and re-ordering
  the resource would point `ignore_changes = [rules[0]]` at the wrong rule and set Terraform
  fighting the dashboard.

**So exactly one step is genuinely blocked on dashboard access: narrowing `rules[0]`'s scope to
exclude `mcp.thenational.academy`** (or bringing that deployment under Terraform by importing
it and dropping the `ignore_changes` fence, which is the durable cure and a larger change).
Until that happens, **the window measures one of two rulesets and would produce a false
all-clear** — S2's §7.3 conclusion, which stands, for a reason one step more precise than it
gave.

**The tempting wrong answer, named so nobody adopts it by accident.** A custom rule with
`action = "skip"`, `phases = ["http_request_firewall_managed"]`, `products = ["waf"]` scoped to
the MCP host would stop the blocking from Terraform alone — the repository's
`firewall_rules.tf` already contains **fourteen** skip rules of exactly that shape, and
Cloudflare's documented phase order is `http_request_firewall_custom` →  `http_ratelimit` →
`http_request_firewall_managed`, so a custom-phase skip does reach the managed phase. **Do not
do it.** A skip means the ruleset is never evaluated, so it produces **no false-positive
evidence at all**: the window would end knowing nothing about the ruleset it was convened to
observe, while real signature-based protection was switched off meanwhile. It converts an
unknown into an unmeasured unknown, and it is the skip-rule pattern the `#551` reviewers
already rejected. The dashboard re-scope is a prerequisite, not a preference.

---

## 4. How the log-only fortnight is measured rather than waited out

A log-only window that only waits produces the same decision two weeks later with less time
left. The cure is three things: a gate that must pass before the clock starts, a control probe
that proves the instrument works, and a named list of requests somebody actually makes. The
owner is away for most of the window, so every step below names what to look at and what a pass
and a fail look like.

### 4.1 Day 0 gate — the window has not started until all four pass

| # | Prerequisite | How you know it passed |
| --- | --- | --- |
| G1 | **Both** managed rulesets scoped to the MCP host with `action = log`, and `rules[0]` re-scoped to exclude that host (§3.3) | The applied plan shows the two host-scoped execute rules; a dashboard read shows `rules[0]`'s scope is no longer "All incoming requests" |
| G2 | **`Cloud-Config#561` merged** so the apply cannot re-create the `www` front door (§1.3) | `#561` `merged: true`, and the plan for this change shows no `http_request_origin` or cache-settings additions |
| G3 | **The logging instrument is unsampled and attributing**, via a `firewall_events` Logpush job alongside the existing `http_requests` job | §4.2's control probe returns a record with a rule ID |
| G4 | **A named human owns the window** — reads the numbers weekly, holds the Day 14 decision, and owns the rollback | Written down, with a name |

Any of these failing means the clock has not started. **G1 is the one that silently fails**: a
window that scopes only OWASP will report zero false positives from the ruleset that is
probably doing the blocking.

### 4.2 The control probe — the step that makes a zero mean something

**A zero from an unvalidated query is not evidence.** Before counting anything, prove the
pipeline end to end:

1. Send one request to `mcp.thenational.academy` that **must** match a known rule. The cheapest
   is the OWASP tautology-plus-comment form S2 established as deterministic and reproducible
   (`p1` / `r2` in that report's §3.2 and §3.6), which reproduced on two attempts with
   different ray IDs. Record the `cf-ray` from the response.
2. Query the log for that exact ray ID. **It must come back**, carrying a rule ID and
   `SecurityAction` (or, if the legacy field names are what this zone actually populates,
   `WAFAction`) equal to **`log`**.
3. If it does not come back, the instrument is broken and nothing measured during the window
   means anything. Fix it and restart the clock.
4. If it comes back with an action of **`block`** rather than `log`, **something is still
   enforcing on this host** — an unscoped managed ruleset, a custom rule, or an
   account-level ruleset a zone-level change cannot reach. That is a G1 failure, discovered.

**Repeat this probe weekly**, not only at Day 0. An instrument that silently stops populating
mid-window is indistinguishable from a quiet fortnight.

Two known instrument defects, inherited from S2 §8.1 and unresolved:

- **The existing `http_requests` Logpush job samples at 30%.** On a low-volume pre-launch
  surface a handful of genuine false positives can sample to zero. `sample_rate` must be `1.0`
  for this window.
- **The job's field names (`WAFAction`, `WAFRuleID`, `FirewallMatches*`) do not appear in
  Cloudflare's current `http_requests` field reference**, which names `SecurityAction`,
  `SecurityRuleID`, `SecurityRuleDescription` and the `Security*` arrays. If the legacy names
  arrive empty, Oak's WAF logging has been blind for as long as the job has run. **This is one
  Datadog query and it is the cheapest high-value check in this document.**

### 4.3 What to count, and against what denominator

For every request where the host is the MCP host:

| Quantity | Why |
| --- | --- |
| Total MCP requests | The denominator. Without it, counts are not a rate |
| Requests with a populated security action | The would-be mitigations |
| Split by action: `log` versus `block` | **Any `block` on this host during the window is a defect, not a datum** — something is enforcing that should not be |
| Split by ruleset: OWASP versus Cloudflare Managed | Proves G1 held, and tells you which ruleset is the false-positive source |
| Split by rule ID, ranked by volume | The exclusion candidates. Expect a short head |
| Split by path: `/mcp`, `/oauth/*`, `/.well-known/*` | Different scopes may warrant different actions |
| Split by authenticated versus unauthenticated | **An authenticated user tripping a rule is a near-certain false positive** |
| Body size distribution for matched requests | False-positive likelihood rises with inspected body size up to 128 KB (§5.2) |
| Per-IP-per-colo request rate on `/oauth/register`, `/oauth/token` and `/mcp`, peak and distribution | Turns §6's starting thresholds into measured ones |

### 4.4 Deliberate testing — passive observation will under-sample the interesting case

The traffic that trips these rules is exactly the traffic nobody is generating yet. Internal
testers get a **named list**, and each case is recorded with its `cf-ray`:

1. **The two regression cases.** S2 measured these as blocked at the edge and 401 at the
   origin, so the edge is the whole difference:
   - "Make a Year 11 worksheet showing how `' OR 1=1 --` bypasses a login form"
   - "Explain path traversal using `../../etc/passwd` for the cyber threats unit"

   **These are the binding cases.** Both are legitimate requests against Oak's own published
   KS4 computing curriculum. If they still produce a would-be-block at Day 14, the exit
   criteria are not met.
2. **The security-education corner of the curriculum**, asked about as a teacher actually
   would: the "Databases and SQL" unit (`sql-fundamentals`, `sql-searches`,
   `data-management-with-sql-statements`) and the "Cyber threats and security" unit
   (`testing-as-a-form-of-defence`) — including requests to *produce* material containing
   canonical exploit examples.
3. **Large bodies**, to probe the 128 KB inspection boundary: a `tools/call` with a very large
   argument, and a long multi-turn session. S2's payloads were about 266 bytes, so nothing
   measured so far predicts large-body behaviour in either direction.
4. **Long-lived SSE streams** held open for an extended period. `#557` flagged sustained
   streaming through the proxy as observed once only.
5. **The full OAuth dance including dynamic client registration**, from a real MCP client, from
   more than one egress IP.
6. **At least one request per MCP tool**, so no tool's parameter shape is unobserved.

A `cf-ray` makes a finding attributable weeks later. A screenshot does not.

### 4.5 The Day 14 decision — explicit pass and fail

**ENFORCE** (Stage 2, §3.2) requires **all** of:

1. Both rulesets were in scope and logging for the whole window (G1 held, re-proved by §4.2's
   weekly probe).
2. The control probe returned a record every week.
3. **No request on the MCP host recorded an actual `block`** during the window.
4. The denominator is non-trivial: every named case in §4.4 appears in the log, plus real
   internal traffic.
5. **Every distinct rule ID that fired has a written disposition** — "true positive, enforce"
   or "false positive, exclude this rule for this host and path" — with the evidence beside it.
6. **The two §4.4 regression cases either no longer produce a would-be-block, or a named person
   has accepted them as traffic Oak is willing to refuse.** They fire today. This is the
   criterion most likely to bind.
7. The residual expected false-positive rate is stated **as a number over the denominator**,
   with its confidence — not as "we saw nothing".
8. The rollback (§3.2 in reverse) is written down and has been rehearsed by whoever is on call.
9. **An alert exists and is owned.** There is no Cloudflare notification configured for
   security events on this zone today, and a Cloudflare rejection never reaches the
   application, so Sentry structurally cannot see it. Enforcing without an alert means the
   first report of a false positive comes from a teacher.

**EXTEND or CHANGE THE CONFIGURATION** if any of the following, and the calendar does not
overrule it:

- Mitigations appear that nobody can attribute to a rule ID. The instrument failed; the window
  re-runs.
- Only one ruleset was scoped.
- Any named test case never appears in the log.
- An actual `block` was recorded on the host.

**The falsifier for this whole plan:** if at Day 14 the logs show mitigations on the MCP host
that cannot be attributed to a rule ID, the window measured nothing and must be re-run — not
concluded optimistically.

### 4.6 Two time-boxes worth knowing

- **Attribution of S2's five captured ray IDs expires around 2026-09-20** — Enterprise Security
  Events retention is 30 days from the 2026-08-21 capture. After that the §4.4 payloads must be
  re-run to re-capture. This is the highest-value item that decays.
- **Security Events is sampled** and is the right instrument for attributing one ray ID, the
  wrong one for counting across a fortnight. Logpush is the primary counting instrument;
  `firewallEventsAdaptive` via the GraphQL Analytics API is the fallback.

---

## 5. The false-positive design

### 5.1 Which rule categories are the sources

| Source | Mechanism | Evidence it is implicated |
| --- | --- | --- |
| **Cloudflare Managed Ruleset** (`rules[0]`, invisible to the repository) | **Signature-based** — one rule match acts, no score accumulation. Rules carry individual default actions, mostly `block` | **Inferred, and the stronger of the two.** S2 measured block-shaped 403s with **no `cf-mitigated` header**, which points away from OWASP's declared `managed_challenge`. Independently: Cloudflare's own 2025-12-05 payload-limit rollback names this ruleset **first** among the two whose false positives forced the reversal |
| **Cloudflare OWASP Core Ruleset** | Accumulates an anomaly score across matching rules; acts only past the threshold | Named second in the same rollback. Cloudflare's own documentation says it *"is prone to false positives and offers only marginal benefits when added on top of Cloudflare Managed Ruleset"* |
| **Zone-wide custom rules** in `http_request_firewall_custom` | Plain expression matches, `action = "block"`, no host scope | **Measured.** `"Block SQL requests"` (`http.request.full_uri contains ".sql"`) fires on the MCP host — it is the control probe that proved the host sits inside Oak's own custom ruleset |

**The categories to expect at rule level**, from what actually reproduces (§5.3): SQL injection,
command injection or RCE, and path traversal or local file inclusion. Cross-site scripting is
notably **not** among them — the XSS payload passed at the edge.

**Cloudflare's own assessment of OWASP Core bears on a decision nobody has framed yet:**
whether OWASP Core should run on the MCP scope at all, as against relying on the Cloudflare
Managed Ruleset plus WAF attack score. I am not deciding it, and it should not be decided before
the window attributes the blocks — if the Managed Ruleset is the actor, dropping OWASP buys
nothing.

### 5.2 How request-body inspection on `/mcp` is bounded

MCP carries everything in a JSON-RPC POST body, so body inspection is the entire game. The
honest answer to "can we bound it" is: **the size is fixed and cannot be narrowed; what can be
scoped is which rules run against the body.**

- **The WAF inspects at most 128 KB of a request body on Enterprise.** The origin still
  receives the whole body; only *matching* is bounded.
- **False-positive likelihood is not uniform in body size.** More inspected content means more
  rules can match and, for OWASP, a higher cumulative score. Cloudflare's own reason for
  rolling the limit back from 1 MB was the false-positive surge that followed. So a large
  `tools/call` body is the highest-risk shape, up to 128 KB — and content beyond 128 KB is not
  inspected at all, which is simultaneously a detection gap and a false-positive escape hatch.
- **A small-body test does not predict large-body behaviour in either direction.** Hence §4.4
  case 3.
- **There is no switch to disable or reduce body inspection for specific traffic.** The levers
  are a WAF **exception** scoped by expression (host plus path) skipping **named rules**, or
  asking Support to change the limit — and the only available direction there is *upward*,
  which makes false positives worse. So "limit request-body inspection on `/mcp`" is not
  something Cloudflare exposes; the nearest true equivalent is the scoped exception.
- `http.request.body.truncated` is available as a rule field, so "was this body only partially
  inspected?" is answerable and can be branched on.

**On exceptions, for Stage 2.** Use the narrowest granularity: skip **named rules** within a
ruleset for host-plus-path, never a whole ruleset and never all managed rules. Two constraints:
zone-level exceptions cannot suppress **account-level** rulesets, which Cloudflare documents as
evaluated before zone-level rules in the same phase — so if any of Oak's managed rules turn out to be account-scoped, the exception must be
authored at the account level; and exceptions apply only to WAF managed rulesets, so the custom
rules in §5.4 are not reachable by one.

**Nothing is excluded before it is measured.** No exclusion lands in Stage 1. §4 earns them.

### 5.3 The honest scope of the problem — carried verbatim, because the compressed version is wrong

The compressed claim "the WAF blocks our curriculum" is **not** what was measured. What was
measured, from S2's report §3.5 and §3.6:

- **Plain SQL passes.** `SELECT name FROM pupils`, `SELECT name FROM pupils WHERE year = 7`,
  and even `SELECT * FROM users WHERE 1=1 --` and `UNION ALL SELECT password FROM admin`
  all returned 401, meaning they reached the application.
- **`<script>` passes.** The XSS lesson payload `<script>alert(document.cookie)</script>` with
  `<img src=x onerror=...>` returned 401 at the edge.
- **What trips it** is the **canonical tautology-plus-comment exploit form** (`' OR 1=1 --`)
  and, separately, **traversal and command-injection metacharacter clusters**
  (`../../etc/passwd`, `; cat /etc/passwd`, `` `id` ``, `php://filter/...`).
- **Oak's STORED lesson content does not trip it.** The `testing-as-a-form-of-defence`
  transcript (17,523 characters) describes SQL injection **in prose** and contains no exploit
  metacharacters at all — no `OR 1=1`, no `--`, no `' OR`, no `UNION`, no `DROP`, no `;`, not
  even `SELECT`. The `sql-searches` exit quiz contains `SELECT *`, `SELECT * FROM table`,
  `JOIN` and `DELETE`, all of which pass. So relaying Oak's stored curriculum content back
  through a request body would not trip this.
- **The exposure is user- and agent-authored request text.** A teacher asking for a worksheet
  that includes the canonical payload; an agent constructing a security exercise; a
  pupil-facing example generator. That is narrower than "the WAF blocks our curriculum", more
  precisely locatable, and it lands exactly on the security-education corner of the
  curriculum — the lessons *about* attacks.

**Narrower is not ignorable.** It fails precisely the requests most worth serving, it fails
them invisibly to the application (a Cloudflare rejection never reaches Sentry), and the
failing user is a teacher who did nothing wrong.

### 5.4 Companion change — bring the zone-wide custom rules into the window

`#558` touches only the managed phase. The custom rules keep enforcing throughout, so any
request they block during the window is a false positive the window cannot see, and it
contaminates §4.5 criterion 3.

`"Block SQL requests"` in `firewall_rules.tf` is zone-wide with no host scope, no `phases` and
no `products`, and **measured firing on the MCP host**. Its exposure there is narrow — MCP
carries parameters in the POST body, not the URI — but it is real for any `/mcp` request with a
query string, and it is enforcing unobserved.

Bring it into the window rather than either leaving it or weakening it: scope the block rule
away from the MCP host and add a paired log rule for that host, so detection is **observed
rather than lost**.

```hcl
    {
      description = "Block SQL requests"
      action      = "block"
      expression  = "(http.request.full_uri contains \".sql\") and not (http.host eq \"mcp.thenational.academy\")"
    },
    {
      # Paired with the rule above so the MCP surface is OBSERVED rather than
      # silently enforced during the MCP-622 measurement window. Restore the
      # single zone-wide rule, or promote this one to "block", once the window
      # has a disposition for it. "log" is non-terminating and Enterprise-only.
      description = "Block SQL requests -- MCP surface, log-only observation window (MCP-622)"
      action      = "log"
      expression  = "(http.request.full_uri contains \".sql\") and (http.host eq \"mcp.thenational.academy\")"
    },
```

**One hazard this companion change introduces, and its cure.** The
`http_request_firewall_custom` resource builds its rules from `local.firewall_rules` through a
dynamic block that emits `logging { enabled = true }` for **every action that is not
`block`**:

```hcl
      dynamic "logging" {
        for_each = rules.value.action != "block" ? { log = true } : {}
```

Provider v4.29.0 documents `logging` as **"Only valid for skip action"**, so a rule with
`action = "log"` would acquire a `logging` block the API may reject. Every existing non-block
rule in that list is a `skip`, so the condition has never been exercised otherwise. The cure is
one line, and it should land with the rule above rather than after a failed plan:

```hcl
      dynamic "logging" {
        for_each = rules.value.action == "skip" ? { log = true } : {}
```

`"JavaScript Client Side Prototype Pollution Block"` has the same shape as the SQL rule and the
same treatment applies if the window shows it firing.

**A second ordering fact that bears on this.** Custom rules run in the
`http_request_firewall_custom` phase, which Cloudflare evaluates **before** both
`http_ratelimit` and `http_request_firewall_managed`. So a custom-rule `block` on the MCP host
pre-empts everything in §3 and §6 — which is exactly why leaving it enforcing through the
window contaminates the evidence.

**This is separable.** It is a different file with different owners, and it is not required for
§3 to be correct — but leaving it out means criterion 3 of §4.5 will show blocks and nobody
will know whether they matter.

---

## 6. The IP-keyed rate-limit rules on `/oauth/register` and `/oauth/token`

### 6.1 Why these, and why now

**Measured on `Cloud-Config@main`:** `rate_limits.tf` contains exactly two rules — a downloads
API limit and a curriculum search API limit — and **neither matches `mcp.thenational.academy`,
`www.thenational.academy/mcp`, or any `/oauth/*` path.** There is no rate limiting of any kind
on the MCP surface at the edge.

ADR-219 moved rate limiting out of the application on the basis that the edge owns it, and
MCP-411 removed the in-process limiter. **ADR-219 names this exact condition as its own
falsifier.** The CodeQL `js/missing-rate-limiting` dismissals on the public OAuth endpoints
currently rest on a warrant that holds on neither limb.

**The concrete abuse case, and it is specific to `/oauth/register`.** Dynamic client
registration means unauthenticated clients hit that endpoint legitimately — a conformant MCP
client registers once and persists its `client_id`. S2 measured that `POST /oauth/register`
with `{}` returns a Go struct-validation error, i.e. the endpoint proxies to Clerk, so **an
unauthenticated caller writes a persistent OAuth client record into Oak's Clerk instance.**
Unauthenticated, unthrottled, with a durable side effect in a third-party system that has its
own quotas.

**The warrant is ADR-219 plus that abuse case — not the two sources the owner named.** Neither
the MCP specification nor Cloudflare's MCP guide requires rate limiting: the specification
mentions it once, as a control that token passthrough *bypasses*, and Cloudflare's guide does
not mention it at all. ADR-219 is Oak's own accepted decision and is sufficient on its own.

### 6.2 What legitimate traffic looks like, so the thresholds are not guesswork

- **`/oauth/register` is once per client install, not once per session.** Per-IP legitimate
  volume is therefore very low — order one registration per new client installation.
- **The floor is set by shared egress, not by single users.** A school, a corporate NAT, or a
  hosted agent platform presents many users behind one IP. A hosted MCP client onboarding
  several Oak users in a short window shares an IP, and that burst is entirely legitimate. This
  is the case a tight limit breaks, and it breaks it at first contact — the worst possible
  moment, and invisible to Oak.
- **`/oauth/token` is higher-volume by design**, because refresh-token exchanges recur for the
  life of a session. Its legitimate ceiling is meaningfully above registration's, so **it must
  not share a counter.**
- **Retries inflate both**, and a broken client retries hard.
- **`cf.colo.id` is mandatory as a characteristic on every plan**, so counting is always
  per-data-centre. Any real client's rate is divided across points of presence, which is a
  further reason the numbers below are generous rather than tight.
- **Counters update with a delay of up to a few seconds**, so excess requests can still reach
  the origin before mitigation applies. An edge rate limit is a volumetric bound, never an
  exact gate.

### 6.3 Stage 1 HCL — observation window

Appended to `resource "cloudflare_ruleset" "http_ratelimit"` in
`infrastructure/cloudflare/rulesets/rate_limits.tf`. **No `action_parameters` at this stage:
a custom response is valid only on the `block` action.**

```hcl
  # Dynamic client registration is UNAUTHENTICATED and writes durable state into
  # Oak's Clerk instance, so it is the one MCP endpoint where an unthrottled
  # caller leaves a persistent side effect in a third-party system. ADR-219
  # assigns this control to the edge; the edge does not currently carry it.
  #
  # A long period with a generous count tolerates the legitimate burst -- a
  # school or a hosted agent platform onboarding several users from one egress
  # IP -- while bounding sustained automated registration. The long mitigation
  # timeout is deliberate here and NOT on the token rule below: the side effect
  # is durable, so a breach should be expensive.
  #
  # action = "log" for the observation window, "block" with a 429 at Stage 2.
  # NEVER a challenge: a non-browser MCP client cannot solve one.
  rules {
    action = "log"
    ratelimit {
      characteristics = [
        "cf.colo.id",
        "ip.src",
      ]
      period              = 600
      requests_per_period = 50
      mitigation_timeout  = 600
    }

    expression  = "(http.host eq \"mcp.thenational.academy\" and http.request.uri.path eq \"/oauth/register\")"
    description = "MCP dynamic client registration limit (MCP-622)"
    enabled     = true
  }

  # Token exchange recurs for the life of a session (authorisation code, then
  # refresh), so the legitimate ceiling is well above registration's and it must
  # not share a counter. The SHORT mitigation timeout is deliberate: a
  # legitimate overshoot self-heals in a minute rather than locking a school out
  # of live sessions for ten.
  rules {
    action = "log"
    ratelimit {
      characteristics = [
        "cf.colo.id",
        "ip.src",
      ]
      period              = 60
      requests_per_period = 120
      mitigation_timeout  = 60
    }

    expression  = "(http.host eq \"mcp.thenational.academy\" and http.request.uri.path eq \"/oauth/token\")"
    description = "MCP token endpoint limit (MCP-622)"
    enabled     = true
  }
```

### 6.4 Stage 2 HCL — enforcement

`action` becomes `block`, and **only now** does the custom response become valid. **429, not
403**: it is the status a well-behaved protocol client knows to back off on, it is within the
documented 400–499 range, and ADR-219 records that this server no longer emits 429 of its own,
so a 429 is unambiguously attributable to the edge.

```hcl
  rules {
    action = "block"
    action_parameters {
      response {
        status_code  = 429
        content      = "{\"error\":\"rate_limited\",\"error_description\":\"Too many registration requests. Retry later.\"}"
        content_type = "application/json"
      }
    }
    ratelimit {
      characteristics = [
        "cf.colo.id",
        "ip.src",
      ]
      period              = 600
      requests_per_period = 50
      mitigation_timeout  = 600
    }

    expression  = "(http.host eq \"mcp.thenational.academy\" and http.request.uri.path eq \"/oauth/register\")"
    description = "MCP dynamic client registration limit (MCP-622)"
    enabled     = true
  }

  rules {
    action = "block"
    action_parameters {
      response {
        status_code  = 429
        content      = "{\"error\":\"rate_limited\",\"error_description\":\"Too many token requests. Retry later.\"}"
        content_type = "application/json"
      }
    }
    ratelimit {
      characteristics = [
        "cf.colo.id",
        "ip.src",
      ]
      period              = 60
      requests_per_period = 120
      mitigation_timeout  = 60
    }

    expression  = "(http.host eq \"mcp.thenational.academy\" and http.request.uri.path eq \"/oauth/token\")"
    description = "MCP token endpoint limit (MCP-622)"
    enabled     = true
  }
```

**[verify at plan time]** `log` is a documented action for rate-limiting rules and is
Enterprise-only. If the API rejects it in the `http_ratelimit` phase for this account, that is
a finding to route back — **not** a reason to skip the observation stage and go straight to
`block`.

### 6.5 Two corrections to Seat S2's rate-limit proposal

**Correction 1 — do not use a failure-only counting expression on `/oauth/register`.** S2
recommends `counting_expression` restricted to `http.response.code ge 400`, so that "a
legitimate burst of genuine client installs never accumulates toward the limit". **That
inverts the control.** The harm S2 itself identified is the *successful* registration — each
one writes a durable client record into Clerk. Counting only failures would let an attacker
create unlimited client records at full speed while the counter stayed at zero. Count **all**
requests. The generous period-and-count above is the right way to tolerate legitimate bursts.

**Correction 2 — the Stage 1 HCL cannot carry a `response` block.** S2's proposed rules set
`action = "log"` while also declaring `action_parameters { response { ... } }`. A custom
response is documented as available **only** for the `block` action, so at best it is inert and
at worst the API rejects it. Hence the two-stage HCL above.

**On `cf.unique_visitor_id`.** It is documented as "IP with NAT support" and would give users
behind one school NAT separate counters, which is exactly the failure mode §6.2 worries about.
It **cannot be combined with `ip.src`**, and its NAT disambiguation relies on client-side
signals a non-browser MCP client may not present, in which case it degrades toward per-IP
behaviour. **Verdict: not in the first pass.** It is a thing to test during the window, not a
substitute for a generous threshold.

### 6.6 `/mcp` itself — deliberately no number

The protocol endpoint needs a volumetric bound and the edge is currently the only layer, so its
absence is the whole control. But unlike the OAuth endpoints, whose legitimate profile is
derivable from the protocol, `/mcp`'s profile depends on agent behaviour nobody has measured.
Requests are also not uniform in cost — a `tools/call` that fans out to the curriculum API is
far more expensive than an `initialize` — and a legitimate agent session is bursty.

**So: no number here.** §4.3 collects the requests-per-IP-per-colo distribution for real
sessions; the threshold is set from its tail, with a long period and a proportionally high
count so bursts survive. Proposing a number before that measurement is the guesswork the owner
asked to avoid.

If Oak's contract includes **Advanced Rate Limiting** (an Enterprise add-on, and not
determinable from outside), a limit can key on `lookup_json_string(http.request.body.raw,
"method")` — so `tools/call` can carry a different budget from `initialize`. That is the most
fitting mechanism for this surface and is worth checking. Per-user keying on authenticated
identity is better still and is already tracked as MCP-593; nothing here pre-empts it, and an
IP-keyed edge limit is the floor that should exist regardless.

---

## 7. The two residuals

Both are **stated residuals, not tasks**. Neither is closed by anything in this document, and
saying so is the difference between this reading as a complete solution and reading honestly.

### 7.1 Residual 1 — the Cloudflare Managed Ruleset

**What it is.** A second managed ruleset acts on this host, signature-based rather than
score-based, deployed from the dashboard at scope "All incoming requests", and **invisible to
`Cloud-Config`** behind `lifecycle { ignore_changes = [rules[0]] }`.

**What I established (§3.3).** Its documented ruleset ID is
`efb7b8c949ac4650a09736fc376e9aee`; a **ruleset-level** `overrides { action = "log" }` sets one
action for all its rules with **no rule IDs required**, so the log-only override **can** be
authored from Terraform today — correcting S2's conclusion that it could not be written blind.
Two independent lines point at it as the actor on the measured blocks: the absence of
`cf-mitigated` on S2's 403s, and Cloudflare's own 2025-12-05 payload-limit rollback, which
names this ruleset first among the two whose false positives forced the reversal.

**What still needs dashboard access, and it is one thing.** `rules[0]` executes **first** in
the phase, with terminating default actions, so no rule added later can prevent it. Its scope
must be narrowed to exclude `mcp.thenational.academy` — or the deployment imported and the
`ignore_changes` fence dropped. **Until then, even at log-only on the OWASP score rule, the
signature ruleset can still block, and a recommendation that changed only the score action and
declared the curriculum problem solved would be wrong.**

**What would close it.** Either the dashboard re-scope (minutes, and the Day 0 G1 gate) or
bringing `rules[0]` under Terraform (larger, durable, and the right long-term answer). Plus
S2's ray-ID attribution, which tells you which of its rules fire and expires around
2026-09-20.

### 7.2 Residual 2 — the alpha bypass

**What it is.** `curriculum-mcp-alpha.oaknational.dev` is in a **different zone**, is a
**production domain of the production Vercel project**, and is **not behind Cloudflare** —
S2's `dig` shows a CNAME to `...vercel-dns-013.com` with Vercel A records, and the `.sql`
control probe returned 404 there rather than 403. It serves the full MCP application and
answers the protocol. PR 931 measured an **XSS-shaped path reaching the application there that
the WAF blocks on `mcp.*`**.

**Therefore every rule in this document is bypassable through it.** A ruleset on
`mcp.thenational.academy` bounds traffic that chooses to go through `mcp.thenational.academy`.
Two independent seats reached this from opposite directions — S2 from request bodies at the
edge, S1 from a path on the alpha host — without reading each other's work.

A detail worth recording: until `#561`, that host was the **declared origin** of the `www` MCP
route (§1.3), so it is structurally load-bearing in the topology, not an incidental leftover.

**The owner has ruled not to touch that endpoint, so this is not a task.** It is a residual that
must be stated wherever the coverage of these rules is described, because otherwise "the MCP
surface is protected at the edge" reads as true and is not.

**What would close it.** Proxying the host through Oak's zone, or an origin lock — Cloudflare
Authenticated Origin Pull, a Vercel deployment-protection or trusted-IP configuration, or a
shared secret header enforced at the origin. ADR-219 already names "an origin lock" as cure
vocabulary. The choice is the coupled ADR-219 / MCP-349 owner decision and is not mine.

**A third, smaller residual, named for completeness.** `revocation_endpoint` is
`https://clerk.thenational.academy/oauth/token/revoke`, and that host CNAMEs out of Oak's zone
to a Clerk-operated worker. No rule in `Cloud-Config` can rate-limit, log, or protect it, and
it will never appear in Oak's Security Events. Any statement of the form "the OAuth surface is
rate-limited at the edge" is false for that endpoint.

---

## 8. What I did not do, and what needs an instrument I do not have

| Not done | Why |
| --- | --- |
| Any change in `oaknational/Cloud-Config` | Read-only fence. No push, no rebase, no comment, no PR, no branch switch, no local checkout entered |
| `terraform plan` or `apply` | Out of brief, and the plan requires workspace rights plus the drift decision in §1.3 |
| Re-firing S2's exploit-shaped payloads at production | Already measured with controls. Re-firing adds nothing and generates load. My own live probes were benign GETs (§1.2) |
| Attributing the measured 403s to specific rule IDs | Requires Security Events. S2 holds five ray IDs; expires around 2026-09-20 |
| Reading `rules[0]`'s rules, or checking for a dashboard managed-rules **exception** | Requires dashboard access. The `claude.ai Cloudflare` connector needs an interactive OAuth authorisation the owner performs; I did not start that flow |
| Confirming whether Oak's Logpush job populates its WAF fields | Requires Datadog. §4.2's second defect, and the cheapest high-value check outstanding |
| Whether Oak's contract includes Advanced Rate Limiting | A contract fact, not observable from outside |
| Load-testing the proposed thresholds | Would create real Clerk client records and constitutes load generation against a live service. The numbers come from §4.3, not from synthetic load |
| Served-surface headers, CSP, application code | S1's boundary |

**On `cf-ray`.** A `cf-ray` proves Cloudflare fronts something, not that it is Oak's
Cloudflare. The discriminator is the CNAME chain, and it separates these hosts cleanly:
`clerk.thenational.academy` presents Cloudflare headers and leaves Oak's zone;
`curriculum-mcp-alpha.oaknational.dev` is Vercel. Every claim above about what Oak's rules
cover rests on the `dig` chain, not on a header.

---

## 9. The recommendation in one place

1. **Amend `Cloud-Config#558`**: `action = "log"` and `score_threshold = 60` on the
   MCP-scoped OWASP rule (§3.1). Keep everything else it does. **Do not merge it as written.**
2. **Keep the zone-wide exclusion**, and correct its comment: under a non-terminating `log`
   action it is the safeguard, not an optimisation (§2.3).
3. **Widen to the Cloudflare Managed Ruleset** with a ruleset-level log override (§3.3), and
   treat the dashboard re-scope of `rules[0]` as a hard prerequisite. Do **not** reach for a
   skip rule.
4. **Merge `#561` before or with the apply**, or the apply re-creates the `www` front door
   (§1.3). Reconcile the `http_ratelimit` / `http_request_firewall_custom` drift as a separate
   prior change.
5. **Add the two rate-limit rules** on `/oauth/register` and `/oauth/token`, `log` then `block`
   with a 429 (§6.3, §6.4). Count all requests, not just failures.
6. **Run §4 as written**: the Day 0 gate, the weekly control probe, the named test list, and
   the Day 14 decision rule. **Enforce only when the exit criteria are met, not when the
   calendar says so.**
7. **State the two residuals** wherever this coverage is described (§7).

**The one-line summary.** The edge currently does the opposite of what is wanted in both
directions: it blocks legitimate curriculum traffic it should pass, and it applies no
volumetric limit to unauthenticated endpoints it should bound. `#558` amended as above fixes
the first for the duration of a measured window and then enforces on evidence; §6 fixes the
second. Neither is complete while the signature ruleset is unscoped and the alpha host is
reachable.

---

*Written by Seat S3, an AI agent, under PDR-117, and reported to the Director rather than
directly to the owner. Every vendor fact in §2.4 was read live from Cloudflare's documentation
on 2026-08-21. Every configuration claim names its ref. **Nothing in this document has been
applied, and nothing in `oaknational/Cloud-Config` was modified.***
