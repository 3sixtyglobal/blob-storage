# Service Examples

Use these snippets to create metadata-rich entries, retrieve stored content, and keep catalogue data consistent over time.

## BlobStorageService

```typescript
import { BlobStorageService } from '@3sixty/blob-storage-service';

const service = new BlobStorageService({
  config: {
    defaultNamespace: 'memory',
    vaultKeyId: 'tenant-main'
  }
});

console.log(service.className()); // BlobStorageService
```

```typescript
import { BlobStorageService } from '@3sixty/blob-storage-service';

const service = new BlobStorageService({
  config: {
    defaultNamespace: 'memory'
  }
});

const blobId = await service.create(
  'SGVsbG8gVFdJTiE=',
  'text/plain',
  'txt',
  {
    '@context': 'https://schema.org',
    type: 'DigitalDocument',
    name: 'welcome-note'
  },
  {
    disableEncryption: true,
    namespace: 'memory'
  }
);
console.log(blobId); // blob:urn:blob:memory:...

const blobEntry = await service.get(blobId, { includeContent: true, decompress: true });
console.log(blobEntry.blobSize); // 11
```

```typescript
import { BlobStorageService } from '@3sixty/blob-storage-service';

const service = new BlobStorageService({
  config: {
    defaultNamespace: 'memory'
  }
});

const blobId = 'blob:urn:blob:memory:7f83b1657ff1fc53';
await service.update(blobId, 'text/markdown', 'md', {
  '@context': 'https://schema.org',
  type: 'DigitalDocument',
  name: 'release-notes'
});
console.log(blobId); // blob:urn:blob:memory:7f83b1657ff1fc53

const result = await service.query(
  {
    logicalOperator: 'and',
    conditions: [
      {
        property: 'encodingFormat',
        comparison: 'equals',
        value: 'text/markdown'
      }
    ]
  },
  'dateCreated',
  'descending',
  'eyJwYWdlIjoyfQ==',
  10
);
console.log(result.entries.itemListElement.length); // 1

await service.remove(blobId);
console.log(blobId); // blob:urn:blob:memory:7f83b1657ff1fc53
```

## BlobStorageEntry

```typescript
import type { BlobStorageEntry } from '@3sixty/blob-storage-service';

const entry: BlobStorageEntry = {
  id: 'blob:urn:blob:memory:7f83b1657ff1fc53',
  dateCreated: '2026-03-09T12:00:00.000Z',
  blobSize: 2048,
  integrity: 'sha256:ab45f3f0c2b13496',
  encodingFormat: 'application/pdf',
  fileExtension: 'pdf',
  metadata: {
    '@context': 'https://schema.org',
    type: 'DigitalDocument',
    name: 'invoice-2026-03'
  },
  isEncrypted: false
};

console.log(entry.encodingFormat); // application/pdf
```
