import { describe, it, expect } from 'vitest';

import { createMessage } from './reappraising-message.js';

/**
 * `createMessage` is the sole producer of a rule message. Its contract is the
 * load-bearing half of the "every custom-rule message teaches a positive
 * reappraisal direction" guarantee (PDR-044 §Innate immunity, as amended): a
 * message cannot be authored without naming both what is wrong (the
 * prohibition) and what to do instead (the reappraisal). The type-level half —
 * a plain string is not assignable where a rule message is required — is proven
 * by the rule definitions themselves type-checking under
 * `RuleWithReappraisingMessages`.
 */
describe('createMessage', () => {
  it('composes a message that carries both the prohibition and the positive reappraisal direction', () => {
    const message = createMessage({
      prohibition: 'Dynamic import(...) is banned.',
      reappraisal: 'Use a static import or an explicit boundary module instead.',
    });

    expect(message).toContain('Dynamic import(...) is banned.');
    expect(message).toContain('Use a static import or an explicit boundary module instead.');
  });

  it('preserves interpolation placeholders untouched for ESLint runtime substitution', () => {
    const message = createMessage({
      prohibition: 'Exported async function "{{name}}" has no observability emission.',
      reappraisal:
        'Add a logger.* emission, or tag with `// observability-emission-exempt: <reason>`.',
    });

    expect(message).toContain('{{name}}');
  });

  it('rejects an empty prohibition — a rule must state what is wrong', () => {
    expect(() =>
      createMessage({ prohibition: '   ', reappraisal: 'Do the cohesive thing instead.' }),
    ).toThrow(/prohibition must be non-empty/u);
  });

  it('rejects an empty reappraisal — a rule must teach what to do instead', () => {
    expect(() => createMessage({ prohibition: 'The shape is banned.', reappraisal: '' })).toThrow(
      /reappraisal must be non-empty/u,
    );
  });
});
