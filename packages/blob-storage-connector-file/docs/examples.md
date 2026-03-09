# File Connector Examples

Use these snippets to store blobs on local disk for development, integration testing, or offline processing pipelines.

## FileBlobStorageConnector

```typescript
import { FileBlobStorageConnector } from '@twin.org/blob-storage-connector-file';

const connector = new FileBlobStorageConnector({
  config: {
    directory: './local-blob-store',
    extension: '.bin'
  },
  partitionContextIds: ['tenant', 'environment']
});

const bootstrapped = await connector.bootstrap();
console.log(bootstrapped); // true
console.log(connector.className()); // FileBlobStorageConnector
```

```typescript
import { Converter } from '@twin.org/core';
import { FileBlobStorageConnector } from '@twin.org/blob-storage-connector-file';

const connector = new FileBlobStorageConnector({
  config: {
    directory: './local-blob-store'
  }
});

const blobData = Converter.utf8ToBytes('Local connector payload');
const blobId = await connector.set(blobData);
console.log(blobId); // blob:urn:blob:file:...

const storedBlob = await connector.get(blobId);
console.log(storedBlob?.length); // 23

const removed = await connector.remove(blobId);
console.log(removed); // true
```
