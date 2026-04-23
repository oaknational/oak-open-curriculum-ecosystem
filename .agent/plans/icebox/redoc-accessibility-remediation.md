# Redoc Accessibility Remediation

## Status: Icebox

## Summary

The Redoc OpenAPI documentation renderer (`/api/docs` page in `oak-search-cli`) has inherent accessibility violations that cannot be fixed through configuration or CSS overrides alone.

## Known Violations

Detected by Axe accessibility testing:

1. **`color-contrast`** (serious) - Schema type labels in tables have insufficient contrast ratio
2. **`heading-order`** (moderate) - h5 headings appear without proper heading hierarchy (h2, h3, h4)
3. **`select-name`** (critical) - Language/server selector dropdowns lack accessible labels

## Why These Cannot Be Fixed Currently

| Violation      | Fixable via CSS? | Fixable via Config? | Notes                                                                 |
| -------------- | ---------------- | ------------------- | --------------------------------------------------------------------- |
| color-contrast | Partially        | No                  | Would require targeting internal Redoc class names which are unstable |
| heading-order  | No               | No                  | Structural issue in Redoc's markup generation                         |
| select-name    | No               | No                  | Requires `aria-label` attributes on internal elements                 |

## Current Mitigation

The Redoc wrapper element (`.redoc-wrap`) is excluded from Axe accessibility analysis in the UI tests. This is documented and intentional - we're not disabling accessibility testing, we're acknowledging that a specific third-party component has known issues outside our control.

See: `apps/oak-search-cli/tests/visual/responsive-baseline.spec.ts`

## Potential Solutions (Future)

1. **Upstream contribution**: File issues/PRs with Redoc project
2. **Alternative renderer**: Evaluate alternatives like Scalar, Swagger UI, or custom rendering
3. **Custom wrapper**: Post-process Redoc output with DOM manipulation (fragile)
4. **Vendor fork**: Fork Redoc and maintain accessibility fixes (high maintenance burden)

## References

- Redoc GitHub: <https://github.com/Redocly/redoc>
- Axe color-contrast rule: <https://dequeuniversity.com/rules/axe/4.11/color-contrast>
- WCAG 2.1 AA requirements: <https://www.w3.org/WAI/WCAG21/quickref/>

## Decision Log

| Date       | Decision                        | Rationale                                                               |
| ---------- | ------------------------------- | ----------------------------------------------------------------------- |
| 2025-12-02 | Exclude Redoc from Axe analysis | Third-party component with known issues; fixes require upstream changes |
