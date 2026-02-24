# Reducing failures in agentic / AI-augmented software engineering

*A setup-agnostic engineering report: approaches, processes, mechanisms, and open code — with “hallucination guards” as a headline.*

## Executive summary

Agentic coding fails in repeatable ways: the model **hallucinates repo state**, follows **prompt-injected instructions** hidden in untrusted text, performs **unsafe actions with ambient privileges**, and “sounds correct” without **evidence** or **tests**. The most reliable mitigation strategy is to treat the model as an **untrusted, fallible process** and surround it with: (1) **hallucination guards**, (2) **evidence gating**, (3) **least-privilege tools**, (4) **sandboxed execution**, (5) **continuous red-teaming**, and (6) **trace-based evaluation**.

This report focuses on mechanisms that work across IDE/CLI/CI setups.

---

## 1) Hallucination guards (headline)

Hallucination guards are controls that prevent “confidently wrong” statements from becoming actions or merged code. In software engineering contexts, hallucinations typically manifest as:

- claiming tests passed without running them
- asserting an API exists / signature is different
- fabricating files, functions, config, or tool outputs
- misreading logs, stack traces, or large diffs

### 1.1 Evidence-grounded hallucination detection (claim → cite → verify)

**Mechanism**

1) Force the agent to write outputs as **claims** that cite **evidence spans** (file snippets, logs, test output).
2) Run a verifier that checks whether each claim is supported by the cited spans.
3) Block “ship” actions (merge, deploy, publish) if unsupported.

**Open code to use**

- **Strawberry** provides `detect_hallucination` (sentence/claim support checks) and `audit_trace_budget` (structured step audit). It is designed explicitly as a verification layer for agentic systems.  
- **Berry** wraps this into an MCP toolpack and adds an “evidence notebook” (file spans, search, distill), enabling consistent use from many agent clients.

**Operational pattern**

- Require agents to attach spans for: “tests pass”, “perf improved”, “migration safe”, “security boundary unchanged”.
- Fail CI if unsupported claims exceed a threshold.
- Store spans + audit outputs as build artifacts.

### 1.2 “Hallucination triad” evals for RAG/tool workflows

**Mechanism**
Evaluate three properties continuously:

- **Groundedness**: output supported by provided context
- **Context relevance**: retrieved/selected context is relevant
- **Answer relevance**: answer addresses the question/task

**Open code to use**

- **TruLens** implements this “triad” style evaluation and traces executions so you can score agent runs.
- **Ragas** provides “faithfulness” (hallucination vs context) and other evaluation metrics, and supports using small classifier models for hallucination detection (e.g., HHEM-2.1-Open).

**Operational pattern**

- Run nightly (or PR-time) evaluations on a fixed suite of engineering tasks:
  - “does this refactor preserve behavior?”
  - “does the agent correctly update call sites after API change?”
  - “does it claim tests pass only when they do?”

### 1.3 Output validation as guardrails (structure + constraints + self-checks)

**Mechanism**

- Validate outputs as structured data (schemas) plus policy checks (no secrets, no dangerous commands, no unsupported claims).
- Add “self-check” rails: the model must justify a claim using provided sources, and the system rejects outputs that fail checks.

**Open code to use**

- **NeMo Guardrails**: programmable rails for self-checking and vulnerability protection.
- **Guardrails AI**: input/output guards and validators.

**Operational pattern**

- Use guardrails for:
  - change summaries (“only mention changes that appear in diff”)
  - release notes (“no fabricated tickets/links”)
  - security boundaries (“no claim of mitigation without evidence”)

### 1.4 Practical hallucination-guard checklist (setup agnostic)

Adopt these as “definition of done” for agent output:

- ✅ cites evidence for every non-trivial claim
- ✅ includes exact commands run (and their captured output)
- ✅ includes tests/linters executed (with output)
- ✅ describes behavior changes in terms of observed traces, not intent
- ✅ no claims about files/paths not present in repo
- ✅ if uncertain: abstains and requests confirmation

---

## 2) Evidence gating (turn narrative into auditable artifacts)

Evidence gating makes the agent’s work **reproducible** and **inspectable**.

### 2.1 The “evidence notebook” model

**Mechanism**

- Maintain a run-scoped store of evidence “spans”:
  - file spans (path + line ranges)
  - terminal outputs (command + stdout/stderr)
  - web/doc/tool outputs

Agents must reference spans when:

- proposing a plan
- justifying a change
- claiming successful verification

**Open code to use**

- **Berry** offers run management + `add_file_span`, `search_spans`, `distill_span`, etc., and exposes them via MCP.

### 2.2 Audit structured reasoning (trace budgets)

**Mechanism**

- Represent decisions as a list of short steps, each with citations.
- Audit the reasoning steps before applying changes.

**Open code to use**

- **Strawberry** `audit_trace_budget` is directly built for validating a structured trace of claims with citations.

---

## 3) Prompt injection & “confused deputy” defenses

Prompt injection is not hypothetical in coding workflows: real incidents show injected instructions can cause unauthorized actions (like installing software) when agents have tool access.

### 3.1 Design principle: untrusted text is data, not instructions

**Mechanism**

- Treat PR descriptions, issues, docs, webpages, tool outputs, and logs as **untrusted**.
- Ensure the system can’t be tricked into executing actions because a tool output “says so”.

**System design rules**

- Never allow tool outputs to directly form executable commands without:
  - sanitization
  - explicit allowlists
  - user confirmation for privilege jumps

### 3.2 Continuous red teaming for injection

**Mechanism**

- Test your system with a distribution of attacks (different wrappers, encodings, positions, channels).
- Gate releases on red-team metrics.

**Open code to use**

- **promptfoo**: red-teaming and CI-friendly eval configs (including RAG-specific injection testing).
- **garak**: automated probing for injection, leakage, hallucination, jailbreak patterns.

**Operational pattern**

- Add a CI job that feeds malicious strings through each untrusted channel:
  - repo README, docs, issues, changelogs
  - tool outputs, test logs, stack traces
- Assert invariants:
  - never run installs
  - never modify CI secrets
  - never exfiltrate environment/config
  - never write outside the repo root

---

## 4) Least-privilege tool design (MCP as the choke point)

Tooling is where agentic systems become risky. The goal is to make tools capability-limited, explicit, and auditable.

### 4.1 Use narrow tools, not “shell with vibes”

**Mechanism**
Prefer tools like:

- `apply_patch(files, diff)`
- `run_tests(target)`
- `search_repo(query)`
over:
- unrestricted shell access
- unrestricted filesystem writes

### 4.2 Harden MCP servers

**Mechanism**

- Restrict file access to repo root
- Require explicit grants for sensitive actions (network, installs, secrets)
- Log every tool invocation and output

**Open code**

- **Berry** explicitly focuses on repo-scoped access and a safe toolpack via MCP.
- OpenAI’s MCP documentation describes how MCP servers connect models to tools (the governance layer should live here).

**Operational pattern**

- Run the agent with only MCP tools enabled; disable implicit filesystem/network unless required.
- Make “privilege escalation” explicit and reviewable.

---

## 5) Sandboxed execution (assume compromise and reduce blast radius)

Even with good prompt controls, the safest stance is: the agent will eventually be manipulated.

### 5.1 Default: ephemeral, isolated execution

**Mechanism**

- Run code/tests/commands in ephemeral sandboxes
- Mount repo read-only by default
- Block access to home directories, SSH keys, global git config, cloud creds
- Disable network by default; allowlist when needed

**Open code**

- **E2B**: open-source infrastructure + SDKs for isolated code sandboxes.

### 5.2 Safety invariant examples

- Agent cannot write outside `<workspace>`
- Agent cannot access secrets unless explicitly injected at runtime
- Agent cannot install global packages
- Agent cannot modify dotfiles/credential stores

---

## 6) Trace-based observability & evaluation (treat agent runs like production systems)

If you can’t observe agent behavior, you can’t govern it.

### 6.1 Trace everything: tool calls, diffs, tests, decisions

**Mechanism**

- Assign a run ID
- Record each step as a span
- Attach evaluation scores (hallucination, injection susceptibility, policy violations)

**Open code**

- **TruLens** (and similar stacks) provide instrumentation/tracing and evaluation hooks.
- Berry/Strawberry’s spans model can serve as your minimal, tool-agnostic trace layer.

### 6.2 Useful run-level metrics

- % claims with evidence

- # unsupported claims flagged by verifier

- # privileged operations attempted

- # filesystem boundary violations attempted

- injection test pass rate / risk score
- “did tests run?” boolean + artifact link

---

## 7) A setup-agnostic reference process (putting it together)

This is a practical workflow that works whether you’re using IDE agents, CLI agents, or CI agents:

1) **Scope & intent**
   - problem statement + deliverable criteria
   - constraints (no new deps, no schema changes, etc.)

2) **Plan as auditable steps**
   - each step is a short claim (“I will change X to achieve Y”) with pointers to evidence.

3) **Work in a sandbox**
   - agent edits and runs tests in isolated environment
   - outputs captured as spans

4) **Evidence-first PR narrative**
   - all claims cite spans: diff excerpts, commands, test logs

5) **Automated hallucination gate**
   - verifier checks citations/support for key claims

6) **Automated security gate**
   - injection suite (promptfoo/garak) verifies invariants

7) **Human review focuses on diffs + evidence**
   - reviewer doesn’t have to “trust the narration”

---

## 8) Recommended “starter kit” (all open source)

Choose components based on what you need; these are composable:

### Hallucination guards & evidence

- Berry + Strawberry verification tools (claims/spans/audits)

### Injection & abuse resistance

- promptfoo (red teaming in CI)
- garak (vulnerability scanning)

### Guardrails and policy checks

- NeMo Guardrails
- Guardrails AI

### Execution risk management

- E2B or equivalent sandboxing layer

### Evaluation & observability

- TruLens (tracing + groundedness/triad evals)
- Ragas (faithfulness / hallucination vs context metrics)

---

## 9) Practical adoption guidance (what to standardize as “policy”)

These are policy-level rules you can adopt across teams, independent of tool choices:

1) **No evidence → no merge** (for non-trivial claims)
2) **No tests run → no “tests pass”** (and the system must capture proof)
3) **Untrusted text never becomes authority**
4) **Least privilege always-on**
5) **Sandbox by default**
6) **Red team continuously**
7) **Trace everything; score runs; regressions block release**

---

## Appendix A — “Hallucination guard” patterns for SWE tasks

- **Diff-bound summaries**: generate release notes only from parsed diffs + changelog spans.
- **Test-first gating**: agent must run targeted tests (or explain why not) before proposing merges.
- **API-change safety**: require compile/typecheck evidence for any public interface changes.
- **Migration safety**: require dry-run logs + rollback plan as evidence spans.
- **Security claims**: require tool outputs (SAST, dependency audit, scan logs) as citations.
