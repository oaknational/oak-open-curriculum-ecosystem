# Supply Chain Controls

## Status

Icebox — consider before public beta.

## Context

AI-augmented development increases dependency additions, change frequency, and risk of accidental inclusion of vulnerable patterns. Industry best practice recommends:

- **SBOM generation** in CI (Software Bill of Materials)
- **Provenance attestation** via [SLSA](https://slsa.dev/)
- **Artifact signing** and verification at deploy time

## Research

- [Augmented Engineering Practices (industry evidence)](../agentic-engineering-enhancements/augmented-engineering-practices.research.md) — Part 11 (supply chain integrity), Part 17.2 (release guardrails)
- [SLSA framework](https://slsa.dev/)
- [Supply Chain Security in CI: SBOMs, SLSA, and Sigstore](https://nathanberg.io/posts/supply-chain-security-ci-sbom-slsa-sigstore/)
- [NIST SP 800-218 SSDF](https://csrc.nist.gov/pubs/sp/800/218/final)

## Trigger

Promote from icebox when npm package publishing is imminent or when the repository enters public beta.

## Scope (when promoted)

- SBOM generation as part of CI pipeline
- Provenance attestation for published npm packages
- Artifact signing for release builds
- Dependency vulnerability scanning in CI (beyond current `pnpm audit`)
- License compliance scanning
