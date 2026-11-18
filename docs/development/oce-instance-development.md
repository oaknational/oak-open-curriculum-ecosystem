# Developing an OCE instance

**Target guide, 10 October 2026.** The package and runner names are not yet a
published installation recipe. Use the [architecture](../architecture/oce-architecture.md)
and [configuration contracts](../architecture/oce-configuration-contracts.md)
for the proposed boundary; availability must be verified for a chosen release.

An instance contains pinned package/lock manifests, supported configuration,
permitted authored content and references to host, credentials and reusable
workflow facilities. OCE supplies execution, validation, presentation, policy,
build, conformance, diagnostics, release and recovery mechanisms. A callback,
custom bootstrap, provider implementation or copied operational script belongs
in OCE, even when the instance is its first consumer.

## The intended workflow

1. Select a published capability profile that covers the required audience,
   purposes, host, data and operation. Read its supported version combinations,
   assurance boundaries, rights, expected failure and receiving obligations.
2. Pin the complete compatible package/profile set. Use OCE's published scaffold
   and validation facilities; do not deep-import source or resolve a checkout root.
3. Supply instance identity, permitted capability selections, domain/source
   references, policies, presentation values and logical provider/secret references.
   No secret value belongs in versioned configuration.
4. Resolve and validate a candidate. Review diagnostics and immutable resolved
   identities. Invalid configuration, unsupported skew, unavailable resources or
   authority escalation must fail before activation.
5. Build and exercise the declared profile through published facilities. A local
   fixture proves its own behaviour; the receiving operator separately verifies
   host/data/auth readiness and rights before live activation.
6. Activate the accepted configuration and preserve its observed release record.
   On failure, follow the profile's supported recovery. A code/config revert is
   not automatically a valid reversal of durable state or withdrawn content.

## Ordinary changes and new capabilities

Enabling an already supported tool, selecting a registered provider, changing a
permitted layout or tuning an independently named search instance should require
only configuration and the instance's own lifecycle. It should not require an OCE
edit or release. The architecture's scenario matrix defines the initial test set.

A new protocol, provider implementation, semantic operation, rendering component
or unsupported domain contract is capability work in OCE. Report the missing
contract with a minimal configuration/behaviour example and exact package/profile
versions. Do not patch around the boundary with copied implementation. Potential
reuse is sufficient to retain the new mechanism in OCE.

## Support, update and retirement

Use the published diagnostic facility to identify package, config, schema/profile,
source/model and activation revisions without revealing secrets or unnecessary
personal data. Receiving ownership covers incident response, source correction,
credentials, retention and recovery as applicable to the chosen profile.

Before updating, validate the new supported combination and rehearse relevant
behaviour and recovery. Follow release-age policy and explicit urgent exceptions;
do not broadly exclude first-party packages. Retiring an instance releases its
runtime authority and resources under the profile's retention rules. Reusable
mechanisms and useful evidence remain maintained in OCE.
