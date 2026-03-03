# Milestone 1: Invite-Only Alpha

## Why this milestone matters

This is when Oak's curriculum tools move from internal testing to real-world
use by a controlled group. The HTTP MCP server uses the development Clerk
instance with an allowlist restricting access to Oak staff emails and
explicitly invited users. This provides genuine validation with real users
while maintaining a manageable scope for support and iteration.

## Who it is for

- **Oak staff** using AI assistants in their daily curriculum work
- **Invited partners** evaluating Oak's curriculum tools for their own
  products and workflows
- **Oak's product team** gathering real-world usage data to inform
  subsequent milestones

## What value it delivers

- Oak staff can access the curriculum through any MCP-capable AI tool
  (ChatGPT, Claude, Gemini) using the existing development Clerk instance.
- The allowlist model (Oak email domain + explicit invitations) provides
  real-world validation without the operational burden of public access.
- Adding invited users is straightforward via the Clerk Dashboard UI.
- Feedback from a known user base enables targeted improvements before
  broader release.

## Progression gates

All must be true before M1 exit:

- [x] Repository made public on GitHub
- [x] HTTP MCP server deployed at `curriculum-mcp-alpha.oaknational.dev`
- [x] Access restricted to Oak email domain + explicit Clerk invitations
  (allowlist on development instance)
- [ ] Quality gates green (`pnpm qg`)
- [ ] No severity-1 or severity-2 snagging items open

## Current status

**Active.** Repository is public (2026-03-03). Server is live at
`curriculum-mcp-alpha.oaknational.dev` with OAuth 2.1 authentication.
Access control uses the development Clerk instance's allowlist
(Oak emails + explicit invitations managed via Clerk Dashboard).

Production Clerk migration is deferred to M2 (Open Public Alpha).

Dependencies: M0 complete (done).
