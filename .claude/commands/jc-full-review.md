---
description: Perform a deep review of the codebase
argument-hint: [optional plan for context]
---

Read this WHOLE document _before_ taking action.

This is the request:

```text
Please perform a slow, deep, COMPREHENSIVE review of the **entire** codebase: go slowly, take your time, get it right. I do not expect this process to be quick, I do expect it to be both thorough and accurate. As you go compare the code to the rules .agent/directives/rules.md and other guidance .agent/directives/AGENT.md , and make notes of any discrepancies. The review MUST use all sub-agents, the code-reviewer, the architecture-reviewer, the test-auditor, and the config-auditor, invoke them as needed, as many times as needed, use their reports to inform your review.

If a plan was provided, consider feedback in that context, make sure that sub-agents are aware of the details relevant to their role.

Plan: $ARGUMENT
```

First:

1. Think hard about the request, these are your thoughts.
2. Reflect deeply on those thoughts, these are your reflections.
3. Comprehensively consider those reflections, these are your insights.
4. Think hard about what the insights tell you about the original request, and the context and desired impact. What has changed? _Why?_
5. Report your insights and how they inform the original request.

Then, using your thoughts, reflections, and insights, work through the following step-by-step, thinking really hard at each point:

1. UNDERSTAND: What is the core question being asked?
2. ANALYZE: What are the key factors/components involved?
3. REASON: What logical connections can I make?
4. SYNTHESIZE: How do these elements combine?
5. CONCLUDE: What is the most accurate/helpful response?

Now: carry out the review and produce a detailed, actionable report, thinking hard at each step.

Now: invoke each of the sub-agents to review the relevant code, and report sections, and report back to you. Make it clear they are to review and report, not to modify or fix. Reflect on their reports. Update your report as appropriate.
