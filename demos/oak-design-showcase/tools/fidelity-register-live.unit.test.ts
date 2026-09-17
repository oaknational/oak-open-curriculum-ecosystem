import { parseRegister } from '@oaknational/fidelity-review/register';
import { describe, expect, it } from 'vitest';

import liveRegister from '../fidelity-register.json';

/* The schema's behaviour tests live with the schema in
 * @oaknational/fidelity-review; this app-local suite proves only that OUR
 * live register parses against it. */
describe('the live fidelity-register.json', () => {
  // A schema-invalid live register blocks fidelity report generation but no CI
  // gate parsed it (the review orchestrator is a manual tool), so entries have
  // shipped malformed before. This is that issue's check.
  it('parses against the schema', () => {
    const result = parseRegister(JSON.stringify(liveRegister));

    expect(result.ok ? undefined : result.error).toBeUndefined();
    expect(result.ok).toBe(true);
  });
});
