# GCP Connector Examples

Use these snippets to create a bucket-backed flow for storing and retrieving binary payloads with deterministic identifiers.

## GcpBlobStorageConnector

```typescript
import { GcpBlobStorageConnector } from '@twin.org/blob-storage-connector-gcp';

const connector = new GcpBlobStorageConnector({
  config: {
    projectId: 'blob-project',
    bucketName: 'blob-storage-dev'
  },
  partitionContextIds: ['tenant', 'environment']
});

const bootstrapped = await connector.bootstrap();
console.log(bootstrapped); // true
console.log(connector.className()); // GcpBlobStorageConnector
```

```typescript
import { Converter } from '@twin.org/core';
import { GcpBlobStorageConnector } from '@twin.org/blob-storage-connector-gcp';

const connector = new GcpBlobStorageConnector({
  config: {
    projectId: 'blob-project',
    bucketName: 'blob-storage-dev'
  }
});

const blobData = Converter.utf8ToBytes('GCP payload');
const blobId = await connector.set(blobData);
console.log(blobId); // blob:urn:blob:gcp:...

const storedBlob = await connector.get(blobId);
console.log(storedBlob?.length); // 11

const removed = await connector.remove(blobId);
console.log(removed); // true
```
