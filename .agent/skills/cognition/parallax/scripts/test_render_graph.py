"""Regression tests for the graph-to-Mermaid renderer's ID encoding."""

from __future__ import annotations

import importlib.util
import unittest
from pathlib import Path


TOOLS_ROOT = Path(__file__).resolve().parent
SPEC = importlib.util.spec_from_file_location(
    "render_graph", TOOLS_ROOT / "render_graph.py"
)
assert SPEC and SPEC.loader
RENDERER = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(RENDERER)


class SafeIdTests(unittest.TestCase):
    def test_distinct_ids_stay_distinct(self) -> None:
        pairs = [
            ("a-b", "a_b"),
            ("a.b", "a-b"),
            ("a.b", "a_b"),
            ("x__y", "x-_y"),
            ("frame:core", "frame_core"),
        ]
        for left, right in pairs:
            with self.subTest(left=left, right=right):
                self.assertNotEqual(RENDERER.safe_id(left), RENDERER.safe_id(right))

    def test_equal_ids_stay_equal(self) -> None:
        for value in ["frame", "design-experiment", "a_b", "café"]:
            with self.subTest(value=value):
                self.assertEqual(RENDERER.safe_id(value), RENDERER.safe_id(value))

    def test_ids_are_valid_mermaid_identifiers(self) -> None:
        for value in ["frame", "a-b", "a b", "café", "x/y", "1st"]:
            with self.subTest(value=value):
                self.assertRegex(RENDERER.safe_id(value), r"^[A-Za-z0-9_]+$")

    def test_alphanumeric_ids_render_unchanged(self) -> None:
        self.assertEqual(RENDERER.safe_id("frame1"), "n_frame1")


if __name__ == "__main__":
    unittest.main()
