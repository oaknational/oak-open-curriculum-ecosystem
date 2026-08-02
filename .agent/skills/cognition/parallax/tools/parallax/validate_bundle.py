#!/usr/bin/env python3
"""Validate the canonical Parallax Practice bundle without third-party packages."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from typing import Any


EXPECTED_SKILLS = {
    "parallax",
    "parallax-frame",
    "parallax-design-inquiry",
    "parallax-design-experiment",
    "parallax-product-experiment",
    "parallax-synthesise",
    "parallax-decide",
    "parallax-audit",
    "parallax-learn",
}

NAME_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
LINK_RE = re.compile(r"(?<!!)\[[^\]]+\]\(([^)]+)\)")
YAML_TOP_LEVEL_RE = re.compile(r"^([A-Za-z_][A-Za-z0-9_-]*):(?:\s|$)")

COMMON_ARTIFACT_FIELDS = {
    "schema_version",
    "artifact_id",
    "artifact_type",
    "artifact_revision",
    "inquiry_id",
    "inquiry_revision",
    "status",
    "created_at",
    "created_by",
    "producing_skill",
    "execution_context",
    "inputs",
    "permissions_and_scope",
    "identity",
    "assumptions",
    "uncertainties",
    "provenance",
    "validity_domain",
    "defeaters",
    "reopen_when",
}

COMMON_IDENTITY_FIELDS = {
    "basis_ids",
    "scale_regions",
    "method_pass_ids",
    "domain_profiles",
}

COMMON_EXECUTION_CONTEXT_FIELDS = {"run_id", "mode", "independence", "host"}

COMMON_EPISTEMIC_STATUSES = {
    "validated",
    "provisional",
    "inconclusive",
    "insufficient-evidence",
    "declined",
    "reopened",
    "superseded",
}


def fail(errors: list[str], path: Path, message: str) -> None:
    errors.append(f"{path}: {message}")


def parse_frontmatter(path: Path, errors: list[str]) -> tuple[dict[str, Any], str]:
    text = path.read_text(encoding="utf-8")
    lines = text.splitlines()
    if not lines or lines[0].strip() != "---":
        fail(errors, path, "missing opening YAML frontmatter delimiter")
        return {}, text
    try:
        end = lines.index("---", 1)
    except ValueError:
        fail(errors, path, "missing closing YAML frontmatter delimiter")
        return {}, text

    metadata: dict[str, Any] = {}
    current_map: dict[str, str] | None = None
    index = 1
    while index < end:
        raw = lines[index]
        if not raw.strip() or raw.lstrip().startswith("#"):
            index += 1
            continue
        if raw.startswith("  ") and current_map is not None:
            key, sep, value = raw.strip().partition(":")
            if not sep:
                fail(errors, path, f"cannot parse frontmatter line: {raw!r}")
                index += 1
                continue
            current_map[key.strip()] = value.strip().strip('"\'')
            index += 1
            continue
        key, sep, value = raw.partition(":")
        if not sep:
            fail(errors, path, f"cannot parse frontmatter line: {raw!r}")
            index += 1
            continue
        key = key.strip()
        value = value.strip()
        if value in {">", ">-", "|", "|-"}:
            block: list[str] = []
            index += 1
            while index < end and (lines[index].startswith(" ") or not lines[index].strip()):
                block.append(lines[index].strip())
                index += 1
            separator = " " if value.startswith(">") else "\n"
            metadata[key] = separator.join(part for part in block if part)
            current_map = None
            continue
        if value:
            metadata[key] = value.strip('"\'')
            current_map = None
        else:
            nested: dict[str, str] = {}
            metadata[key] = nested
            current_map = nested
        index += 1
    return metadata, "\n".join(lines[end + 1 :])


def validate_local_links(path: Path, skill_root: Path, errors: list[str]) -> None:
    text = path.read_text(encoding="utf-8")
    for target in LINK_RE.findall(text):
        clean = target.split("#", 1)[0]
        if not clean or "://" in clean or clean.startswith("mailto:"):
            continue
        resolved = (path.parent / clean).resolve()
        try:
            resolved.relative_to(skill_root.resolve())
        except ValueError:
            fail(errors, path, f"local link escapes the independently installable skill: {target}")
            continue
        if not resolved.exists():
            fail(errors, path, f"broken local link: {target}")


def validate_trigger_file(path: Path, errors: list[str]) -> None:
    try:
        entries = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        fail(errors, path, f"invalid JSON: {exc}")
        return
    if not isinstance(entries, list) or not entries:
        fail(errors, path, "must contain a non-empty JSON array")
        return
    labels: set[bool] = set()
    for index, entry in enumerate(entries):
        if not isinstance(entry, dict) or not isinstance(entry.get("query"), str):
            fail(errors, path, f"entry {index} lacks a string query")
        if not isinstance(entry.get("should_trigger"), bool):
            fail(errors, path, f"entry {index} lacks a boolean should_trigger")
        else:
            labels.add(entry["should_trigger"])
    if labels != {False, True}:
        fail(errors, path, "must contain both should-trigger and should-not-trigger cases")


def yaml_direct_children(text: str, parent: str) -> set[str]:
    """Return two-space child keys from a simple top-level YAML mapping."""
    lines = text.splitlines()
    in_parent = False
    children: set[str] = set()
    for line in lines:
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        if not line.startswith((" ", "\t")):
            match = YAML_TOP_LEVEL_RE.match(line)
            in_parent = bool(match and match.group(1) == parent)
            continue
        if in_parent:
            match = re.match(r"^  ([A-Za-z_][A-Za-z0-9_-]*):(?:\s|$)", line)
            if match:
                children.add(match.group(1))
    return children


def yaml_nested_scalar(text: str, parent: str, child: str) -> str | None:
    lines = text.splitlines()
    in_parent = False
    for line in lines:
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        if not line.startswith((" ", "\t")):
            match = YAML_TOP_LEVEL_RE.match(line)
            in_parent = bool(match and match.group(1) == parent)
            continue
        if in_parent:
            match = re.match(
                rf"^  {re.escape(child)}:\s*(.*)$",
                line,
            )
            if match:
                return match.group(1).strip().strip('"\'')
    return None


def yaml_top_level_scalar(text: str, key: str) -> str | None:
    for line in text.splitlines():
        match = re.match(rf"^{re.escape(key)}:\s*(.*)$", line)
        if match:
            return match.group(1).strip().strip('"\'')
    return None


def validate_artifact_template(path: Path, skill_name: str, errors: list[str]) -> None:
    """Check the portable envelope without pretending to perform semantic validation."""
    text = path.read_text(encoding="utf-8")
    if path.suffix == ".json":
        try:
            artifact = json.loads(text)
        except json.JSONDecodeError:
            return  # The bundle-wide JSON pass reports the syntax error.
        if not isinstance(artifact, dict):
            fail(errors, path, "artifact template must be a mapping")
            return
        fields = set(artifact)
        identity = artifact.get("identity")
        execution_context = artifact.get("execution_context")
        producing_skill = artifact.get("producing_skill")
        status = artifact.get("status")
        schema_version = artifact.get("schema_version")
    else:
        fields = {
            match.group(1)
            for line in text.splitlines()
            if (match := YAML_TOP_LEVEL_RE.match(line))
        }
        identity = yaml_direct_children(text, "identity")
        execution_context = yaml_direct_children(text, "execution_context")
        producing_skill = {"name": yaml_nested_scalar(text, "producing_skill", "name")}
        status = yaml_top_level_scalar(text, "status")
        schema_version = yaml_top_level_scalar(text, "schema_version")

    missing = COMMON_ARTIFACT_FIELDS - fields
    if missing:
        fail(errors, path, f"common artifact envelope is missing: {sorted(missing)}")

    if not isinstance(schema_version, str) or not schema_version.strip():
        fail(errors, path, "schema_version must be a non-empty string")
    if status not in COMMON_EPISTEMIC_STATUSES:
        fail(errors, path, f"status is outside the common epistemic vocabulary: {status!r}")

    if isinstance(identity, dict):
        identity_fields = set(identity)
        for field in COMMON_IDENTITY_FIELDS & identity_fields:
            if not isinstance(identity[field], list):
                fail(errors, path, f"identity.{field} must be an array")
    elif isinstance(identity, set):
        identity_fields = identity
    else:
        identity_fields = set()
    missing_identity = COMMON_IDENTITY_FIELDS - identity_fields
    if missing_identity:
        fail(errors, path, f"identity is missing plural fields: {sorted(missing_identity)}")

    if isinstance(execution_context, dict):
        execution_fields = set(execution_context)
    elif isinstance(execution_context, set):
        execution_fields = execution_context
    else:
        execution_fields = set()
    missing_execution = COMMON_EXECUTION_CONTEXT_FIELDS - execution_fields
    if missing_execution:
        fail(errors, path, f"execution_context is missing: {sorted(missing_execution)}")

    producer = producing_skill.get("name") if isinstance(producing_skill, dict) else None
    if producer != skill_name:
        fail(errors, path, f"producing_skill.name {producer!r} does not match {skill_name!r}")


def validate_eval_suite(path: Path, errors: list[str], *, collection: bool = False) -> None:
    try:
        suite = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return  # A more specific JSON or missing-file error is reported elsewhere.
    if not isinstance(suite, dict):
        fail(errors, path, "evaluation suite must be an object")
        return
    if not isinstance(suite.get("skill_name"), str):
        fail(errors, path, "skill_name must be a string")
    cases = suite.get("evals")
    if not isinstance(cases, list) or not cases:
        fail(errors, path, "evals must be a non-empty array")
        return
    seen_ids: set[Any] = set()
    for index, case in enumerate(cases):
        if not isinstance(case, dict):
            fail(errors, path, f"evals[{index}] is not an object")
            continue
        case_id = case.get("id")
        if case_id is None or case_id in seen_ids:
            fail(errors, path, f"evals[{index}] has a missing or duplicate id")
        seen_ids.add(case_id)
        for field in ("prompt", "expected_output"):
            if not isinstance(case.get(field), str) or not case[field].strip():
                fail(errors, path, f"evals[{index}].{field} must be a non-empty string")
        assertions = case.get("assertions")
        if not isinstance(assertions, list) or not assertions or not all(
            isinstance(item, str) and item.strip() for item in assertions
        ):
            fail(errors, path, f"evals[{index}].assertions must be non-empty strings")
    if collection:
        metadata = suite.get("metadata")
        if not isinstance(metadata, dict) or metadata.get("scope") != "collection":
            fail(errors, path, "collection suite metadata.scope must be collection")


def validate_skill(skill_root: Path, errors: list[str]) -> None:
    canonical = skill_root / "SKILL-CANONICAL.md"
    if not canonical.is_file():
        fail(errors, skill_root, "missing SKILL-CANONICAL.md")
        return
    if (skill_root / "SKILL.md").exists():
        fail(errors, skill_root, "canonical Practice surface must remain non-discoverable")

    frontmatter, body = parse_frontmatter(canonical, errors)
    name = frontmatter.get("name")
    description = frontmatter.get("description")
    if name != skill_root.name:
        fail(errors, canonical, f"name {name!r} does not match parent directory")
    if not isinstance(name, str) or not NAME_RE.fullmatch(name):
        fail(errors, canonical, "name is not lower-case hyphen syntax")
    if not isinstance(description, str) or not description.strip():
        fail(errors, canonical, "description is missing")
    elif len(description) > 1024:
        fail(errors, canonical, f"description exceeds 1024 characters ({len(description)})")
    metadata = frontmatter.get("metadata")
    if not isinstance(metadata, dict) or metadata.get("owned") != "true":
        fail(errors, canonical, 'metadata.owned must be the string "true"')
    if len(body.splitlines()) > 500:
        fail(errors, canonical, "instruction body exceeds 500 lines")

    evals_path = skill_root / "evals" / "evals.json"
    try:
        evals = json.loads(evals_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        fail(errors, evals_path, f"invalid or missing evals JSON: {exc}")
    else:
        if evals.get("skill_name") != skill_root.name:
            fail(errors, evals_path, "skill_name does not match skill directory")
        cases = evals.get("evals")
        if not isinstance(cases, list) or len(cases) < 2:
            fail(errors, evals_path, "must define at least two behavioural evals")
        validate_eval_suite(evals_path, errors)

    for filename in ("trigger-train.json", "trigger-validation.json"):
        validate_trigger_file(skill_root / "evals" / filename, errors)

    assets_root = skill_root / "assets"
    for asset in sorted(assets_root.glob("*")) if assets_root.is_dir() else []:
        if asset.suffix in {".json", ".yaml", ".yml"}:
            validate_artifact_template(asset, skill_root.name, errors)

    for markdown in skill_root.rglob("*.md"):
        validate_local_links(markdown, skill_root, errors)


def validate_graph(path: Path, known_skills: set[str], errors: list[str]) -> None:
    try:
        graph = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        fail(errors, path, f"invalid JSON: {exc}")
        return
    if not isinstance(graph, dict) or not graph.get("graph_id"):
        return
    nodes = graph.get("nodes", [])
    edges = graph.get("edges", [])
    if not isinstance(nodes, list) or not isinstance(edges, list):
        fail(errors, path, "graph nodes and edges must be arrays")
        return
    node_ids = {node.get("id") for node in nodes if isinstance(node, dict)}
    if None in node_ids or len(node_ids) != len(nodes):
        fail(errors, path, "graph node IDs must be present and unique")
    for node in nodes:
        if isinstance(node, dict) and node.get("type") == "skill":
            skill_id = node.get("skill_id", node.get("label", node.get("id")))
            if skill_id not in known_skills:
                fail(errors, path, f"unknown skill node: {skill_id}")
    for index, edge in enumerate(edges):
        if not isinstance(edge, dict):
            fail(errors, path, f"edge {index} is not an object")
            continue
        endpoints = []
        if "from" in edge:
            endpoints.append(edge["from"])
        if "to" in edge:
            endpoints.append(edge["to"])
        endpoints.extend(edge.get("sources", []))
        endpoints.extend(edge.get("targets", []))
        for endpoint in endpoints:
            if endpoint not in node_ids:
                fail(errors, path, f"edge {index} references unknown node {endpoint!r}")


def validate_mermaid(path: Path, errors: list[str]) -> None:
    in_mermaid = False
    for line_number, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        stripped = line.strip()
        if not in_mermaid and stripped == "```mermaid":
            in_mermaid = True
        elif in_mermaid and stripped == "```":
            in_mermaid = False
    if in_mermaid:
        fail(errors, path, "unclosed Mermaid code fence")


def validate_manifest(
    path: Path, agent_root: Path, known_skills: set[str], errors: list[str]
) -> None:
    try:
        manifest = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        fail(errors, path, f"invalid or missing collection manifest: {exc}")
        return
    if manifest.get("collection") != "parallax":
        fail(errors, path, "collection must be parallax")
    if not isinstance(manifest.get("version"), str):
        fail(errors, path, "version must be a string")
    if manifest.get("vendor_adapters_included") is not False:
        fail(errors, path, "canonical bundle must declare vendor_adapters_included false")

    reference_root = path.parent
    declared_skills: set[str] = set()
    for index, entry in enumerate(manifest.get("skills", [])):
        if not isinstance(entry, dict):
            fail(errors, path, f"skills[{index}] is not an object")
            continue
        name = entry.get("name")
        declared_skills.add(name)
        target = entry.get("path")
        if not isinstance(target, str) or not (reference_root / target).resolve().is_dir():
            fail(errors, path, f"skills[{index}] path does not resolve: {target!r}")
    if declared_skills != known_skills:
        fail(errors, path, "manifest skill set does not match the bundle")

    for field in ("documentation", "graphs"):
        entries = manifest.get(field)
        if not isinstance(entries, list) or not entries:
            fail(errors, path, f"{field} must be a non-empty array")
            continue
        for entry in entries:
            if not isinstance(entry, str) or not (reference_root / entry).resolve().is_file():
                fail(errors, path, f"declared {field} file does not resolve: {entry!r}")

    evaluation_path = manifest.get("collection_evaluations")
    if not isinstance(evaluation_path, str) or not (reference_root / evaluation_path).resolve().is_dir():
        fail(errors, path, "collection_evaluations does not resolve to a directory")

    for field in ("evaluation_suites", "tools"):
        entries = manifest.get(field)
        if not isinstance(entries, list) or not entries:
            fail(errors, path, f"{field} must be a non-empty array")
            continue
        for entry in entries:
            if not isinstance(entry, str) or not (reference_root / entry).resolve().is_file():
                fail(errors, path, f"declared {field} file does not resolve: {entry!r}")

    declared_suites = manifest.get("evaluation_suites")
    if isinstance(declared_suites, list) and isinstance(evaluation_path, str):
        evaluation_root = (reference_root / evaluation_path).resolve()
        actual_suites = {
            suite.resolve() for suite in evaluation_root.rglob("evals.json")
        } if evaluation_root.is_dir() else set()
        resolved_declared = {
            (reference_root / entry).resolve()
            for entry in declared_suites
            if isinstance(entry, str)
        }
        if resolved_declared != actual_suites:
            fail(errors, path, "evaluation_suites does not exactly match collection evals.json files")

    try:
        reference_root.resolve().relative_to(agent_root.resolve())
    except ValueError:
        fail(errors, path, "manifest is outside the .agent package")


def main() -> int:
    script = Path(__file__).resolve()
    agent_root = script.parents[2]
    skills_root = agent_root / "skills"
    errors: list[str] = []

    actual_skills = {
        path.name for path in skills_root.iterdir() if path.is_dir() and not path.name.startswith(".")
    } if skills_root.is_dir() else set()
    missing = EXPECTED_SKILLS - actual_skills
    unexpected = actual_skills - EXPECTED_SKILLS
    if missing:
        fail(errors, skills_root, f"missing expected skills: {sorted(missing)}")
    if unexpected:
        fail(errors, skills_root, f"unexpected skills in bundle: {sorted(unexpected)}")
    for skill_name in sorted(EXPECTED_SKILLS & actual_skills):
        validate_skill(skills_root / skill_name, errors)

    reference_root = agent_root / "reference" / "parallax"
    if not (reference_root / "README.md").is_file():
        fail(errors, reference_root, "missing collection README.md")
    validate_manifest(reference_root / "manifest.json", agent_root, EXPECTED_SKILLS, errors)
    for json_path in agent_root.rglob("*.json"):
        try:
            json.loads(json_path.read_text(encoding="utf-8"))
        except json.JSONDecodeError as exc:
            fail(errors, json_path, f"invalid JSON: {exc}")
        if "reference/parallax" in json_path.as_posix():
            validate_graph(json_path, EXPECTED_SKILLS, errors)

    collection_evaluations = agent_root / "evaluations" / "parallax"
    for eval_path in collection_evaluations.rglob("evals.json") if collection_evaluations.exists() else []:
        validate_eval_suite(eval_path, errors, collection=True)

    for markdown in reference_root.rglob("*.md") if reference_root.exists() else []:
        validate_mermaid(markdown, errors)
        validate_local_links(markdown, agent_root, errors)

    generated_files = [
        path
        for path in agent_root.rglob("*")
        if path.name == "__pycache__" or path.suffix == ".pyc"
    ]
    if generated_files:
        fail(errors, agent_root, f"generated Python cache files are not distributable: {generated_files}")

    if errors:
        print(f"Parallax bundle validation failed with {len(errors)} error(s):", file=sys.stderr)
        for error in errors:
            print(f"- {error}", file=sys.stderr)
        return 1
    print(f"Parallax structural validation passed: {len(EXPECTED_SKILLS)} skills")
    print(
        "Checked manifest completeness, local links, JSON syntax, common artifact envelopes, "
        "evaluation shapes, graph endpoints, and Mermaid fence closure."
    )
    print("Not checked: epistemic truth, experiment execution, statistical correctness, or Mermaid rendering.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
