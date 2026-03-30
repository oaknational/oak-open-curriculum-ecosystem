# Wrap Up

End-of-session consolidation: update plans, consolidate docs, review, fix, commit, and prepare session handover.

## Steps

1. **Update plans and prompts.** Scan all active plans under `.agent/plans/` and prompts under `.agent/prompts/` for stale status, outdated next-steps, or missing completion markers. Update them to reflect the current state of work. Pay special attention to the plan that was being executed in this session.

2. **Clarify next actions.** Ensure the active plan has a clear, unambiguous description of what the next session should do first. If the next phase has preconditions (reviewer sign-off, baseline verification, etc.), list them explicitly. The goal: a new session can start working within minutes of reading the plan.

3. **Review plans and work.** Invoke the relevant specialist reviewers on both the plans (architecture reviewers for structural decisions, docs-adr-reviewer for documentation quality) and the code changes (code-reviewer as gateway, plus specialists per the triage checklist in `.agent/commands/review.md`). Report findings.

4. **Fix all reported issues.** Address every finding from reviewers — all findings are blocking per project principles. Re-run affected quality gates after fixes.

5. **Deep consolidation sweep.** Execute the full consolidate-docs workflow (`.agent/commands/consolidate-docs.md`). This covers documentation extraction, plan hygiene, ephemeral content promotion, code pattern extraction, fitness checks, and practice box integration. Go deep, reflect on whether there are long-term lessons here that should be captured in the permanent documentation.

6. **Commit and push.** Follow the commit workflow (`.agent/commands/commit.md`). Stage selectively, use Conventional Commit format, push to remote.

7. **Session handover.** Write session continuation sentences for the next session. Output them wrapped in quadruple backticks (` ```` `). These should include: what was done, what the RED/GREEN/REFACTOR state is, which plan phase is next, and any preconditions or obligations recorded during review.
