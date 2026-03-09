# IPFS Connector Examples

Use these snippets to pin content, read it back by identifier, and remove it when it is no longer required.

## IpfsBlobStorageConnector

```typescript
import { IpfsBlobStorageConnector } from '@twin.org/blob-storage-connector-ipfs';

const connector = new IpfsBlobStorageConnector({
  config: {
    apiUrl: 'http://127.0.0.1:5001/api/v0',
    bearerToken: 'dev-access-token'
  }
});

console.log(connector.className()); // IpfsBlobStorageConnector
```

```typescript
import { Converter } from '@twin.org/core';
import { IpfsBlobStorageConnector } from '@twin.org/blob-storage-connector-ipfs';

const connector = new IpfsBlobStorageConnector({
  config: {
    apiUrl: 'http://127.0.0.1:5001/api/v0'
  }
});

const blobData = Converter.utf8ToBytes('IPFS payload');
const blobId = await connector.set(blobData);
console.log(blobId); // blob:urn:blob:ipfs:...

const storedBlob = await connector.get(blobId);
console.log(storedBlob?.length); // 12

const removed = await connector.remove(blobId);
console.log(removed); // true
```
