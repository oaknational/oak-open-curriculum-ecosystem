# OpenAPI Specification v3.1.2 Reference

> Source: <https://spec.openapis.org/oas/v3.1.2.html> (19 September 2025)

This document extracts the key sections of the OpenAPI Specification v3.1.2 relevant to our API enhancement proposals.

---

## Table of Contents

1. [Specification Extensions](#specification-extensions)
2. [Info Object](#info-object)
3. [Tag Object](#tag-object)
4. [Schema Object](#schema-object)
5. [Parameter Object](#parameter-object)
6. [Operation Object](#operation-object)
7. [Components Object](#components-object)

---

## Specification Extensions

> Section 4.9

While the OpenAPI Specification tries to accommodate most use cases, additional data can be added to extend the specification at certain points.

The extensions properties are implemented as patterned fields that are always prefixed by `x-`.

| Field Pattern | Type | Description |
|---------------|------|-------------|
| `^x-` | Any | Allows extensions to the OpenAPI Schema. The field name MUST begin with `x-`, for example, `x-internal-id`. Field names beginning `x-oai-` and `x-oas-` are reserved for uses defined by the OpenAPI Initiative. The value can be any valid JSON value (null, a primitive, an array, or an object.) |

**Key points:**

- Extensions can be added anywhere in the specification
- Support for any one extension is OPTIONAL
- Extensions are one of the best ways to prove the viability of proposed additions to the specification

---

## Info Object

> Section 4.8.2

The object provides metadata about the API. The metadata MAY be used by the clients if needed, and MAY be presented in editing or documentation generation tools for convenience.

### Fixed Fields

| Field Name | Type | Description |
|------------|------|-------------|
| title | string | **REQUIRED**. The title of the API. |
| summary | string | A short summary of the API. |
| description | string | A description of the API. CommonMark syntax MAY be used for rich text representation. |
| termsOfService | string | A URI for the Terms of Service for the API. |
| contact | Contact Object | The contact information for the exposed API. |
| license | License Object | The license information for the exposed API. |
| version | string | **REQUIRED**. The version of the OpenAPI Document. |

### Example

```yaml
title: Example Pet Store App
summary: A pet store manager.
description: This is an example server for a pet store.
termsOfService: https://example.com/terms/
contact:
  name: API Support
  url: https://www.example.com/support
  email: support@example.com
license:
  name: Apache 2.0
  url: https://www.apache.org/licenses/LICENSE-2.0.html
version: 1.0.1
```

---

## Tag Object

> Section 4.8.22

Adds metadata to a single tag that is used by the Operation Object.

### Fixed Fields

| Field Name | Type | Description |
|------------|------|-------------|
| name | string | **REQUIRED**. The name of the tag. |
| description | string | A description for the tag. CommonMark syntax MAY be used for rich text representation. |
| externalDocs | External Documentation Object | Additional external documentation for this tag. |

### Example

```yaml
name: pet
description: Pets operations
```

---

## Schema Object

> Section 4.8.24

The Schema Object allows the definition of input and output data types. This object is a superset of the JSON Schema Specification Draft 2020-12.

### Key Fields for Documentation

| Field Name | Type | Description |
|------------|------|-------------|
| description | string | CommonMark syntax MAY be used for rich text representation. Extended by OAS. |
| format | string | See Data Type Formats. Extended by OAS. |
| example | Any | **Deprecated**. Use `examples` instead. |
| examples | Array | JSON Schema keyword for providing examples. |
| discriminator | Discriminator Object | Adds support for polymorphism. |
| externalDocs | External Documentation Object | Additional external documentation for this schema. |

### Annotated Enumerations

The Schema Object's `enum` keyword does not allow associating descriptions with individual values. However, implementations MAY support recognizing a `oneOf` or `anyOf` where each subschema consists of a `const` keyword and annotations:

```yaml
oneOf:
  - const: RGB
    title: Red, Green, Blue
    description: Specify colors with the red, green, and blue additive color model
  - const: CMYK
    title: Cyan, Magenta, Yellow, Black
    description: Specify colors with the cyan, magenta, yellow, and black subtractive color model
```

---

## Parameter Object

> Section 4.8.12

Describes a single operation parameter.

### Fixed Fields

| Field Name | Type | Description |
|------------|------|-------------|
| name | string | **REQUIRED**. The name of the parameter. |
| in | string | **REQUIRED**. The location of the parameter: "query", "header", "path", or "cookie". |
| description | string | A brief description of the parameter. CommonMark syntax MAY be used. |
| required | boolean | Determines whether this parameter is mandatory. |
| deprecated | boolean | Specifies that a parameter is deprecated. Default: false. |
| allowEmptyValue | boolean | If true, allows zero-length string values. Default: false. |
| schema | Schema Object | The schema defining the type used for the parameter. |
| example | Any | Example of the parameter's potential value. |
| examples | Map[string, Example Object] | Examples of the parameter's potential value. |

### Example

```yaml
name: username
in: path
description: username to fetch
required: true
schema:
  type: string
```

---

## Operation Object

> Section 4.8.10

Describes a single API operation on a path.

### Fixed Fields

| Field Name | Type | Description |
|------------|------|-------------|
| tags | [string] | A list of tags for API documentation control. |
| summary | string | A short summary of what the operation does. |
| description | string | A verbose explanation of the operation behavior. CommonMark syntax MAY be used. |
| externalDocs | External Documentation Object | Additional external documentation for this operation. |
| operationId | string | Unique string used to identify the operation. |
| parameters | [Parameter Object \| Reference Object] | Parameters applicable for this operation. |
| requestBody | Request Body Object \| Reference Object | The request body applicable for this operation. |
| responses | Responses Object | The list of possible responses. |
| deprecated | boolean | Declares this operation to be deprecated. Default: false. |
| security | [Security Requirement Object] | Security mechanisms for this operation. |
| servers | [Server Object] | Alternative servers for this operation. |

### Example

```yaml
tags:
  - pet
summary: Updates a pet in the store with form data
operationId: updatePetWithForm
parameters:
  - name: petId
    in: path
    description: ID of pet that needs to be updated
    required: true
    schema:
      type: string
responses:
  '200':
    description: Pet updated.
```

---

## Components Object

> Section 4.8.7

Holds a set of reusable objects for different aspects of the OAS.

### Fixed Fields

| Field Name | Type | Description |
|------------|------|-------------|
| schemas | Map[string, Schema Object] | Reusable Schema Objects. |
| responses | Map[string, Response Object \| Reference Object] | Reusable Response Objects. |
| parameters | Map[string, Parameter Object \| Reference Object] | Reusable Parameter Objects. |
| examples | Map[string, Example Object \| Reference Object] | Reusable Example Objects. |
| requestBodies | Map[string, Request Body Object \| Reference Object] | Reusable Request Body Objects. |
| headers | Map[string, Header Object \| Reference Object] | Reusable Header Objects. |
| securitySchemes | Map[string, Security Scheme Object \| Reference Object] | Reusable Security Scheme Objects. |
| links | Map[string, Link Object \| Reference Object] | Reusable Link Objects. |
| callbacks | Map[string, Callback Object \| Reference Object] | Reusable Callback Objects. |
| pathItems | Map[string, Path Item Object] | Reusable Path Item Objects. |

All fixed fields use keys that MUST match: `^[a-zA-Z0-9\.\-_]+$`

---

## Key Takeaways for Our Proposals

### Standard Description Fields Available

1. **`info.summary`** - Short summary of the API (currently missing from Oak API spec)
2. **`info.description`** - Full description with CommonMark support (currently missing)
3. **`tags[].description`** - Description per tag (currently missing)
4. **`operation.summary`** - Short operation summary (used)
5. **`operation.description`** - Full operation description (used)
6. **`parameter.description`** - Parameter descriptions (used)
7. **`schema.description`** - Schema descriptions (used)

### Extension Fields (`x-*`)

Per section 4.9, we can propose custom extensions such as:

```yaml
# Example: Contextual guidance extension
x-oak-use-when: "Use this endpoint when you need to find lessons by subject"
x-oak-applies-to: ["ks3", "ks4"]
x-oak-related-endpoints:
  - /api/v1/lessons/{lessonSlug}
  - /api/v1/sequences/{sequenceSlug}
```

### Annotated Enums Pattern

For enums that need descriptions, the `oneOf` + `const` pattern is supported:

```yaml
# Instead of simple enum
subjectSlug:
  type: string
  enum: ["maths", "english", "science"]

# Use annotated pattern
subjectSlug:
  oneOf:
    - const: maths
      title: Mathematics
      description: Primary and secondary mathematics curriculum
    - const: english
      title: English
      description: English language and literature curriculum
    - const: science
      title: Science
      description: Combined and separate sciences curriculum
```

---

## References

- Full specification: https://spec.openapis.org/oas/v3.1.2.html
- OpenAPI Learning: https://learn.openapis.org/
- JSON Schema Draft 2020-12: https://json-schema.org/draft/2020-12/json-schema-core.html

### Zod 4 Metadata

- Zod metadata and registries: https://zod.dev/metadata
- **Note**: In Zod 4, [`.describe()` is deprecated](https://zod.dev/metadata#describe) in favour of `.meta({ description: "..." })`. The `.meta()` method supports richer metadata including `id`, `title`, `description`, `deprecated`, and arbitrary custom fields — aligning well with OpenAPI's extension model.
