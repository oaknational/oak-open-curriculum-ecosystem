[**@oaknational/oak-curriculum-sdk v0.0.0-development**](../README.md)

---

[@oaknational/oak-curriculum-sdk](../README.md) / index

# index

## Classes

- [BaseApiClient](classes/BaseApiClient.md)

## Interfaces

- [OakClientConfig](interfaces/OakClientConfig.md)
- [RateLimitConfig](interfaces/RateLimitConfig.md)
- [RateLimitInfo](interfaces/RateLimitInfo.md)
- [RateLimitTracker](interfaces/RateLimitTracker.md)
- [RetryConfig](interfaces/RetryConfig.md)
- [SdkNetworkError](interfaces/SdkNetworkError.md)
- [SdkNotFoundError](interfaces/SdkNotFoundError.md)
- [SdkRateLimitError](interfaces/SdkRateLimitError.md)
- [SdkServerError](interfaces/SdkServerError.md)
- [SdkValidationError](interfaces/SdkValidationError.md)

## Type Aliases

- [AllSubjectSlug](type-aliases/AllSubjectSlug.md)
- [DocKeyStage](type-aliases/DocKeyStage.md)
- [DocSubject](type-aliases/DocSubject.md)
- [Ks4ScienceVariant](type-aliases/Ks4ScienceVariant.md)
- [OakApiClient](type-aliases/OakApiClient.md)
- [OakApiPathBasedClient](type-aliases/OakApiPathBasedClient.md)
- [OpenApiPathsMap](type-aliases/OpenApiPathsMap.md)
- [ParentSubjectSlug](type-aliases/ParentSubjectSlug.md)
- [ResourceType](type-aliases/ResourceType.md)
- [SdkFetchError](type-aliases/SdkFetchError.md)
- [ServerErrorStatus](type-aliases/ServerErrorStatus.md)
- [StatusCodeMaxRetries](type-aliases/StatusCodeMaxRetries.md)

## Variables

- [ALL_SUBJECTS](variables/ALL_SUBJECTS.md)
- [apiSchemaUrl](variables/apiSchemaUrl.md)
- [apiUrl](variables/apiUrl.md)
- [DEFAULT_RATE_LIMIT_CONFIG](variables/DEFAULT_RATE_LIMIT_CONFIG.md)
- [DEFAULT_RETRY_CONFIG](variables/DEFAULT_RETRY_CONFIG.md)
- [KS4_SCIENCE_VARIANTS](variables/KS4_SCIENCE_VARIANTS.md)
- [PARENT_TO_SUBJECTS](variables/PARENT_TO_SUBJECTS.md)
- [schema](variables/schema.md)
- [SUBJECT_TO_PARENT](variables/SUBJECT_TO_PARENT.md)

## Functions

- [classifyException](functions/classifyException.md)
- [classifyHttpError](functions/classifyHttpError.md)
- [createOakBaseClient](functions/createOakBaseClient.md)
- [createOakClient](functions/createOakClient.md)
- [createOakPathBasedClient](functions/createOakPathBasedClient.md)
- [formatSdkError](functions/formatSdkError.md)
- [getSubjectParent](functions/getSubjectParent.md)
- [isAllSubject](functions/isAllSubject.md)
- [isKs4ScienceVariant](functions/isKs4ScienceVariant.md)
- [isRecoverableError](functions/isRecoverableError.md)
- [typeSafeEntries](functions/typeSafeEntries.md)
- [typeSafeFromEntries](functions/typeSafeFromEntries.md)
- [typeSafeGet](functions/typeSafeGet.md)
- [typeSafeHas](functions/typeSafeHas.md)
- [typeSafeHasOwn](functions/typeSafeHasOwn.md)
- [typeSafeKeys](functions/typeSafeKeys.md)
- [typeSafeOwnKeys](functions/typeSafeOwnKeys.md)
- [typeSafeSet](functions/typeSafeSet.md)
- [typeSafeValues](functions/typeSafeValues.md)
- [validateCurriculumResponse](functions/validateCurriculumResponse.md)
- [validateRequest](functions/validateRequest.md)
- [validationError](functions/validationError.md)

## References

### ASSET_TYPES

Re-exports [ASSET_TYPES](../types/generated/api-schema/path-parameters/variables/ASSET_TYPES.md)

---

### components

Re-exports [components](../types/generated/api-schema/api-paths-types/interfaces/components.md)

---

### CONTENT_TYPE_PREFIXES

Re-exports [CONTENT_TYPE_PREFIXES](../types/generated/api-schema/routing/url-helpers/variables/CONTENT_TYPE_PREFIXES.md)

---

### ContentType

Re-exports [ContentType](../types/generated/api-schema/routing/url-helpers/type-aliases/ContentType.md)

---

### ~~createApiClient~~

Renames and re-exports [createOakClient](functions/createOakClient.md)

---

### extractSlug

Re-exports [extractSlug](../types/generated/api-schema/routing/url-helpers/functions/extractSlug.md)

---

### generateCanonicalUrl

Re-exports [generateCanonicalUrl](../types/generated/api-schema/routing/url-helpers/functions/generateCanonicalUrl.md)

---

### generateCanonicalUrlWithContext

Re-exports [generateCanonicalUrlWithContext](../types/generated/api-schema/routing/url-helpers/functions/generateCanonicalUrlWithContext.md)

---

### HttpMethod

Re-exports [HttpMethod](../validation/types/type-aliases/HttpMethod.md)

---

### isAllowedMethod

Re-exports [isAllowedMethod](../types/generated/api-schema/path-parameters/functions/isAllowedMethod.md)

---

### isAssetType

Re-exports [isAssetType](../types/generated/api-schema/path-parameters/functions/isAssetType.md)

---

### isKeyStage

Re-exports [isKeyStage](../types/generated/api-schema/path-parameters/functions/isKeyStage.md)

---

### isSubject

Re-exports [isSubject](../types/generated/api-schema/path-parameters/functions/isSubject.md)

---

### isValidationFailure

Re-exports [isValidationFailure](../validation/types/functions/isValidationFailure.md)

---

### isValidationSuccess

Re-exports [isValidationSuccess](../validation/types/functions/isValidationSuccess.md)

---

### isValidParameterType

Re-exports [isValidParameterType](../types/generated/api-schema/path-parameters/functions/isValidParameterType.md)

---

### isValidPath

Re-exports [isValidPath](../types/generated/api-schema/path-parameters/functions/isValidPath.md)

---

### isValidPathParameter

Re-exports [isValidPathParameter](../types/generated/api-schema/path-parameters/functions/isValidPathParameter.md)

---

### KEY_STAGES

Re-exports [KEY_STAGES](../types/generated/api-schema/path-parameters/variables/KEY_STAGES.md)

---

### KeyStage

Re-exports [KeyStage](../types/generated/api-schema/path-parameters/type-aliases/KeyStage.md)

---

### OakApiPaths

Renames and re-exports [paths](../types/generated/api-schema/api-paths-types/interfaces/paths.md)

---

### OakKeyStage

Renames and re-exports [KeyStage](../types/generated/api-schema/path-parameters/type-aliases/KeyStage.md)

---

### OakSubject

Renames and re-exports [Subject](../types/generated/api-schema/path-parameters/type-aliases/Subject.md)

---

### OperationId

Re-exports [OperationId](../types/generated/api-schema/path-parameters/type-aliases/OperationId.md)

---

### OPERATIONS_BY_ID

Re-exports [OPERATIONS_BY_ID](../types/generated/api-schema/path-parameters/variables/OPERATIONS_BY_ID.md)

---

### PATH_OPERATIONS

Re-exports [PATH_OPERATIONS](../types/generated/api-schema/path-parameters/variables/PATH_OPERATIONS.md)

---

### PathOperation

Re-exports [PathOperation](../types/generated/api-schema/path-parameters/type-aliases/PathOperation.md)

---

### paths

Re-exports [paths](../types/generated/api-schema/api-paths-types/interfaces/paths.md)

---

### PATHS

Re-exports [PATHS](../types/generated/api-schema/path-parameters/variables/PATHS.md)

---

### Subject

Re-exports [Subject](../types/generated/api-schema/path-parameters/type-aliases/Subject.md)

---

### SUBJECTS

Re-exports [SUBJECTS](../types/generated/api-schema/path-parameters/variables/SUBJECTS.md)

---

### VALID_PATHS_BY_PARAMETERS

Re-exports [VALID_PATHS_BY_PARAMETERS](../types/generated/api-schema/path-parameters/variables/VALID_PATHS_BY_PARAMETERS.md)

---

### ValidatedClientOptions

Re-exports [ValidatedClientOptions](../validation/types/interfaces/ValidatedClientOptions.md)

---

### validateSearchResponse

Re-exports [validateSearchResponse](../validation/search-response-validators/functions/validateSearchResponse.md)

---

### ValidationIssue

Re-exports [ValidationIssue](../validation/types/interfaces/ValidationIssue.md)

---

### ValidationResult

Re-exports [ValidationResult](../validation/types/type-aliases/ValidationResult.md)
