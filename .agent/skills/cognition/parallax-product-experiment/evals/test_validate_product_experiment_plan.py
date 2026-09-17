"""Regression tests for the product experiment-plan structural validator."""

from __future__ import annotations

import importlib.util
import json
import unittest
from pathlib import Path


SKILL_ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location(
    "validate_product_experiment_plan", SKILL_ROOT / "scripts" / "validate_product_experiment_plan.py"
)
assert SPEC and SPEC.loader
VALIDATOR = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(VALIDATOR)


def template() -> dict:
    return json.loads((SKILL_ROOT / "assets" / "product-experiment-plan.template.json").read_text())


def cluster_contract() -> dict:
    return {
        "cluster_count": {"total": 30, "per_condition": {"control": 15, "treatment": 15}},
        "cluster_size": {"mean": 40, "minimum": 20, "maximum": 70, "coefficient_of_variation": 0.3},
        "intraclass_correlation": {"estimate": 0.06, "plausible_range": [0.02, 0.12], "source": "historical classroom outcome data"},
        "dropout": {"cluster_rate": 0.03, "unit_rate": 0.1},
        "recruitment_timing": {"relative_to_randomisation": "before", "selection_bias_mitigation": "freeze eligible classes before assignment"},
        "sensitivity_dimensions": ["cluster-count", "cluster-size-variation", "intraclass-correlation", "cluster-dropout"],
        "dependence_aware_analysis": {"model": "cluster-aware mixed model", "small_sample_correction": "Kenward-Roger", "unit_of_inference": "classroom"},
    }


class ProductExperimentPlanValidationTests(unittest.TestCase):
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
        for status, lifecycle in [
            ("validated", "paused"),
            ("provisional", "draft"),
            ("provisional", "ready-to-run"),
            ("inconclusive", "analysed"),
            ("insufficient-evidence", "completed"),
            ("declined", "cancelled"),
            ("reopened", "draft"),
            ("superseded", "closed"),
        ]:
            with self.subTest(status=status, lifecycle=lifecycle):
                plan = template()
                plan["status"] = status
                plan["lifecycle_state"] = lifecycle
                errors, _ = VALIDATOR.validate(plan)
                self.assertFalse(any("status must be" in error or "lifecycle_state must be" in error or "requires epistemic" in error for error in errors), errors)

    def test_cluster_family_requires_full_cluster_contract(self) -> None:
        plan = template()
        plan["design"]["family"] = "cluster-randomised"
        errors, _ = VALIDATOR.validate(plan)
        self.assertIn("cluster designs require design.cluster_design", errors)
        plan["design"]["cluster_design"] = cluster_contract()
        errors, _ = VALIDATOR.validate(plan)
        self.assertFalse(any("cluster_design" in error for error in errors), errors)
        plan["design"]["cluster_design"]["cluster_count"]["total"] = 29
        errors, _ = VALIDATOR.validate(plan)
        self.assertIn("cluster_design.cluster_count.per_condition must sum to cluster_count.total", errors)

    def test_quasi_interrupted_time_series_is_representable_without_srm(self) -> None:
        plan = template()
        plan["design"] = {
            "family": "quasi-interrupted-time-series",
            "assignment_mode": "non-randomised",
            "comparison": {
                "treated_or_exposed": "service observations after the intervention",
                "counterfactual": "projected pre-intervention level and trend",
                "timing": "weekly observations for 52 weeks before and 26 after",
                "selection_mechanism": "intervention begins at a fixed operational date"
            },
            "identification": {
                "assumptions": ["no coincident intervention explains the discontinuity"],
                "diagnostics": ["pre-trend, seasonality and autocorrelation diagnostics"],
                "falsification_tests": ["placebo interruption dates"],
                "estimand_limitations": ["effect is local to this service and implementation period"]
            },
            "cluster_design": None
        }
        plan["variants"] = []
        plan["assignment"]["allocation_mechanism"] = "not-applicable"
        plan["integrity"]["srm_check"] = {
            "enabled": False,
            "threshold_and_family": None,
            "diagnostic_owner": None,
            "not_applicable_rationale": "No random allocation exists in the interrupted time-series design"
        }
        errors, _ = VALIDATOR.validate(plan)
        self.assertEqual(errors, [])

    def test_product_profile_is_explicit(self) -> None:
        plan = template()
        plan["identity"]["domain_profiles"] = ["generic"]
        errors, _ = VALIDATOR.validate(plan)
        self.assertIn("identity.domain_profiles must include digital-product-service", errors)

    def test_non_string_excluded_operations_reports_error_instead_of_crashing(self) -> None:
        plan = template()
        plan["permissions_and_scope"]["excluded_operations"] = [
            "user-exposure",
            "production-change",
            "execution",
            {},
        ]
        errors, _ = VALIDATOR.validate(plan)
        self.assertIn(
            "permissions_and_scope.excluded_operations entries must all be strings", errors
        )

    def test_fixed_horizon_requires_explicit_visibility_false(self) -> None:
        plan = template()
        del plan["integrity"]["effect_results_visible_during_run"]
        errors, _ = VALIDATOR.validate(plan)
        self.assertIn(
            "fixed-horizon inference requires an explicit integrity.effect_results_visible_during_run: false",
            errors,
        )

    def test_fixed_horizon_still_rejects_visible_results(self) -> None:
        plan = template()
        plan["integrity"]["effect_results_visible_during_run"] = True
        errors, _ = VALIDATOR.validate(plan)
        self.assertIn(
            "fixed-horizon inference cannot expose effect results for outcome-dependent decisions during the run",
            errors,
        )


if __name__ == "__main__":
    unittest.main()
