# Azure Connector Examples

Use these examples to connect to a container, store binary data, and verify retrieval and deletion with predictable identifiers.

## AzureBlobStorageConnector

```typescript
import { AzureBlobStorageConnector } from '@3sixty/blob-storage-connector-azure';

const connector = new AzureBlobStorageConnector({
  config: {
    accountName: 'storageaccount',
    accountKey: 'base64AccountKey',
    containerName: 'blob-storage-dev'
  },
  partitionContextIds: ['tenant', 'environment']
});

const bootstrapped = await connector.bootstrap();
console.log(bootstrapped); // true
console.log(connector.className()); // AzureBlobStorageConnector
```

```typescript
import { Converter } from '@3sixty/core';
import { AzureBlobStorageConnector } from '@3sixty/blob-storage-connector-azure';

const connector = new AzureBlobStorageConnector({
  config: {
    accountName: 'storageaccount',
    accountKey: 'base64AccountKey',
    containerName: 'blob-storage-dev'
  }
});

const blobData = Converter.utf8ToBytes('Blob payload');
const blobId = await connector.set(blobData);
console.log(blobId); // blob:urn:blob:azure:...

const storedBlob = await connector.get(blobId);
console.log(storedBlob?.length); // 12

const removed = await connector.remove(blobId);
console.log(removed); // true
```
