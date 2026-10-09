# REST Client Examples

Use these snippets to create, query, and manage blobs through HTTP endpoints with strongly typed requests and responses.

## BlobStorageRestClient

```typescript
import { BlobStorageRestClient } from '@3sixty/blob-storage-rest-client';

const client = new BlobStorageRestClient({
  endpoint: 'https://api.example.com',
  pathPrefix: '/v1'
});

console.log(client.className()); // BlobStorageRestClient
```

```typescript
import { BlobStorageRestClient } from '@3sixty/blob-storage-rest-client';

const client = new BlobStorageRestClient({
  endpoint: 'https://api.example.com',
  pathPrefix: '/v1'
});

const blobId = await client.create(
  'SGVsbG8gVFdJTiE=',
  'text/plain',
  'txt',
  {
    '@context': 'https://schema.org',
    type: 'DigitalDocument',
    name: 'greeting'
  },
  {
    disableEncryption: false,
    namespace: 'tenant-a'
  }
);
console.log(blobId); // blob:urn:blob:...

const blobEntry = await client.get(blobId, { includeContent: true, decompress: true });
console.log(blobEntry.encodingFormat); // text/plain

await client.update(blobId, 'text/plain', 'txt', {
  '@context': 'https://schema.org',
  type: 'DigitalDocument',
  name: 'greeting-v2'
});
console.log(blobId); // blob:urn:blob:...
```

```typescript
import {
  type EntityCondition,
  ComparisonOperator,
  LogicalOperator,
  SortDirection
} from '@3sixty/entity';
import type { IBlobStorageEntry } from '@3sixty/blob-storage-models';
import { BlobStorageRestClient } from '@3sixty/blob-storage-rest-client';

const client = new BlobStorageRestClient({
  endpoint: 'https://api.example.com',
  pathPrefix: '/v1'
});

const conditions: EntityCondition<IBlobStorageEntry> = {
  logicalOperator: LogicalOperator.And,
  conditions: [
    {
      property: 'encodingFormat',
      comparison: ComparisonOperator.Equals,
      value: 'text/plain'
    }
  ]
};

const queryResult = await client.query(conditions, 'dateCreated', SortDirection.Descending, '', 25);
console.log(queryResult.entries.itemListElement.length); // 1
console.log(queryResult.cursor); // eyJwYWdlIjoyfQ==
```

```typescript
import { BlobStorageRestClient } from '@3sixty/blob-storage-rest-client';

const client = new BlobStorageRestClient({
  endpoint: 'https://api.example.com',
  pathPrefix: '/v1'
});

const blobId = 'blob:urn:blob:file:4ef42bb1b8d31f0c';
const downloadLink = client.createDownloadLink(blobId, true, 'report.txt');
console.log(downloadLink); // https://api.example.com/v1/blob/blob:urn:blob:file:4ef42bb1b8d31f0c/content?download=true&filename=report.txt

await client.remove(blobId);
console.log(blobId); // blob:urn:blob:file:4ef42bb1b8d31f0c
```
