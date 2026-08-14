#!/usr/bin/env python3
"""Render a Parallax graph-manifest JSON file as Mermaid flowchart source."""

from __future__ import annotations

import json
import sys
from pathlib import Path


def safe_id(value: str) -> str:
    # Injective: ASCII alphanumerics pass through and every other character
    # becomes "_<hex codepoint>_"; "_" itself is escaped, so escape boundaries
    # are unambiguous and distinct source IDs never merge in the rendered graph.
    encoded = []
    for char in value:
        if char.isascii() and char.isalnum():
            encoded.append(char)
        else:
            encoded.append(f"_{ord(char):x}_")
    return "n_" + "".join(encoded)


def quoted(value: object) -> str:
    return json.dumps(str(value), ensure_ascii=False)


def main() -> int:
    if len(sys.argv) != 2:
        print("Usage: render_graph.py <graph.json>", file=sys.stderr)
        return 2
    path = Path(sys.argv[1])
    graph = json.loads(path.read_text(encoding="utf-8"))
    direction = graph.get("direction", "TD")
    nodes = graph.get("nodes", [])
    edges = graph.get("edges", [])

    print("```mermaid")
    print(f"flowchart {direction}")
    for node in nodes:
        node_id = safe_id(node["id"])
        label = quoted(node.get("label", node["id"]))
        shape = node.get("type", "")
        if shape == "artifact":
            print(f"    {node_id}[({label})]")
        elif shape in {"decision", "guard"}:
            print(f"    {node_id}{{{label}}}")
        else:
            print(f"    {node_id}[{label}]")
    for index, edge in enumerate(edges):
        relation = edge.get("type", "")
        label = f"|{relation}|" if relation else ""
        if "from" in edge and "to" in edge:
            print(f"    {safe_id(edge['from'])} -->{label} {safe_id(edge['to'])}")
            continue
        sources = edge.get("sources", [])
        targets = edge.get("targets", [])
        join_id = f"hyper_{index}"
        print(f"    {join_id}{{{quoted(relation or 'join')}}}")
        for source in sources:
            print(f"    {safe_id(source)} --> {join_id}")
        for target in targets:
            print(f"    {join_id} --> {safe_id(target)}")
    print("```")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
