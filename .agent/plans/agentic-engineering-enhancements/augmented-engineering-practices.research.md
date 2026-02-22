# **AI-Augmented Software Engineering: Best Practices & Working Patterns (Expanded)**

This report synthesises three foundational essays by Mark Ridley with broader industry research and emerging working patterns to provide a practical, “grown-up” guide to **shipping trustworthy software with AI in the loop**.

It is written for teams that want **more throughput without sacrificing maintainability, security, or operational confidence**.

---

## **Primary Sources (Ridley)**

- **How I build products, apps and features with Claude, ChatGPT and AI dev tools** – Mark Ridley (29 Jan 2026)  
  [ridley.co/articles/2026/01/29/how-i-build-products-apps-and-features-with-claude-chatgpt-and-ai-dev-tools](https://ridley.co/articles/2026/01/29/how-i-build-products-apps-and-features-with-claude-chatgpt-and-ai-dev-tools/)

- **Augmented Engineering for Grown-Ups** – Mark Ridley (19 Feb 2026)  
  [ridley.co/articles/2026/02/19/augmented-engineering-for-grown-ups](https://ridley.co/articles/2026/02/19/augmented-engineering-for-grown-ups/)

- **Implementing Augmented Engineering** – Mark Ridley (19 Feb 2026)  
  [ridley.co/articles/2026/02/19/implementing-augmented-engineering](https://ridley.co/articles/2026/02/19/implementing-augmented-engineering/)

---

## **Executive summary**

AI changes the economics of software creation: **generation is cheap; verification is expensive**. The winning strategy is not “better prompts” — it’s an engineering system that makes AI output *safe to integrate*.

Across Ridley and wider industry practice, the consistent pattern is:

1. **Intent first** (clear problem framing and written decisions)
2. **Plan before code** (tickets/tasks derived from a proposal)
3. **Never trust, always verify** (automation does most verification)
4. **Humans review risk & intent**, not every line
5. **Everything is traceable** (why, what, how, when, by whom/what)
6. **Security and supply chain controls are non-optional** in an AI-accelerated pipeline

---

## **Glossary of key terms (shared language helps teams)**

- **Augmented engineering**: using AI to accelerate delivery while keeping software trustworthy via gates, automation, and traceability (Ridley).
- **Verification debt**: accumulated risk/cost when AI output is merged faster than it is validated (analogy to technical debt).  
  See: [kevinbrowne.ca/verification-debt-is-the-ai-eras-technical-debt](https://www.kevinbrowne.ca/verification-debt-is-the-ai-eras-technical-debt/) and [cacm.acm.org/blogcacm/verification-debt-when-generative-ai-speeds-change-faster-than-proof](https://cacm.acm.org/blogcacm/verification-debt-when-generative-ai-speeds-change-faster-than-proof/)
- **Quality gates**: automated pass/fail checks that enforce standards before merge/release.  
  See: [softwareseni.com/building-quality-gates-for-ai-generated-code-with-practical-implementation-strategies](https://www.softwareseni.com/building-quality-gates-for-ai-generated-code-with-practical-implementation-strategies/)
- **Context engineering**: structuring durable project context (rules, docs, hooks, skills) so models do consistent work.  
  See: [tbtki.com/2025/12/21/context-engineering-with-claude-code](https://tbtki.com/2025/12/21/context-engineering-with-claude-code/)
- **SLSA**: Supply-chain Levels for Software Artifacts — a framework for build integrity/provenance.  
  See: [slsa.dev](https://slsa.dev/)
- **SSDF**: NIST Secure Software Development Framework (SP 800-218) — high-level secure SDLC practices.  
  See: [csrc.nist.gov/pubs/sp/800/218/final](https://csrc.nist.gov/pubs/sp/800/218/final) and PDF: [nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-218.pdf](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-218.pdf)
- **OWASP LLM Top 10**: common security risks specific to LLM applications and workflows.  
  See: [owasp.org/www-project-top-10-for-large-language-model-applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)

---

# **Part A — Foundations: principles that keep AI-built software trustworthy**

## **1. Engineering with AI: philosophy & core principles**

### **1.1. AI is an engineering partner, not a shortcut**

Ridley’s framing is pragmatic: AI can write a lot of code, but software is only valuable if you can **operate it, evolve it, and sleep at night**.  
See: [Augmented Engineering for Grown-Ups](https://ridley.co/articles/2026/02/19/augmented-engineering-for-grown-ups/)

Core principle:

- **Do not reduce discipline because you increased speed.** If anything, you need *more* discipline.

A useful mental model adopted by many teams:

- Treat AI output like code from a **very fast junior engineer**: enthusiastic, productive, sometimes wrong, often over-literal, and occasionally unsafe.

### **1.2. “Never trust, always verify” (applies to humans too)**

Ridley emphasises you cannot review every line at AI scale; instead, you **engineer verification systems** that make correctness cheaper than mistakes.  
See: [Augmented Engineering for Grown-Ups](https://ridley.co/articles/2026/02/19/augmented-engineering-for-grown-ups/)

Industry evidence aligns: many developers admit they don’t consistently verify AI code, creating verification debt.  
See: [itpro.com/software/development/software-developers-not-checking-ai-generated-code-verification-debt](https://www.itpro.com/software/development/software-developers-not-checking-ai-generated-code-verification-debt) and discussion: [smcmaster.com/blog/ai-coding-is-creating-a-code-review-crisis](https://www.smcmaster.com/blog/ai-coding-is-creating-a-code-review-crisis)

### **1.3. The “generation/verification gap” is the central risk**

AI lowers the cost of producing changes, which can overwhelm:

- review bandwidth
- test coverage quality
- architecture coherence
- security diligence
- operational readiness

Therefore the strategy is:

- **Scale verification with automation** and
- **shift humans to higher-leverage review** (intent, risk, architecture).

---

## **2. Process architecture for AI-augmented delivery**

### **2.1. DPPD (Discovery → Proposal → Plan → Delivery)**

Ridley’s DPPD is a deliberately written, artefact-driven workflow:

1. **Discovery** – understand problem space, constraints, and success signals  
2. **Proposal** – a durable doc capturing intent, tradeoffs, decisions, and outcomes  
3. **Plan** – convert proposal into implementable tasks/tickets and test strategy  
4. **Delivery** – code is produced (often by AI), but *bounded by gates and standards*  

See: [How I build products…](https://ridley.co/articles/2026/01/29/how-i-build-products-apps-and-features-with-claude-chatgpt-and-ai-dev-tools/)

Why it works well with AI:

- AI is strongest when the “shape” of the answer is constrained.
- Written artefacts reduce ambiguity and “AI drift”.
- Proposals become reusable context for future changes and onboarding.

### **2.2. Traceability is not bureaucracy; it’s insurance**

Ridley’s approach ties together:

- proposal → plan/tickets → commits/PRs → tests → deployments → monitoring

This has multiple payoffs:

- faster debugging (you can find the intent behind a change)
- safer refactors (you can verify behaviour against prior intent)
- easier due diligence / audits (evidence is generated, not reconstructed)

---

# **Part B — The craft: working patterns that teams use day-to-day**

## **3. Working pattern: “write the intent; let AI write the draft”**

A repeatable high-quality loop looks like:

1. Human writes **intent**: outcomes, constraints, non-goals, risks
2. AI proposes **options** with tradeoffs
3. Human selects an approach and writes **a short proposal**
4. AI expands into **a plan** (tasks, tests, roll-out, observability)
5. AI implements tasks in small PRs
6. Automation verifies; humans review the *important bits*

This mirrors a common “spec-driven development” revival, updated for AI speed.

---

## **4. Working pattern: ticketing that makes AI useful (and safe)**

A good AI-ready ticket has:

- **Context**: link to proposal, relevant docs, modules
- **Acceptance criteria**: crisp, testable statements
- **Constraints**: performance, security, style, API stability
- **Test plan**: what to add/adjust, how to validate
- **Rollout plan**: feature flags, migrations, monitoring, backout

Ridley’s practice: use AI to generate the plan/tickets, but only after a proposal exists.  
See: [How I build products…](https://ridley.co/articles/2026/01/29/how-i-build-products-apps-and-features-with-claude-chatgpt-and-ai-dev-tools/)

---

## **5. Working pattern: small PRs + automated review assistance**

Because AI can generate large diffs quickly, teams keep PRs:

- narrow in scope
- easily testable
- reviewable in minutes, not hours

Microsoft describes AI-assisted PR workflows that automate routine checks and help reviewers focus on higher-level issues.  
See: [devblogs.microsoft.com/engineering-at-microsoft/enhancing-code-quality-at-scale-with-ai-powered-code-reviews](https://devblogs.microsoft.com/engineering-at-microsoft/enhancing-code-quality-at-scale-with-ai-powered-code-reviews/)

Practical PR checklist (human):

- Does this change match the ticket/proposal intent?
- Are invariants preserved (security, privacy, performance)?
- Are tests meaningful (not just present)?
- Are failure modes obvious and handled?
- Is monitoring/logging updated where needed?

---

## **6. Working pattern: “context files” (project rules for AI)**

A big driver of inconsistent AI output is inconsistent context.

Common modern patterns include:

- **Project instructions** checked into the repo
- **Tool-specific rules** that enforce style/architecture
- **Hooks** that run checks automatically

### **6.1 Cursor rules**

Cursor supports project rules in `.cursor/rules` with `.md`/`.mdc` files and scoping.  
See: [cursor.com/docs/context/rules](https://cursor.com/docs/context/rules)

Team patterns:

- rules per domain area (`api.mdc`, `db.mdc`, `frontend.mdc`)
- rules that embed “golden paths” and forbid anti-patterns
- rules that point to canonical examples in the codebase

### **6.2 Claude.md (and similar)**

Ridley references a conventions file (“Layer 0”), commonly seen as `CLAUDE.md` in repositories.  
See: [Implementing Augmented Engineering](https://ridley.co/articles/2026/02/19/implementing-augmented-engineering/)

A useful public index of `CLAUDE.md` patterns:  
[github.com/josix/awesome-claude-md](https://github.com/josix/awesome-claude-md)

What belongs in a context file:

- how to run tests, lint, typecheck
- code style and architecture rules
- do/don’t lists (“never bypass auth”, “no raw SQL without parameterisation”)
- PR expectations (small diffs, tests required)
- a “map” of the codebase (modules and ownership)

### **6.3 Context engineering “stack”

A structured view of context layers (agents, skills, commands, hooks, servers) is described here:  
[tbtki.com/2025/12/21/context-engineering-with-claude-code](https://tbtki.com/2025/12/21/context-engineering-with-claude-code/)

A practical takeaway:

- **Prefer durable context over repeated prompting.**  
  If you find yourself re-explaining something, encode it in rules/docs/hooks.

---

# **Part C — Verification at scale: quality gates, testing, security, and supply chain**

## **7. Quality gates & automation (the backbone of augmented engineering)**

Ridley’s implementation story is explicitly layered, from local dev hooks through CI and beyond.  
See: [Implementing Augmented Engineering](https://ridley.co/articles/2026/02/19/implementing-augmented-engineering/)

A pragmatic quality gate framework specifically for AI code is described here:  
[softwareseni.com/building-quality-gates-for-ai-generated-code-with-practical-implementation-strategies](https://www.softwareseni.com/building-quality-gates-for-ai-generated-code-with-practical-implementation-strategies/)

### **7.1 Gate placement (where checks live)**

| Boundary | Goal | Typical checks |
|---|---|---|
| Editor/IDE | prevent obvious mistakes | formatting, quick lint, “dangerous” patterns |
| Pre-commit | keep repo clean | format, lint, unit tests subset, secret scan |
| Pre-push | stop broken branches | unit tests, typecheck, local build |
| PR checks | enforce org standards | full unit/integration tests, SAST, dependency scan |
| Mainline CI | non-bypassable | full suite, coverage thresholds, policy gates |
| Release pipeline | prove integrity | artifact signing, provenance, SBOM, deploy checks |

Key AI-specific additions:

- duplication/clone detection thresholds (AI often repeats patterns)
- complexity thresholds (AI tends to accrete logic)
- “policy as code” for security constraints

---

## **8. Testing in the age of AI**

### **8.1 Why tests need to improve, not just increase**

AI can generate *many* tests, but not necessarily good ones. The risk is “tests that assert the implementation”, shallow mocks, or low-signal coverage.

Ridley leans on **mutation testing** to validate test usefulness.  
See: [Implementing Augmented Engineering](https://ridley.co/articles/2026/02/19/implementing-augmented-engineering/)

Mutation testing principle:

- if you introduce a bug and tests still pass, tests are not protecting you.

### **8.2 Recommended test strategy for AI-heavy codebases**

**Baseline:**

- unit tests for pure logic and edge cases
- integration tests around boundaries (DB, queues, network)
- contract tests for APIs
- golden-path + failure-mode tests for critical flows

**AI-amplified:**

- property-based tests for invariants (where feasible)
- mutation testing on critical modules
- fuzzing for parsers and untrusted inputs
- regression tests tied to bug tickets (“never again” tests)

### **8.3 Testing as part of the “ticket template”**

The most effective pattern is making the test plan a required ticket section, so AI is always guided toward validation, not only implementation.

---

## **9. Security: treat AI tooling and AI code as an attack surface**

### **9.1 OWASP LLM Top 10 (relevant even if you’re “just using AI to code”)**

Even if you’re not shipping an LLM feature, your workflow can still be impacted by:

- prompt injection (AI tools consuming untrusted text)
- data leakage (secrets pasted into prompts/logs)
- insecure output handling (running generated code blindly)

OWASP’s list is a shared reference point:  
[owasp.org/www-project-top-10-for-large-language-model-applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)

### **9.2 Practical security controls for AI-assisted development**

**Data handling**

- never paste secrets into prompts (use redaction tools)
- use approved enterprise model endpoints with retention controls (where possible)
- define what code/data can be shared with third-party services

**Pipeline controls**

- secret scanning in pre-commit/CI
- dependency vulnerability scanning
- SAST (static analysis)
- license compliance scans (especially when AI increases dependency churn)

**Runtime safety**

- least-privilege credentials in CI and deployments
- protected environments for running untrusted/generated code
- sandboxing for “agent” tools that can execute commands

---

## **10. Secure SDLC alignment: SSDF as a compatible “frame”**

NIST SSDF (SP 800-218) is deliberately high-level, so it can be mapped onto AI-augmented workflows:

- Prepare the organization
- Protect the software
- Produce well-secured software
- Respond to vulnerabilities

See: [csrc.nist.gov/pubs/sp/800/218/final](https://csrc.nist.gov/pubs/sp/800/218/final) and [cisa.gov/resources-tools/resources/nist-sp-800-218-secure-software-development-framework-v11-recommendations-mitigating-risk-software](https://www.cisa.gov/resources-tools/resources/nist-sp-800-218-secure-software-development-framework-v11-recommendations-mitigating-risk-software)

A practical takeaway:

- AI doesn’t replace secure SDLC; it increases the need for it, because change volume rises.

---

## **11. Supply chain integrity: SBOMs, provenance, and signing become more important**

AI increases:

- dependency additions (copy/paste from suggestions)
- frequency of changes
- risk of accidental inclusion of vulnerable patterns

Therefore, modern best practice is:

- generate an **SBOM** in CI
- produce **provenance** (SLSA)
- **sign** artifacts and verify signatures at deploy time

SLSA overview:  
[slsa.dev](https://slsa.dev/)

Practical CI writeups:  
[nathanberg.io/posts/supply-chain-security-ci-sbom-slsa-sigstore](https://nathanberg.io/posts/supply-chain-security-ci-sbom-slsa-sigstore/)

Additional discussions:  
[openssf.org/blog/2023/05/31/openssf-supply-chain-integrity-working-group-provides-security-guidance-practical-frameworks-and-tools](https://openssf.org/blog/2023/05/31/openssf-supply-chain-integrity-working-group-provides-security-guidance-practical-frameworks-and-tools/)

---

# **Part D — Teams and operating models: governance, metrics, and culture**

## **12. Governance: how teams avoid chaos while staying fast**

### **12.1 Define “approved” AI use cases**

High-confidence uses (often safest early):

- summarising code
- generating docs and runbooks
- drafting tests (with human oversight)
- refactoring with strong test coverage

Higher-risk uses (require stronger gates):

- security-sensitive modules
- authentication/authorisation logic
- payment/billing flows
- data migrations
- infrastructure and IAM policy generation

### **12.2 Standardise the workflow, not the prompt**

The best teams standardise:

- proposal template
- ticket template
- PR template
- definition of done
- quality gate thresholds

…rather than relying on individual “prompt magic”.

---

## **13. Metrics & monitoring (you can’t manage what you don’t measure)**

### **13.1 Quality metrics that matter in AI-accelerated codebases**

| Metric | Why it matters |
|---|---|
| Test coverage (with caution) | a baseline signal, not sufficient alone |
| Mutation score (where used) | measures test effectiveness |
| Duplication rate | AI repetition is a long-term maintainability tax |
| Complexity trends | AI can accrete complexity quickly |
| Mean time to detect / recover | operational reality check |
| Change failure rate | catches “fast but fragile” dynamics |
| Security findings trend | ensures risk doesn’t silently rise |

A recurring industry finding is that AI code can be functional but weak on architectural judgment, increasing debt risk.  
See: [infoq.com/news/2025/11/ai-code-technical-debt](https://www.infoq.com/news/2025/11/ai-code-technical-debt/)

---

## **14. Training: the new skill is “reviewing and verifying at speed”**

AI increases the need for:

- strong code review skills
- threat modelling basics
- test design capability
- system thinking and architecture judgment

Because reviewing is a different cognitive task than authoring, teams often need to explicitly train it.  
See: [smcmaster.com/blog/ai-coding-is-creating-a-code-review-crisis](https://www.smcmaster.com/blog/ai-coding-is-creating-a-code-review-crisis)

---

# **Part E — Tooling landscape and what “other people are doing”**

## **15. Tooling categories teams combine (and how they fit the patterns)**

### **15.1 AI IDEs and assistants**

Common needs:

- persistent rules (“project brain”)
- diff-aware refactors
- test generation support
- codebase search and summarisation

Cursor rules are one concrete example of formalising those needs:  
[cursor.com/docs/context/rules](https://cursor.com/docs/context/rules)

### **15.2 AI-assisted code review**

Microsoft’s PRAssistant is an example of AI augmenting PR review at scale (routine checks + conversational assistance).  
[devblogs.microsoft.com/engineering-at-microsoft/enhancing-code-quality-at-scale-with-ai-powered-code-reviews](https://devblogs.microsoft.com/engineering-at-microsoft/enhancing-code-quality-at-scale-with-ai-powered-code-reviews/)

### **15.3 Templates and “compound/augmented engineering” repos**

There are public repos that try to encode these patterns into templates and plugins:

- [github.com/Augmented-Dev72/augmented-engineering](https://github.com/Augmented-Dev72/augmented-engineering)  
- [github.com/Augmented-Dev72/augmented-engineering-template](https://github.com/Augmented-Dev72/augmented-engineering-template)

These illustrate a trend: teams want **repeatable scaffolds** for AI workflows (hooks, docs, summaries, rule files).

---

## **16. Model capability evaluation (why it matters, even if you don’t publish benchmarks)**

Even if you don’t care about leaderboards, benchmarks explain a key truth:

- models still fail in systematic ways on real codebases
- harness/tooling matters as much as the base model

SWE-bench and SWE-bench Verified are widely referenced for agentic coding evaluation:  
[swebench.com](https://www.swebench.com/) and repository: [github.com/swe-bench/SWE-bench](https://github.com/swe-bench/SWE-bench)

A practical interpretation:

- treat AI as *fallible*; design the workflow so failure is caught by gates.

---

# **Part F — A practical “best practice” blueprint**

## **17. Reference implementation: an augmented engineering pipeline (conceptual)**

This is an implementation-agnostic blueprint; tools differ, but the shape holds.

### **17.1 Repo structure (example)**

- `/docs/`
  - `proposal-template.md`
  - `architecture.md`
  - `runbooks/`
- `CLAUDE.md` (or equivalent project AI instructions)
- `.cursor/rules/*.mdc` (if using Cursor)
- `.github/workflows/ci.yml` (quality gates)
- `scripts/` (one-command dev workflows)

### **17.2 Guardrails**

**Local**

- format/lint on save
- pre-commit: format + lint + secret scan + quick tests

**PR**

- full tests + coverage threshold
- SAST + dependency scan
- duplication + complexity checks
- required PR template sections: intent, test evidence, rollout notes

**Release**

- SBOM generation
- provenance attestation (SLSA)
- artifact signing + verification
- staged rollout + monitoring checks

---

## **18. Working agreements (what teams write down)**

This is often the single highest leverage move: make expectations explicit.

### **18.1 Definition of Done (AI-compatible)**

A change is “done” when:

- acceptance criteria met
- tests added/updated and meaningful
- security checks pass
- observability updated (logs/metrics where needed)
- rollout/backout considered
- docs updated if behaviour changed
- PR is traceable to ticket/proposal

### **18.2 “AI usage policy” (short and enforceable)**

Keep it short enough that people will follow it:

- approved tools and accounts
- what data can/can’t be shared
- required gates (no bypass)
- expectations for PR descriptions and evidence
- escalation: when human experts must review

Tie it to real risks (OWASP LLM Top 10 and SSDF are useful anchors):  
[owasp.org/www-project-top-10-for-large-language-model-applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)  
[csrc.nist.gov/pubs/sp/800/218/final](https://csrc.nist.gov/pubs/sp/800/218/final)

---

# **Part G — Summary of recommended working patterns (quick reference)**

|**Pattern** | **Purpose** |
|---|---|
|Structured pre-AI discovery | Clarify problem before implementation|
|Proposal artefacts | Capture intent & constraints|
|Plan-to-tickets | Make work small, testable, traceable|
|Small PRs | Keep review/verification tractable|
|Automated quality gates | Preserve codebase integrity at high change volume|
|Mutation testing (selectively) | Validate that tests actually protect behaviour|
|Human review focuses on risk | Architecture, invariants, security, ops|
|Context engineering (rules/docs/hooks) | Make AI consistent across the repo|
|Supply chain controls (SBOM/SLSA/signing) | Keep builds auditable and tamper-resistant|
|Metrics + monitoring | Detect drift into “fast but fragile”|

---

# **Conclusion**

AI-assisted development is now a production reality. The teams that succeed will not be those with the cleverest prompts, but those who:

- **write intent clearly**
- **constrain work with plans**
- **automate verification**
- **treat security and supply chain as first-class**
- **measure outcomes continuously**
- **keep humans focused on architecture and risk**

That is the essence of “augmented engineering”: **more output, without losing control.**

---

## **References (all links are direct sources)**

### Ridley (primary)

- [How I build products, apps and features with Claude, ChatGPT and AI dev tools](https://ridley.co/articles/2026/01/29/how-i-build-products-apps-and-features-with-claude-chatgpt-and-ai-dev-tools/)
- [Augmented Engineering for Grown-Ups](https://ridley.co/articles/2026/02/19/augmented-engineering-for-grown-ups/)
- [Implementing Augmented Engineering](https://ridley.co/articles/2026/02/19/implementing-augmented-engineering/)

### Verification debt & review culture

- [Verification debt is the AI era’s technical debt](https://www.kevinbrowne.ca/verification-debt-is-the-ai-eras-technical-debt/)
- [Verification Debt: When Generative AI Speeds Change Faster Than Proof](https://cacm.acm.org/blogcacm/verification-debt-when-generative-ai-speeds-change-faster-than-proof/)
- [Nearly half of developers don’t check AI-generated code (verification debt)](https://www.itpro.com/software/development/software-developers-not-checking-ai-generated-code-verification-debt)
- [AI coding is creating a code review crisis](https://www.smcmaster.com/blog/ai-coding-is-creating-a-code-review-crisis)

### Quality gates & AI code quality

- [Building Quality Gates for AI-Generated Code with Practical Implementation Strategies](https://www.softwareseni.com/building-quality-gates-for-ai-generated-code-with-practical-implementation-strategies/)
- [Best practices for AI-assisted software development](https://agilityfeat.com/blog/best-practices-for-ai-assisted-software-development/)
- [AI-generated code is accumulating technical debt (report coverage)](https://www.infoq.com/news/2025/11/ai-code-technical-debt/)

### AI code review at scale

- [Enhancing Code Quality at Scale with AI-Powered Code Reviews (Microsoft)](https://devblogs.microsoft.com/engineering-at-microsoft/enhancing-code-quality-at-scale-with-ai-powered-code-reviews/)

### Context engineering & rules

- [Context Engineering with Claude Code](https://tbtki.com/2025/12/21/context-engineering-with-claude-code/)
- [Cursor Rules documentation](https://cursor.com/docs/context/rules)
- [awesome-claude-md (curated CLAUDE.md patterns)](https://github.com/josix/awesome-claude-md)

### Security frameworks

- [OWASP Top 10 for Large Language Model Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
- [NIST SP 800-218 SSDF (final)](https://csrc.nist.gov/pubs/sp/800/218/final)
- [NIST SP 800-218 SSDF (PDF)](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-218.pdf)
- [CISA overview of SSDF](https://www.cisa.gov/resources-tools/resources/nist-sp-800-218-secure-software-development-framework-v11-recommendations-mitigating-risk-software)

### Supply chain integrity

- [SLSA framework](https://slsa.dev/)
- [Supply Chain Security in CI: SBOMs, SLSA, and Sigstore](https://nathanberg.io/posts/supply-chain-security-ci-sbom-slsa-sigstore/)
- [OpenSSF supply chain integrity guidance](https://openssf.org/blog/2023/05/31/openssf-supply-chain-integrity-working-group-provides-security-guidance-practical-frameworks-and-tools/)

### Benchmarks / evaluation

- [SWE-bench](https://www.swebench.com/)
- [SWE-bench repository](https://github.com/swe-bench/SWE-bench)

### Public augmented/compound engineering examples

- [augmented-engineering (plugin)](https://github.com/Augmented-Dev72/augmented-engineering)
- [augmented-engineering-template](https://github.com/Augmented-Dev72/augmented-engineering-template)
