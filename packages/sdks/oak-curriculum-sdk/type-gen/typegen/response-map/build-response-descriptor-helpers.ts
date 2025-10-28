import type { ResponseMapEntry } from './build-response-map.js';

interface DescriptorInfo {
  readonly status: string;
  readonly key: string;
}

export function buildResponseDescriptorHelpers(entries: readonly ResponseMapEntry[]): string {
  const wildcardEntries = new Map<string, DescriptorInfo>();
  const explicitEntries = new Map<string, DescriptorInfo[]>();

  for (const entry of entries) {
    const descriptorKey = `${entry.operationId}:${entry.status}`;
    const descriptorInfo: DescriptorInfo = {
      status: entry.status,
      key: descriptorKey,
    };

    if (entry.operationId === '*') {
      wildcardEntries.set(entry.status, descriptorInfo);
      continue;
    }

    const items = explicitEntries.get(entry.operationId) ?? [];
    items.push(descriptorInfo);
    explicitEntries.set(entry.operationId, items);
  }

  const operations = Array.from(explicitEntries.keys()).sort((left, right) =>
    left.localeCompare(right),
  );

  const descriptorBlocks = operations
    .map((operationId) => {
      const wildcardStatuses = Array.from(wildcardEntries.values());
      const operationSpecific = explicitEntries.get(operationId) ?? [];

      const statusMap = new Map<string, DescriptorInfo>();

      for (const descriptor of wildcardStatuses) {
        statusMap.set(descriptor.status, descriptor);
      }

      const sortedSpecific = [...operationSpecific].sort((a, b) =>
        compareStatuses(a.status, b.status),
      );
      for (const descriptor of sortedSpecific) {
        statusMap.set(descriptor.status, descriptor);
      }

      const statusEntries = Array.from(statusMap.values())
        .sort((a, b) => compareStatuses(a.status, b.status))
        .map((descriptor) => {
          const statusLiteral = formatStatusKey(descriptor.status);
          return `    ${statusLiteral}: Object.freeze({
      zod: RESPONSE_SCHEMA_BY_OPERATION_ID_AND_STATUS['${descriptor.key}'].schema,
      json: RESPONSE_SCHEMA_BY_OPERATION_ID_AND_STATUS['${descriptor.key}'].jsonSchema,
    }),`;
        })
        .join('\n');

      return `  '${operationId}': Object.freeze({
${statusEntries}
  }),`;
    })
    .join('\n');

  return `
interface ResponseDescriptorRecord { readonly zod: CurriculumSchemaDefinition; readonly json: unknown; }

const RESPONSE_DESCRIPTORS_BY_OPERATION_ID = Object.freeze({
${descriptorBlocks}
}) as Readonly<Record<OperationId, Readonly<Record<string, ResponseDescriptorRecord>>>>;

export function getResponseDescriptorsByOperationId(operationId: OperationId): Readonly<Record<string, ResponseDescriptorRecord>> {
  const record = RESPONSE_DESCRIPTORS_BY_OPERATION_ID[operationId];
  if (!record) {
    throw new TypeError('No response descriptors for operationId: ' + String(operationId));
  }
  return record;
}
`;
}

function compareStatuses(left: string, right: string): number {
  const leftNumber = Number(left);
  const rightNumber = Number(right);
  const leftIsNumber = Number.isFinite(leftNumber);
  const rightIsNumber = Number.isFinite(rightNumber);

  if (leftIsNumber && rightIsNumber) {
    return leftNumber - rightNumber;
  }
  if (leftIsNumber) {
    return -1;
  }
  if (rightIsNumber) {
    return 1;
  }
  return left.localeCompare(right);
}

function formatStatusKey(status: string): string {
  return /^[0-9]+$/.test(status) ? String(Number(status)) : `'${status}'`;
}
