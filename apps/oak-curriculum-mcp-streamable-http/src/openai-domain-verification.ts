/**
 * The OpenAI plugin-submission domain-verification challenge (MCP-700).
 *
 * Plugins with a remote MCP server must prove control of the host that
 * serves it before OpenAI lists them. The proof is a fixed token served at a
 * well-known path on that host; the portal fetches it and compares.
 *
 * Contract (https://developers.openai.com/plugins/deploy/submission,
 * "Domain verification", read 2026-09-09): the portal fetches
 * `https://<mcp-host>/.well-known/openai-apps-challenge` and "the challenge
 * endpoint must return only that plugin's verification token. Do not return
 * JSON, a list of tokens, or multiple tokens from the same URL." The docs
 * name no method, content type or caching rule, so this answers GET with
 * 200, `text/plain`, and the bare token.
 *
 * A sibling of the `.well-known` OAuth metadata in `auth-routes.ts`, kept in
 * its own module because it is not an OAuth surface: it is registered in
 * every auth mode, and the body is origin-independent so there is no Host
 * check to fail. Volumetric control is owned at the edge (ADR-219).
 */
import type { Express } from 'express';
import type { Logger } from '@oaknational/logger';

/**
 * Path the portal fetches; fixed by OpenAI, relative to the MCP host.
 *
 * The canonical owner of the path: the Clerk skip list consumes this constant
 * too, so the served route and the auth exemption cannot drift apart.
 */
export const OPENAI_APPS_CHALLENGE_PATH = '/.well-known/openai-apps-challenge';

/**
 * The verification token the portal issued for the Oak plugin, recorded on
 * MCP-700. Public by nature: it proves domain control to the portal and
 * grants nothing, so it lives in source rather than in an environment
 * variable.
 */
const OPENAI_APPS_CHALLENGE_TOKEN = 'zc9V349cLHm9igIbhHavPlwHsEuWnBD7Hzbp0hTi75g';

/**
 * Registers the challenge route. Mount BEFORE clerkMiddleware, in every
 * auth mode.
 */
export function registerOpenAiDomainVerificationChallenge(app: Express, log: Logger): void {
  log.debug('Registering OpenAI domain-verification challenge (public, MCP-700)');
  app.get(OPENAI_APPS_CHALLENGE_PATH, (_req, res) => {
    res.type('text/plain').send(OPENAI_APPS_CHALLENGE_TOKEN);
  });
}
