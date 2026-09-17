// The base node environment suffices: every collaborator under test is an
// injected fake (ADR-078), and the two global reads in the module are
// optional-guarded — no DOM environment needed until a component lands.
import { baseTestConfig } from '@oaknational/workspace-config/vitest';

export default baseTestConfig;
