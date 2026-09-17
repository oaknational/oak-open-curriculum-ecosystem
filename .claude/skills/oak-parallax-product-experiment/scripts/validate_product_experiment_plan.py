#!/usr/bin/env python3
"""Validate structural invariants of a Parallax product experiment plan.

This validator never authorises user exposure, production changes, or execution.
"""

from __future__ import annotations

import json
import math
import sys
from pathlib import Path
from typing import Any


VALIDATION_SCOPE = "structural-only"
EXECUTION_AUTHORISED = False

EPISTEMIC_STATUSES = {
    "validated",
    "provisional",
    "inconclusive",
    "insufficient-evidence",
    "declined",
    "reopened",
    "superseded",
}
LIFECYCLE_STATES = {
    "draft",
    "ready-to-run",
    "running",
    "paused",
    "completed",
    "blocked",
    "cancelled",
    "analysed",
    "closed",
}

RANDOMISED_FAMILIES = {
    "randomised-ab",
    "randomised-abn",
    "factorial-randomised",
    "cluster-randomised",
    "switchback-randomised",
    "geo-randomised",
    "randomised-holdout",
    "encouragement-randomised",
}
QUASI_FAMILIES = {
    "quasi-regression-discontinuity",
    "quasi-interrupted-time-series",
    "quasi-difference-in-differences",
    "quasi-synthetic-control",
    "quasi-matched-comparison",
    "quasi-cluster-comparison",
}
REQUIRED_CLUSTER_SENSITIVITIES = {
    "cluster-count",
    "cluster-size-variation",
    "intraclass-correlation",
    "cluster-dropout",
}

REQUIRED: dict[str, type | tuple[type, ...]] = {
    "artifact_id": str,
    "artifact_type": str,
    "schema_version": str,
    "inquiry_id": str,
    "inquiry_revision": int,
    "artifact_revision": int,
    "protocol_revision": int,
    "status": str,
    "lifecycle_state": str,
    "created_at": str,
    "created_by.kind": str,
    "created_by.identifier": str,
    "producing_skill.name": str,
    "producing_skill.version": str,
    "execution_context.run_id": str,
    "execution_context.mode": str,
    "execution_context.host": str,
    "execution_context.independence": str,
    "inputs": list,
    "permissions_and_scope.permitted_operations": list,
    "permissions_and_scope.excluded_operations": list,
    "permissions_and_scope.authority_source": str,
    "identity.basis_ids": list,
    "identity.scale_regions": list,
    "identity.method_pass_ids": list,
    "identity.domain_profiles": list,
    "assumptions": list,
    "uncertainties": list,
    "provenance.sources": list,
    "provenance.transformations": list,
    "validity_domain": str,
    "defeaters": list,
    "reopen_when": list,
    "readiness.nonblocking_gaps": list,
    "readiness.rationale": (str, type(None)),
    "composition.mode": str,
    "composition.template_ref": str,
    "composition.composition_contract_ref": str,
    "composition.general_base_contract": str,
    "composition.shared_field_authority": dict,
    "composition.consistency_checks": list,
    "decision_context.decision": str,
    "decision_context.intended_user_value": str,
    "decision_context.practical_success_threshold": str,
    "claim.hypothesis": str,
    "claim.theory_of_change": str,
    "claim.alternatives": list,
    "estimand.population": str,
    "estimand.conditions": list,
    "estimand.outcome": str,
    "estimand.summary_measure": str,
    "estimand.assignment_or_exposure_effect": str,
    "assignment.unit": str,
    "assignment.identifier": str,
    "assignment.eligibility": str,
    "assignment.exposure_event": str,
    "assignment.analysis_population": str,
    "assignment.reassignment_policy": str,
    "design.family": str,
    "design.assignment_mode": str,
    "design.comparison": dict,
    "design.identification": dict,
    "variants": list,
    "scale_context": list,
    "bridge_claims": list,
    "crosswalk_claims": list,
    "metrics.primary": list,
    "metrics.guardrails": list,
    "metrics.data_quality": list,
    "sizing.smallest_effect_of_interest": str,
    "sizing.criterion": str,
    "sizing.baseline_or_variance": str,
    "sizing.planned_duration": str,
    "sizing.sensitivity_scenarios": list,
    "inference.primary_estimator": str,
    "inference.monitoring_policy": str,
    "inference.multiplicity_policy": str,
    "inference.missing_data": str,
    "integrity.srm_check": dict,
    "integrity.exposure_validation": str,
    "integrity.concurrent_experiments": str,
    "integrity.interference": str,
    "integrity.novelty_seasonality_carryover": str,
    "affected_parties.groups": list,
    "affected_parties.accessibility": str,
    "affected_parties.privacy_and_basis": str,
    "affected_parties.safeguarding_and_harms": list,
    "protocol_control.frozen_at": (str, type(None)),
    "protocol_control.decision_rules_frozen": bool,
    "protocol_control.amendment_policy": str,
    "rollout.owner": str,
    "rollout.stages": list,
    "rollout.stop_rules": list,
    "rollout.rollback": str,
    "world_return.predictions": list,
    "world_return.observation_windows": list,
    "world_return.owner": str,
    "world_return.thresholds": list,
    "world_return.reopen_conditions": list,
    "critique.counterdesign": str,
    "critique.failure_modes": list,
    "critique.independent_audit": str,
    "practice_handoff.learning_signal": str,
}

ALLOW_EMPTY_PATHS = {
    "inputs",
    "assumptions",
    "uncertainties",
    "provenance.sources",
    "provenance.transformations",
    "design.comparison",
    # Non-randomised families deliberately have no treatment arms.  The
    # family-specific validator below requires two or more variants whenever
    # random allocation is part of the design.
    "variants",
    "crosswalk_claims",
    "protocol_control.frozen_at",
    "readiness.nonblocking_gaps",
    "readiness.rationale",
}

READY_REQUIRED_ROOTS = (
    "artifact_id",
    "inquiry_id",
    "created_at",
    "created_by",
    "execution_context",
    "permissions_and_scope",
    "identity",
    "validity_domain",
    "defeaters",
    "reopen_when",
    "readiness",
    "composition",
    "decision_context",
    "claim",
    "estimand",
    "assignment",
    "design",
    "variants",
    "scale_context",
    "bridge_claims",
    "metrics",
    "sizing",
    "inference",
    "integrity",
    "affected_parties",
    "protocol_control",
    "rollout",
    "world_return",
    "critique",
)


def at(document: dict[str, Any], path: str) -> Any:
    value: Any = document
    for key in path.split("."):
        if not isinstance(value, dict) or key not in value:
            raise KeyError(path)
        value = value[key]
    return value


def nonempty(value: Any) -> bool:
    if isinstance(value, (str, list, dict)):
        return bool(value)
    return value is not None


def is_number(value: Any) -> bool:
    return isinstance(value, (int, float)) and not isinstance(value, bool)


def is_placeholder(value: Any) -> bool:
    return isinstance(value, str) and value.strip().lower().startswith("todo:")


def placeholder_paths(value: Any, path: str) -> list[str]:
    found: list[str] = []
    if is_placeholder(value):
        return [path]
    if isinstance(value, dict):
        for key, child in value.items():
            found.extend(placeholder_paths(child, f"{path}.{key}" if path else key))
    elif isinstance(value, list):
        for index, child in enumerate(value):
            found.extend(placeholder_paths(child, f"{path}[{index}]"))
    return found


def validate_status_lifecycle(document: dict[str, Any], errors: list[str]) -> None:
    status = document.get("status")
    lifecycle = document.get("lifecycle_state")
    if status not in EPISTEMIC_STATUSES:
        errors.append(f"status must be one of: {', '.join(sorted(EPISTEMIC_STATUSES))}")
    if lifecycle not in LIFECYCLE_STATES:
        errors.append(f"lifecycle_state must be one of: {', '.join(sorted(LIFECYCLE_STATES))}")
    if lifecycle in {"ready-to-run", "running"} and status not in {"validated", "provisional"}:
        errors.append(f"{lifecycle} requires epistemic status validated or provisional")
    if status in {"declined", "superseded"} and lifecycle not in {"completed", "cancelled", "closed"}:
        errors.append(f"status {status} requires a completed, cancelled, or closed lifecycle")
    if status == "reopened" and lifecycle != "draft":
        errors.append("status reopened requires lifecycle_state draft")


def validate_revisions(document: dict[str, Any], errors: list[str]) -> None:
    for field in ("inquiry_revision", "artifact_revision", "protocol_revision"):
        value = document.get(field)
        if not isinstance(value, int) or isinstance(value, bool) or value < 1:
            errors.append(f"{field} must be an integer of at least 1")


def validate_composition(document: dict[str, Any], errors: list[str]) -> None:
    composition = document.get("composition", {})
    mode = composition.get("mode")
    if mode not in {"standalone-product", "product-overlay"}:
        errors.append("composition.mode must be standalone-product or product-overlay")
    if composition.get("template_ref") != "assets/product-experiment-plan.template.json":
        errors.append("composition.template_ref must identify the local product template")
    if composition.get("composition_contract_ref") != "references/composition-contract.md":
        errors.append("composition.composition_contract_ref must identify the local contract")
    if composition.get("general_base_contract") != "parallax-design-experiment/experimental-design/v0.1":
        errors.append("composition.general_base_contract has an unsupported value")

    required_checks = {
        "identity-and-revisions",
        "decision-claim-estimand",
        "scale-bridges-and-crosswalks",
        "world-return",
    }
    checks = composition.get("consistency_checks", [])
    if not isinstance(checks, list) or not required_checks.issubset(set(checks)):
        errors.append("composition.consistency_checks must cover every shared field group")

    authority = composition.get("shared_field_authority", {})
    required_authority = {
        "common-envelope",
        "decision-claim-estimand",
        "scale-bridges-and-crosswalks",
        "world-return",
        "product-assignment-metrics-integrity-rollout",
    }
    if not isinstance(authority, dict) or set(authority) != required_authority:
        errors.append("composition.shared_field_authority must declare all authority groups")
        return

    base_ref = composition.get("base_experiment_artifact_ref")
    if mode == "standalone-product":
        if base_ref is not None:
            errors.append("standalone-product must not claim a base experiment artifact")
        if any(authority.get(group) != "this-artifact" for group in required_authority):
            errors.append("standalone-product must own every shared field group")
    elif mode == "product-overlay":
        if not isinstance(base_ref, str) or not base_ref or is_placeholder(base_ref):
            errors.append("product-overlay requires a resolved base_experiment_artifact_ref")
        for group in required_authority - {"product-assignment-metrics-integrity-rollout"}:
            if authority.get(group) != "base-experiment":
                errors.append(f"product-overlay must assign {group} authority to base-experiment")
        if authority.get("product-assignment-metrics-integrity-rollout") != "this-artifact":
            errors.append("product-overlay must own product-specific fields")
        inputs = document.get("inputs", [])
        base_input = next(
            (
                item
                for item in inputs
                if isinstance(item, dict) and item.get("artifact_id") == base_ref
            ),
            None,
        )
        if base_input is None:
            errors.append("product-overlay inputs must reference the base experiment artifact")
        else:
            if base_input.get("artifact_type") != "experimental-design":
                errors.append("the product-overlay base input must have artifact_type experimental-design")
            if base_input.get("schema_version") != "parallax/experimental-design/0.1":
                errors.append("the product-overlay base input must identify the supported general schema")
            for field in ("artifact_revision", "inquiry_revision", "protocol_revision"):
                value = base_input.get(field)
                if not isinstance(value, int) or isinstance(value, bool) or value < 1:
                    errors.append(f"the product-overlay base input requires an exact positive {field}")
            if base_input.get("inquiry_id") != document.get("inquiry_id"):
                errors.append("product overlay and base input must share inquiry_id")
            if base_input.get("inquiry_revision") != document.get("inquiry_revision"):
                errors.append("product overlay and base input must share inquiry_revision")
            if base_input.get("protocol_revision") != document.get("protocol_revision"):
                errors.append("product overlay and base input must share protocol_revision")
        evidence = composition.get("consistency_evidence")
        if not isinstance(evidence, dict):
            errors.append("product-overlay requires consistency_evidence")
        else:
            for group in required_checks:
                check = evidence.get(group)
                if not isinstance(check, dict) or check.get("status") != "verified":
                    errors.append(f"composition consistency evidence for {group} must be verified")
                    continue
                for field in ("base_value_digest", "checked_at", "checked_by"):
                    if not nonempty(check.get(field)) or is_placeholder(check.get(field)):
                        errors.append(f"composition consistency evidence {group}.{field} must be resolved")


def validate_scales_and_bridges(document: dict[str, Any], errors: list[str], warnings: list[str]) -> None:
    regions = set(document.get("identity", {}).get("scale_regions", []))
    scale_fields = {
        "scale_region_id",
        "dimension",
        "assignment",
        "exposure",
        "measurement",
        "analysis",
        "inference",
        "world_return",
    }
    for index, scale in enumerate(document.get("scale_context", [])):
        if not isinstance(scale, dict):
            errors.append(f"scale_context[{index}] must be an object")
            continue
        missing = sorted(scale_fields - set(scale))
        if missing:
            errors.append(f"scale_context[{index}] is missing: {', '.join(missing)}")
        if scale.get("scale_region_id") not in regions:
            errors.append(f"scale_context[{index}].scale_region_id must reference identity.scale_regions")

    bridge_fields = {
        "from",
        "to",
        "relationship",
        "assumptions",
        "supporting_evidence",
        "challenging_evidence",
        "uncertainty",
        "validity_domain",
        "reopen_when",
    }
    bridges = document.get("bridge_claims", [])
    if not bridges:
        warnings.append("no metric-to-outcome or experiment-to-rollout bridge claims are recorded")
    for index, bridge in enumerate(bridges):
        if not isinstance(bridge, dict):
            errors.append(f"bridge_claims[{index}] must be an object")
            continue
        missing = sorted(bridge_fields - set(bridge))
        if missing:
            errors.append(f"bridge_claims[{index}] is missing: {', '.join(missing)}")


def validate_variants(variants: Any, errors: list[str]) -> None:
    if not isinstance(variants, list) or len(variants) < 2:
        errors.append("randomised product experiments require at least control and treatment variants")
        return
    allocations: list[float] = []
    seen: set[str] = set()
    for index, variant in enumerate(variants):
        if not isinstance(variant, dict):
            errors.append(f"variants[{index}] must be an object")
            continue
        for field in ("id", "allocation", "description"):
            if field not in variant:
                errors.append(f"variants[{index}] is missing: {field}")
        variant_id = variant.get("id")
        if isinstance(variant_id, str):
            if variant_id in seen:
                errors.append(f"duplicate variant id: {variant_id}")
            seen.add(variant_id)
        allocation = variant.get("allocation")
        if not is_number(allocation) or not 0 < allocation < 1:
            errors.append(f"variants[{index}].allocation must be numeric and between 0 and 1")
        else:
            allocations.append(float(allocation))
    if len(allocations) == len(variants) and not math.isclose(sum(allocations), 1.0, abs_tol=1e-9):
        errors.append("variant allocations must sum to 1")


def validate_design_family(document: dict[str, Any], errors: list[str]) -> None:
    design = document.get("design", {})
    family = design.get("family")
    assignment_mode = design.get("assignment_mode")
    srm = document.get("integrity", {}).get("srm_check", {})

    if family in RANDOMISED_FAMILIES:
        if assignment_mode != "randomised":
            errors.append("randomised design families require design.assignment_mode randomised")
        validate_variants(document.get("variants"), errors)
        allocation = document.get("assignment", {}).get("allocation_mechanism")
        if not nonempty(allocation):
            errors.append("randomised product experiments require a resolved assignment.allocation_mechanism")
        if not isinstance(srm, dict) or srm.get("enabled") is not True:
            errors.append("randomised product experiments require integrity.srm_check.enabled true")
        else:
            for field in ("threshold_and_family", "diagnostic_owner"):
                if not nonempty(srm.get(field)):
                    errors.append(f"integrity.srm_check.{field} is required for randomised designs")
    elif family in QUASI_FAMILIES:
        if assignment_mode != "non-randomised":
            errors.append("quasi-experimental families require design.assignment_mode non-randomised")
        comparison = design.get("comparison", {})
        for field in ("treated_or_exposed", "counterfactual", "timing", "selection_mechanism"):
            if not isinstance(comparison, dict) or not nonempty(comparison.get(field)):
                errors.append(f"quasi-experimental designs require design.comparison.{field}")
        identification = design.get("identification", {})
        for field in ("assumptions", "diagnostics", "falsification_tests", "estimand_limitations"):
            value = identification.get(field) if isinstance(identification, dict) else None
            if not isinstance(value, list) or not value:
                errors.append(f"quasi-experimental designs require non-empty design.identification.{field}")
        if not isinstance(srm, dict) or srm.get("enabled") is not False:
            errors.append("quasi-experimental designs require integrity.srm_check.enabled false")
        elif not nonempty(srm.get("not_applicable_rationale")) or is_placeholder(srm.get("not_applicable_rationale")):
            errors.append("disabled SRM requires a resolved not_applicable_rationale")
    else:
        errors.append("design.family is not a supported randomised or quasi-experimental family")


def validate_cluster_contract(document: dict[str, Any], errors: list[str]) -> None:
    family = str(document.get("design", {}).get("family", "")).lower()
    if "cluster" not in family:
        return
    cluster = document.get("design", {}).get("cluster_design")
    if not isinstance(cluster, dict):
        errors.append("cluster designs require design.cluster_design")
        return

    count = cluster.get("cluster_count", {})
    if not isinstance(count, dict) or not isinstance(count.get("total"), int) or isinstance(count.get("total"), bool) or count.get("total", 0) < 2:
        errors.append("cluster_design.cluster_count.total must be an integer of at least 2")
    per_condition = count.get("per_condition") if isinstance(count, dict) else None
    if not isinstance(per_condition, dict) or not per_condition or any(
        not isinstance(value, int) or isinstance(value, bool) or value < 1 for value in per_condition.values()
    ):
        errors.append("cluster_design.cluster_count.per_condition must contain positive integer counts")
    elif isinstance(count.get("total"), int) and not isinstance(count.get("total"), bool) and sum(per_condition.values()) != count["total"]:
        errors.append("cluster_design.cluster_count.per_condition must sum to cluster_count.total")

    size = cluster.get("cluster_size", {})
    for field in ("mean", "minimum", "maximum", "coefficient_of_variation"):
        if not isinstance(size, dict) or not is_number(size.get(field)) or size[field] < 0:
            errors.append(f"cluster_design.cluster_size.{field} must be numeric and non-negative")
    if isinstance(size, dict) and all(is_number(size.get(field)) for field in ("mean", "minimum", "maximum")):
        if not 0 < size["minimum"] <= size["mean"] <= size["maximum"]:
            errors.append("cluster size must satisfy 0 < minimum <= mean <= maximum")

    icc = cluster.get("intraclass_correlation", {})
    estimate = icc.get("estimate") if isinstance(icc, dict) else None
    plausible_range = icc.get("plausible_range") if isinstance(icc, dict) else None
    if not is_number(estimate) or not 0 <= estimate < 1:
        errors.append("cluster_design.intraclass_correlation.estimate must be numeric in [0, 1)")
    if not isinstance(plausible_range, list) or len(plausible_range) != 2 or not all(is_number(value) for value in plausible_range):
        errors.append("cluster_design.intraclass_correlation.plausible_range must contain two numeric bounds")
    elif not 0 <= plausible_range[0] <= plausible_range[1] < 1 or is_number(estimate) and not plausible_range[0] <= estimate <= plausible_range[1]:
        errors.append("ICC estimate and range must satisfy 0 <= lower <= estimate <= upper < 1")
    if not isinstance(icc, dict) or not nonempty(icc.get("source")) or is_placeholder(icc.get("source")):
        errors.append("cluster_design.intraclass_correlation.source must be resolved")

    dropout = cluster.get("dropout", {})
    for field in ("cluster_rate", "unit_rate"):
        value = dropout.get(field) if isinstance(dropout, dict) else None
        if not is_number(value) or not 0 <= value < 1:
            errors.append(f"cluster_design.dropout.{field} must be numeric in [0, 1)")

    recruitment = cluster.get("recruitment_timing", {})
    if not isinstance(recruitment, dict) or recruitment.get("relative_to_randomisation") not in {"before", "after", "mixed"}:
        errors.append("cluster_design.recruitment_timing.relative_to_randomisation must be before, after, or mixed")
    if not isinstance(recruitment, dict) or not nonempty(recruitment.get("selection_bias_mitigation")) or is_placeholder(recruitment.get("selection_bias_mitigation")):
        errors.append("cluster_design.recruitment_timing.selection_bias_mitigation must be resolved")

    sensitivities = cluster.get("sensitivity_dimensions", [])
    if not isinstance(sensitivities, list) or not REQUIRED_CLUSTER_SENSITIVITIES.issubset(set(sensitivities)):
        errors.append("cluster_design.sensitivity_dimensions must cover count, size variation, ICC, and dropout")

    analysis = cluster.get("dependence_aware_analysis", {})
    for field in ("model", "small_sample_correction", "unit_of_inference"):
        if not isinstance(analysis, dict) or not nonempty(analysis.get(field)) or is_placeholder(analysis.get(field)):
            errors.append(f"cluster_design.dependence_aware_analysis.{field} must be resolved")


def validate_ready(document: dict[str, Any], errors: list[str]) -> None:
    if document.get("lifecycle_state") != "ready-to-run":
        return
    for root in READY_REQUIRED_ROOTS:
        try:
            value = at(document, root)
        except KeyError:
            continue
        for path in placeholder_paths(value, root):
            errors.append(f"ready-to-run contains unresolved template placeholder: {path}")

    if document.get("status") == "provisional":
        readiness = document.get("readiness", {})
        gaps = readiness.get("nonblocking_gaps") if isinstance(readiness, dict) else None
        rationale = readiness.get("rationale") if isinstance(readiness, dict) else None
        if not isinstance(gaps, list) or not gaps:
            errors.append("provisional ready-to-run requires explicit readiness.nonblocking_gaps")
        if not nonempty(rationale) or is_placeholder(rationale):
            errors.append("provisional ready-to-run requires a resolved readiness.rationale")

    approvals = document.get("affected_parties", {}).get("approvals", {})
    if not isinstance(approvals, dict) or not approvals:
        errors.append("ready-to-run requires affected_parties.approvals")
    else:
        unresolved = [key for key, value in approvals.items() if value not in {"approved", "not-required-with-rationale"}]
        if unresolved:
            errors.append(f"ready-to-run has unresolved approvals: {', '.join(sorted(unresolved))}")

    protocol = document.get("protocol_control", {})
    if not nonempty(protocol.get("frozen_at")) or is_placeholder(protocol.get("frozen_at")):
        errors.append("ready-to-run requires protocol_control.frozen_at")
    if protocol.get("decision_rules_frozen") is not True:
        errors.append("ready-to-run requires protocol_control.decision_rules_frozen true")

    for path in ("rollout.owner", "rollout.incident_owner", "world_return.owner"):
        try:
            value = at(document, path)
        except KeyError:
            errors.append(f"ready-to-run requires {path}")
            continue
        if not nonempty(value) or is_placeholder(value):
            errors.append(f"ready-to-run requires resolved {path}")


def validate(document: dict[str, Any]) -> tuple[list[str], list[str]]:
    errors: list[str] = []
    warnings: list[str] = []

    for path, expected_type in REQUIRED.items():
        try:
            value = at(document, path)
        except KeyError:
            errors.append(f"missing required field: {path}")
            continue
        if not isinstance(value, expected_type) or isinstance(value, bool) and expected_type is int:
            errors.append(f"{path} has the wrong type")
        elif path not in ALLOW_EMPTY_PATHS and not nonempty(value):
            errors.append(f"{path} must not be empty")

    if document.get("artifact_type") != "product-experiment-protocol":
        errors.append("artifact_type must be product-experiment-protocol")
    if document.get("schema_version") != "parallax/product-experiment-protocol/0.1":
        errors.append("schema_version must be parallax/product-experiment-protocol/0.1")
    if document.get("producing_skill", {}).get("name") != "parallax-product-experiment":
        errors.append("producing_skill.name must be parallax-product-experiment")
    profiles = document.get("identity", {}).get("domain_profiles", [])
    if not isinstance(profiles, list) or "digital-product-service" not in profiles:
        errors.append("identity.domain_profiles must include digital-product-service")

    validate_status_lifecycle(document, errors)
    validate_revisions(document, errors)
    validate_composition(document, errors)
    validate_scales_and_bridges(document, errors, warnings)
    validate_design_family(document, errors)
    validate_cluster_contract(document, errors)

    primary = document.get("metrics", {}).get("primary", [])
    if isinstance(primary, list) and len(primary) > 1 and not nonempty(document.get("inference", {}).get("multiplicity_policy")):
        errors.append("multiple primary metrics require inference.multiplicity_policy")
    variants = document.get("variants", [])
    if isinstance(variants, list) and len(variants) > 2 and not nonempty(document.get("inference", {}).get("multiplicity_policy")):
        errors.append("more than two variants require inference.multiplicity_policy")

    variance_reduction = document.get("inference", {}).get("variance_reduction", {})
    if isinstance(variance_reduction, dict) and variance_reduction.get("enabled") is True:
        covariates = variance_reduction.get("pre_assignment_covariates")
        if not isinstance(covariates, list) or not covariates:
            errors.append("enabled variance reduction requires pre_assignment_covariates")

    monitoring = str(document.get("inference", {}).get("monitoring_policy", "")).lower()
    visible = document.get("integrity", {}).get("effect_results_visible_during_run")
    if "fixed-horizon" in monitoring:
        if visible is True:
            errors.append("fixed-horizon inference cannot expose effect results for outcome-dependent decisions during the run")
        elif visible is not False:
            errors.append("fixed-horizon inference requires an explicit integrity.effect_results_visible_during_run: false")

    permissions = document.get("permissions_and_scope", {})
    raw_excluded = permissions.get("excluded_operations", []) if isinstance(permissions, dict) else []
    if not isinstance(raw_excluded, list):
        raw_excluded = []
    if any(not isinstance(item, str) for item in raw_excluded):
        errors.append("permissions_and_scope.excluded_operations entries must all be strings")
    excluded = {item for item in raw_excluded if isinstance(item, str)}
    if not {"user-exposure", "production-change", "execution"}.issubset(excluded):
        errors.append("permissions_and_scope must exclude user exposure, production change, and execution")

    validate_ready(document, errors)
    return errors, warnings


def report(errors: list[str], warnings: list[str]) -> dict[str, Any]:
    return {
        "scope": VALIDATION_SCOPE,
        "execution_authorised": EXECUTION_AUTHORISED,
        "structurally_valid": not errors,
        "valid": not errors,
        "errors": errors,
        "warnings": warnings,
    }


def main() -> int:
    if len(sys.argv) != 2:
        print(json.dumps(report([f"usage: {Path(sys.argv[0]).name} PRODUCT_EXPERIMENT_PLAN.json"], []), indent=2))
        return 2
    path = Path(sys.argv[1])
    try:
        document = json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        print(json.dumps(report([f"file not found: {path}"], []), indent=2))
        return 1
    except (OSError, json.JSONDecodeError) as exc:
        print(json.dumps(report([str(exc)], []), indent=2))
        return 1
    if not isinstance(document, dict):
        print(json.dumps(report(["plan root must be a JSON object"], []), indent=2))
        return 1

    errors, warnings = validate(document)
    print(json.dumps(report(errors, warnings), indent=2))
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
