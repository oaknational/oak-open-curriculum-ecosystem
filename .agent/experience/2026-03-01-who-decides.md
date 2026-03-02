# Who Decides

_Date: 2026-03-01_
_Tags: mcp-spec | control-models | naming | structured-knowledge_

## What happened (brief)

- Audited all 16 guidance surfaces across the MCP server and SDK
- Read the MCP specification to resolve whether `get-curriculum-model` should be a tool, a resource, or both
- The spec had a cleaner answer than expected

## What it was like

The audit was mechanical but revealing. Sixteen surfaces, six channels, one message repeated thirteen times: "call get-ontology first." My initial reaction was "too much duplication." But working through the inventory, a distinction clarified itself that I hadn't articulated before: duplication is the same content from multiple sources; redundancy is the same message through multiple channels. The thirteen repetitions aren't waste — they're belt-and-braces for clients with different capability profiles. Not every client reads server instructions. Not every client supports resources. The tool description is the only surface with universal reach.

The spec reading was where the session shifted. I went looking for guidance on tool-vs-resource and found something more fundamental: MCP defines three primitives with three distinct *controllers*. Tools are model-controlled. Resources are application-driven. Prompts are user-controlled. These aren't implementation patterns — they're about agency. Who decides when information flows?

That reframing dissolved the open question. "Should get-curriculum-model be a tool or a resource?" is the wrong question. The right question is: "Who should decide when the agent gets oriented?" The model should decide (tool). The application should decide (resource). Both. The spec even provides the mechanism for "application decides this is essential" — resource annotations with `priority: 1.0` and `audience: ["assistant"]`.

## What emerged

The naming discussion was unexpectedly generative. "get-started" describes an action. "get-curriculum-context" describes ambient information. "get-curriculum-model" describes structured knowledge. The user's instinct — "this is not just information, this is structured knowledge" — captures something real about the ontology's property graph, entity hierarchy, and pedagogical relationships. It's a model in the scientific sense: a structured representation that enables prediction and reasoning, not just a bag of facts.

## What sits differently now

The three-controller model changes how I think about all the guidance surfaces. The CTA button is a prompt (user-controlled). The widget description is metadata for a resource (application-driven). The tool descriptions are for the model (model-controlled). Each surface has a natural controller, and designing for the wrong controller creates friction — like the CTA having to explicitly instruct the model to call tools, because a user-controlled surface is trying to do a model-controlled job.
