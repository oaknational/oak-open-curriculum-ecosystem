#!/usr/bin/env python3
"""Validate portable structural invariants of a Parallax experiment plan.

This validator never authorises participant exposure, data collection, or execution.
"""

from __future__ import annotations

import json
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
    "provenance.sources": list,
    "provenance.transformations": list,
    "assumptions": list,
    "uncertainties": list,
    "identity.basis_ids": list,
    "identity.scale_regions": list,
    "identity.method_pass_ids": list,
    "identity.domain_profiles": list,
    "permissions_and_scope.permitted_operations": list,
    "permissions_and_scope.excluded_operations": list,
    "permissions_and_scope.authority_source": str,
    "validity_domain": str,
    "defeaters": list,
    "reopen_when": list,
    "readiness.nonblocking_gaps": list,
    "readiness.rationale": (str, type(None)),
    "composition.mode": str,
    "composition.template_ref": str,
    "composition.composition_contract_ref": str,
    "composition.shared_field_authority": str,
    "composition.consistency_checks": list,
    "decision_context.decision": str,
    "claim.question_type": str,
    "claim.hypothesis": str,
    "claim.alternatives": list,
    "estimand.population": str,
    "estimand.conditions": list,
    "estimand.outcome": str,
    "estimand.summary_measure": str,
    "estimand.intercurrent_events": list,
    "scale_context": list,
    "bridge_claims": list,
    "crosswalk_claims": list,
    "design.family": str,
    "design.experimental_unit": str,
    "design.counterdesign": str,
    "design.identification_assumptions": list,
    "measurement.primary_outcomes": list,
    "measurement.harms_and_guardrails": list,
    "precision.target_effect_range": str,
    "precision.criterion": str,
    "precision.assumptions": dict,
    "precision.sensitivity_scenarios": list,
    "analysis.primary_estimator": str,
    "analysis.multiplicity_policy": str,
    "analysis.missing_data": str,
    "analysis.sensitivity_analyses": list,
    "ethics.review_required": str,
    "ethics.approval_status": str,
    "ethics.risks": list,
    "ethics.protections": list,
    "ethics.stop_rules": list,
    "preregistration.status": str,
    "preregistration.amendment_policy": str,
    "execution.owner": str,
    "world_return.predictions": list,
    "world_return.observation_windows": list,
    "world_return.owner": str,
    "world_return.thresholds": list,
    "world_return.reopen_conditions": list,
    "critique.failure_modes": list,
    "critique.independent_audit": str,
    "practice_handoff.learning_signal": str,
}

ALLOW_EMPTY_PATHS = {
    "inputs",
    "provenance.sources",
    "provenance.transformations",
    "assumptions",
    "uncertainties",
    "crosswalk_claims",
    "readiness.nonblocking_gaps",
    "readiness.rationale",
}

READY_REQUIRED_ROOTS = (
    "artifact_id",
    "inquiry_id",
    "created_at",
    "created_by",
    "execution_context",
    "identity",
    "permissions_and_scope",
    "validity_domain",
    "defeaters",
    "reopen_when",
    "readiness",
    "composition",
    "decision_context",
    "claim",
    "estimand",
    "scale_context",
    "bridge_claims",
    "design",
    "measurement",
    "precision",
    "analysis",
    "ethics",
    "preregistration",
    "execution",
    "world_return",
    "critique",
)

CLUSTER_FAMILY_TERMS = ("cluster", "stepped-wedge", "split-plot")
REQUIRED_CLUSTER_SENSITIVITIES = {
    "cluster-count",
    "cluster-size-variation",
    "intraclass-correlation",
    "cluster-dropout",
}


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
    if mode not in {"standalone-general", "general-base-for-product"}:
        errors.append("composition.mode must be standalone-general or general-base-for-product")
    if composition.get("template_ref") != "assets/experiment-plan.template.json":
        errors.append("composition.template_ref must identify the local experiment-plan template")
    if composition.get("composition_contract_ref") != "references/composition-contract.md":
        errors.append("composition.composition_contract_ref must identify the local contract")
    if composition.get("shared_field_authority") != "this-artifact":
        errors.append("the general experiment artifact must remain authoritative for shared fields")
    required_checks = {
        "identity-and-revisions",
        "decision-claim-estimand",
        "scale-bridges-and-crosswalks",
        "world-return",
    }
    checks = composition.get("consistency_checks", [])
    if not isinstance(checks, list) or not required_checks.issubset(set(checks)):
        errors.append("composition.consistency_checks must cover all shared field groups")
    overlays = composition.get("product_overlay_artifact_refs")
    if mode == "general-base-for-product":
        if not isinstance(overlays, list) or not overlays:
            errors.append("general-base-for-product requires product_overlay_artifact_refs")
        elif any(not isinstance(ref, str) or not ref or is_placeholder(ref) for ref in overlays):
            errors.append("product_overlay_artifact_refs must contain resolved stable artifact identifiers")
        elif len(overlays) != len(set(overlays)):
            errors.append("product_overlay_artifact_refs must not contain duplicates")


def validate_scales_and_bridges(document: dict[str, Any], errors: list[str], warnings: list[str]) -> None:
    scale_fields = {
        "scale_region_id",
        "dimension",
        "assignment",
        "intervention",
        "measurement",
        "analysis",
        "inference",
        "world_return",
    }
    regions = set(document.get("identity", {}).get("scale_regions", []))
    dimensions: set[str] = set()
    for index, scale in enumerate(document.get("scale_context", [])):
        if not isinstance(scale, dict):
            errors.append(f"scale_context[{index}] must be an object")
            continue
        missing = sorted(scale_fields - set(scale))
        if missing:
            errors.append(f"scale_context[{index}] is missing: {', '.join(missing)}")
        if scale.get("scale_region_id") not in regions:
            errors.append(f"scale_context[{index}].scale_region_id must reference scale_regions")
        dimension = scale.get("dimension")
        if isinstance(dimension, str):
            if dimension in dimensions:
                warnings.append(f"scale dimension appears more than once: {dimension}")
            dimensions.add(dimension)

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
        warnings.append("no bridge claims recorded; justify why no cross-scale inference is material")
    for index, bridge in enumerate(bridges):
        if not isinstance(bridge, dict):
            errors.append(f"bridge_claims[{index}] must be an object")
            continue
        missing = sorted(bridge_fields - set(bridge))
        if missing:
            errors.append(f"bridge_claims[{index}] is missing: {', '.join(missing)}")


def validate_cluster_contract(document: dict[str, Any], errors: list[str]) -> None:
    design = document.get("design", {})
    family = str(design.get("family", "")).lower()
    if not any(term in family for term in CLUSTER_FAMILY_TERMS):
        return
    cluster = design.get("cluster_design")
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

    approval = document.get("ethics", {}).get("approval_status")
    if approval not in {"approved", "not-required-with-rationale"}:
        errors.append("ready-to-run requires resolved ethics.approval_status")

    registration = document.get("preregistration", {})
    registration_status = registration.get("status")
    if registration_status == "registered":
        if not nonempty(registration.get("location")) or not nonempty(registration.get("locked_at")):
            errors.append("registered protocols require preregistration.location and locked_at")
    elif registration_status == "not-required-with-rationale":
        if not nonempty(registration.get("not_required_rationale")) or is_placeholder(registration.get("not_required_rationale")):
            errors.append("preregistration not-required status requires a resolved rationale")
    else:
        errors.append("ready-to-run requires preregistration.status registered or not-required-with-rationale")

    for path in ("execution.owner", "world_return.owner"):
        try:
            value = at(document, path)
        except KeyError:
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

    if document.get("artifact_type") != "experimental-design":
        errors.append("artifact_type must be experimental-design")
    if document.get("schema_version") != "parallax/experimental-design/0.1":
        errors.append("schema_version must be parallax/experimental-design/0.1")
    if document.get("producing_skill", {}).get("name") != "parallax-design-experiment":
        errors.append("producing_skill.name must be parallax-design-experiment")

    validate_status_lifecycle(document, errors)
    validate_revisions(document, errors)
    validate_composition(document, errors)
    validate_scales_and_bridges(document, errors, warnings)
    validate_cluster_contract(document, errors)

    design = document.get("design", {})
    family = str(design.get("family", "")).lower()
    adaptation = design.get("adaptation", {})
    if isinstance(adaptation, dict) and adaptation.get("enabled") is True:
        for field in ("rules", "simulation_plan"):
            if not nonempty(adaptation.get(field)) or is_placeholder(adaptation.get(field)):
                errors.append(f"adaptive designs require resolved adaptation.{field}")

    primary = document.get("measurement", {}).get("primary_outcomes", [])
    if isinstance(primary, list) and len(primary) > 1 and not nonempty(document.get("analysis", {}).get("multiplicity_policy")):
        errors.append("multiple primary outcomes require analysis.multiplicity_policy")

    if any(term in family for term in ("observational", "quasi", "natural")):
        identification = design.get("identification_assumptions", [])
        if not isinstance(identification, list) or not identification:
            errors.append("non-randomised designs require explicit identification_assumptions")

    permissions = document.get("permissions_and_scope", {})
    raw_excluded = permissions.get("excluded_operations", []) if isinstance(permissions, dict) else []
    if not isinstance(raw_excluded, list):
        raw_excluded = []
    if any(not isinstance(item, str) for item in raw_excluded):
        errors.append("permissions_and_scope.excluded_operations entries must all be strings")
    excluded = {item for item in raw_excluded if isinstance(item, str)}
    if not {"participant-exposure", "data-collection", "execution"}.issubset(excluded):
        errors.append("permissions_and_scope must exclude participant exposure, data collection, and execution")

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
        print(json.dumps(report([f"usage: {Path(sys.argv[0]).name} EXPERIMENT_PLAN.json"], []), indent=2))
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
