"""Regression tests for the general experiment-plan structural validator."""

from __future__ import annotations

import importlib.util
import json
import unittest
from pathlib import Path


SKILL_ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location(
    "validate_experiment_plan", SKILL_ROOT / "scripts" / "validate_experiment_plan.py"
)
assert SPEC and SPEC.loader
VALIDATOR = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(VALIDATOR)


def template() -> dict:
    return json.loads((SKILL_ROOT / "assets" / "experiment-plan.template.json").read_text())


def cluster_contract() -> dict:
    return {
        "cluster_count": {"total": 24, "per_condition": {"control": 12, "treatment": 12}},
        "cluster_size": {"mean": 50, "minimum": 30, "maximum": 75, "coefficient_of_variation": 0.22},
        "intraclass_correlation": {"estimate": 0.08, "plausible_range": [0.04, 0.15], "source": "historical multi-school data"},
        "dropout": {"cluster_rate": 0.04, "unit_rate": 0.15},
        "recruitment_timing": {"relative_to_randomisation": "before", "selection_bias_mitigation": "eligibility and recruitment freeze before allocation"},
        "sensitivity_dimensions": ["cluster-count", "cluster-size-variation", "intraclass-correlation", "cluster-dropout"],
        "dependence_aware_analysis": {"model": "mixed model with cluster random effects", "small_sample_correction": "Kenward-Roger", "unit_of_inference": "school"},
    }


class ExperimentPlanValidationTests(unittest.TestCase):
    def test_supplied_draft_is_structurally_valid(self) -> None:
        errors, _ = VALIDATOR.validate(template())
        self.assertEqual(errors, [])

    def test_changing_only_lifecycle_to_ready_rejects_placeholders(self) -> None:
        plan = template()
        plan["lifecycle_state"] = "ready-to-run"
        errors, _ = VALIDATOR.validate(plan)
        self.assertGreater(len([error for error in errors if "unresolved template placeholder" in error]), 10)
        self.assertIn("provisional ready-to-run requires explicit readiness.nonblocking_gaps", errors)
        report = VALIDATOR.report(errors, [])
        self.assertEqual(report["scope"], "structural-only")
        self.assertFalse(report["execution_authorised"])

    def test_epistemic_status_and_lifecycle_are_separate(self) -> None:
        compatible = [
            ("validated", "draft"),
            ("provisional", "draft"),
            ("provisional", "ready-to-run"),
            ("inconclusive", "analysed"),
            ("insufficient-evidence", "analysed"),
            ("declined", "cancelled"),
            ("reopened", "draft"),
            ("superseded", "completed"),
        ]
        for status, lifecycle in compatible:
            with self.subTest(status=status, lifecycle=lifecycle):
                plan = template()
                plan["status"] = status
                plan["lifecycle_state"] = lifecycle
                errors, _ = VALIDATOR.validate(plan)
                self.assertFalse(any("status must be" in error or "lifecycle_state must be" in error or "requires epistemic" in error for error in errors), errors)

    def test_cluster_requires_real_numeric_contract(self) -> None:
        plan = template()
        plan["design"]["family"] = "cluster-randomised-parallel"
        errors, _ = VALIDATOR.validate(plan)
        self.assertIn("cluster designs require design.cluster_design", errors)
        plan["design"]["cluster_design"] = cluster_contract()
        errors, _ = VALIDATOR.validate(plan)
        self.assertFalse(any("cluster_design" in error for error in errors), errors)
        plan["design"]["cluster_design"]["cluster_count"]["total"] = 25
        errors, _ = VALIDATOR.validate(plan)
        self.assertIn("cluster_design.cluster_count.per_condition must sum to cluster_count.total", errors)
        plan["design"]["cluster_design"]["cluster_count"]["total"] = 24
        plan["design"]["cluster_design"]["intraclass_correlation"]["estimate"] = "not-applicable"
        errors, _ = VALIDATOR.validate(plan)
        self.assertTrue(any("intraclass_correlation.estimate" in error for error in errors))

    def test_general_product_composition_requires_resolved_overlay_identity(self) -> None:
        plan = template()
        plan["composition"]["mode"] = "general-base-for-product"
        plan["composition"]["product_overlay_artifact_refs"] = ["TODO: product overlay artifact"]
        errors, _ = VALIDATOR.validate(plan)
        self.assertIn("product_overlay_artifact_refs must contain resolved stable artifact identifiers", errors)
        plan["composition"]["product_overlay_artifact_refs"] = ["product-experiment-42"]
        errors, _ = VALIDATOR.validate(plan)
        self.assertFalse(any("product_overlay_artifact_refs" in error for error in errors), errors)

    def test_non_string_excluded_operations_reports_error_instead_of_crashing(self) -> None:
        plan = template()
        plan["permissions_and_scope"]["excluded_operations"] = [
            "participant-exposure",
            "data-collection",
            "execution",
            {},
        ]
        errors, _ = VALIDATOR.validate(plan)
        self.assertIn(
            "permissions_and_scope.excluded_operations entries must all be strings", errors
        )


if __name__ == "__main__":
    unittest.main()
