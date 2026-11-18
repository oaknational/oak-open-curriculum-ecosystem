/**
 * Shared fixtures for the operator-profile validator: the unit suite proves
 * the enforcement schema's behaviour on them, and the contract smoke proves
 * the Core-carried JSON Schema gives the same verdict on each. Every
 * fixture is a whole document (frontmatter plus body) so both surfaces see
 * exactly what a reader would.
 */

import { type OperatorProfileKind } from './operator-profile-schema.js';

export interface ProfileFixture {
  readonly name: string;
  /** The layout position the fixture is read at. */
  readonly kind: OperatorProfileKind;
  readonly relPath: string;
  /** Whether the frontmatter alone conforms to the family schema. */
  readonly frontmatterValid: boolean;
  readonly content: string;
}

const AT_INDEX = { kind: 'index', relPath: 'index.md' } as const;
const AT_SCOPE = { kind: 'scope', relPath: 'repos/x--y.md' } as const;
const AT_MACHINE = { kind: 'machine', relPath: 'machines/x.md' } as const;

const VALID_INDEX = `---
practice_profile: operator-profile
schema_version: 1
kind: index
updated: 2026-09-14
ratified: false
seeded_by: "Zephyr guards Leeward (claude-code, 281e44)"
---

# Operator profile

- The working mode is mutual respect and trust.
`;

const VALID_SCOPE = `---
practice_profile: operator-profile
schema_version: 1
kind: scope
scope_key: engraphcode--open-curriculum-ecosystem
updated: 2026-09-14
ratified: true
operator: Jim
---

# Scope: the fork line

- Commit identity is the estate's bot.
`;

const VALID_SCOPE_UNSCOPED = `---
practice_profile: operator-profile
schema_version: 1
kind: scope
scope_key: example-sites
updated: 2026-10-28
ratified: true
---

# Scope: a repository whose root package name has no scope

- The key is the name itself.
`;

const VALID_MACHINE = `---
practice_profile: operator-profile
schema_version: 1
kind: machine
machine_key: studio-laptop
updated: 2026-09-14
ratified: true
---

# Machine: studio-laptop

- Internal systems disconnected here until 2026-10-06.
`;

const MISSING_REQUIRED = `---
practice_profile: operator-profile
schema_version: 1
kind: index
updated: 2026-09-14
---

# Unratified and it does not say so
`;

const UNKNOWN_FIELD = `---
practice_profile: operator-profile
schema_version: 1
kind: index
updated: 2026-09-14
ratified: true
token: abc
---

# A field the family does not name
`;

const WRONG_FAMILY = `---
practice_profile: operator-profile
schema_version: 2
kind: index
updated: 2026-09-14
ratified: true
---

# A future family
`;

const SCOPE_WITHOUT_KEY = `---
practice_profile: operator-profile
schema_version: 1
kind: scope
updated: 2026-09-14
ratified: true
---

# A scope with no key
`;

const SCOPE_KEY_UNDERIVED = `---
practice_profile: operator-profile
schema_version: 1
kind: scope
scope_key: "@Example-Org/example-repo"
updated: 2026-09-14
ratified: true
---

# The manifest's raw scoped name, not the derived key
`;

const MACHINE_KEY_UPPERCASE = `---
practice_profile: operator-profile
schema_version: 1
kind: machine
machine_key: Studio-Laptop
updated: 2026-09-14
ratified: true
---

# Keys are lowercase
`;

const BAD_DATE = `---
practice_profile: operator-profile
schema_version: 1
kind: index
updated: yesterday
ratified: true
---

# Not a calendar date
`;

const IMPOSSIBLE_DATE = `---
practice_profile: operator-profile
schema_version: 1
kind: index
updated: 2026-99-99
ratified: true
---

# The shape of a date, not a date
`;

export const PROFILE_FIXTURES: readonly ProfileFixture[] = [
  {
    name: 'updated is an impossible date',
    ...AT_INDEX,
    frontmatterValid: false,
    content: IMPOSSIBLE_DATE,
  },
  { name: 'valid index', ...AT_INDEX, frontmatterValid: true, content: VALID_INDEX },
  { name: 'valid scope', ...AT_SCOPE, frontmatterValid: true, content: VALID_SCOPE },
  {
    name: 'valid scope, unscoped package name',
    kind: 'scope',
    relPath: 'repos/example-sites.md',
    frontmatterValid: true,
    content: VALID_SCOPE_UNSCOPED,
  },
  { name: 'valid machine', ...AT_MACHINE, frontmatterValid: true, content: VALID_MACHINE },
  {
    name: 'missing required ratified',
    ...AT_INDEX,
    frontmatterValid: false,
    content: MISSING_REQUIRED,
  },
  { name: 'unknown field', ...AT_INDEX, frontmatterValid: false, content: UNKNOWN_FIELD },
  { name: 'wrong schema family', ...AT_INDEX, frontmatterValid: false, content: WRONG_FAMILY },
  {
    name: 'scope without scope_key',
    ...AT_SCOPE,
    frontmatterValid: false,
    content: SCOPE_WITHOUT_KEY,
  },
  {
    name: "scope_key in the manifest's raw scoped form",
    ...AT_SCOPE,
    frontmatterValid: false,
    content: SCOPE_KEY_UNDERIVED,
  },
  {
    name: 'machine_key with upper case',
    ...AT_MACHINE,
    frontmatterValid: false,
    content: MACHINE_KEY_UPPERCASE,
  },
  { name: 'updated is not a date', ...AT_INDEX, frontmatterValid: false, content: BAD_DATE },
];

export const VALID_INDEX_DOCUMENT = VALID_INDEX;
export const VALID_SCOPE_DOCUMENT = VALID_SCOPE;
export const VALID_MACHINE_DOCUMENT = VALID_MACHINE;
