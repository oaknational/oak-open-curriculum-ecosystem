# Widget Validation on AI Tools

**Created**: 2026-02-23
**Status**: NOT STARTED
**Purpose**: Manual validation of widget rendering changes via
ChatGPT developer mode, so we know the changes work end-to-end
before merge.

---

## Pre-requisites

- [ ] All quality gates green locally (`pnpm check`)
- [ ] Branch pushed to origin so Vercel preview deploys

## 1. Get the Preview URL

- [ ] Push branch: `git push`
- [ ] Wait for Vercel preview build to complete
- [ ] Note the preview URL (check Vercel dashboard or GitHub
      commit status)

## 2. Create a ChatGPT Developer Mode App

- [ ] Open ChatGPT → Explore GPTs → Create
- [ ] In the configuration, add an Action
- [ ] Point the Action's schema URL at the preview server's
      `/mcp` route (the OpenAPI spec endpoint)
- [ ] Set authentication as required (OAuth or none, depending
      on preview config)
- [ ] Save the GPT in developer/draft mode

## 3. Validate Widget Rendering

For each tool that returns widgets, confirm the rendered output
looks correct in ChatGPT's response. Key scenarios:

### Search

- [ ] Run a curriculum search query (e.g. "photosynthesis KS3")
- [ ] Confirm search results render with correct fields
      (title, subject, key stage, description)
- [ ] Confirm clickable links work

### Browse

- [ ] Ask to browse the curriculum (e.g. "show me KS2 Science")
- [ ] Confirm browse results render correctly
- [ ] Confirm navigation/hierarchy is coherent

### Explore

- [ ] Ask to explore a topic (e.g. "explore forces and motion")
- [ ] Confirm explore results render correctly

### Suggestions

- [ ] Trigger a suggest flow (partial/ambiguous query)
- [ ] Confirm suggestions render and are usable

## 4. Edge Cases

- [ ] Empty results — query with no matches, confirm graceful
      message
- [ ] Large result set — confirm truncation/pagination behaves
- [ ] Malformed input — confirm error handling is clean

## 5. Record Outcome

- [ ] Note any issues found (file bugs or fix immediately)
- [ ] If all passes, mark this plan complete and archive

---

## Notes

This is a manual validation plan. Automated E2E coverage for
widget rendering exists in the test suite; this plan covers the
last-mile "does it actually look right in a real AI tool"
verification.
