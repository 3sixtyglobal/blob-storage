# Models Examples

Use these snippets to register data types and resolve connector instances by namespace when composing storage workflows.

## BlobStorageDataTypes

```typescript
import { BlobStorageDataTypes } from '@3sixty/blob-storage-models';

BlobStorageDataTypes.registerTypes();
```

## BlobStorageConnectorFactory

```typescript
import { BlobStorageConnectorFactory } from '@3sixty/blob-storage-models';

const connectorNamespaces = BlobStorageConnectorFactory.names();
console.log(connectorNamespaces.length); // 2

const defaultConnector = BlobStorageConnectorFactory.get(connectorNamespaces[0]);
console.log(defaultConnector.className()); // MemoryBlobStorageConnector
```
