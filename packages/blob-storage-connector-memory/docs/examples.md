# Memory Connector Examples

Use these snippets to test fast in-memory blob workflows where you want deterministic behaviour without external dependencies.

## MemoryBlobStorageConnector

```typescript
import { MemoryBlobStorageConnector } from '@twin.org/blob-storage-connector-memory';

const connector = new MemoryBlobStorageConnector({
  partitionContextIds: ['tenant', 'environment']
});

console.log(connector.className()); // MemoryBlobStorageConnector
```

```typescript
import { Converter } from '@twin.org/core';
import { MemoryBlobStorageConnector } from '@twin.org/blob-storage-connector-memory';

const connector = new MemoryBlobStorageConnector();

const blobData = Converter.utf8ToBytes('Memory payload');
const blobId = await connector.set(blobData);
console.log(blobId); // blob:urn:blob:memory:...

const storedBlob = await connector.get(blobId);
console.log(storedBlob?.length); // 14

const currentStore = connector.getStore();
console.log(Object.keys(currentStore).length); // 1

const removed = await connector.remove(blobId);
console.log(removed); // true
```
