/**
 * Canonical names of the two EEF surfaces co-gated behind
 * `OAK_CURRICULUM_MCP_EEF_ENABLED`.
 *
 * The MCP registration (tool in `handlers.ts`, prompt in
 * `register-prompts.ts`) AND the public landing page
 * (`landing-page/render-tools-section.ts`,
 * `landing-page/render-prompts-section.ts`) all consume these names so the
 * flag-gated set cannot drift between the invokable protocol surface and the
 * advertised landing-page surface. When the flag is off, both surfaces omit
 * both names.
 */
export const EEF_TOOL_NAME = 'eef-explore-evidence-for-context' as const;
export const EEF_PROMPT_NAME = 'eef-evidence-grounded-lesson-plan' as const;
