# AWS S3 Connector Examples

Use these snippets to configure cloud storage quickly and validate read and write behaviour in a development environment.

## S3BlobStorageConnector

```typescript
import { S3BlobStorageConnector } from '@3sixty/blob-storage-connector-aws-s3';

const connector = new S3BlobStorageConnector({
  config: {
    region: 'eu-central-1',
    bucketName: 'blob-storage-dev',
    authMode: 'credentials',
    accessKeyId: 'AKIAEXAMPLEKEY',
    secretAccessKey: 'exampleSecretKey'
  },
  partitionContextIds: ['tenant', 'environment']
});

const bootstrapped = await connector.bootstrap();
console.log(bootstrapped); // true
console.log(connector.className()); // S3BlobStorageConnector
```

```typescript
import { Converter } from '@3sixty/core';
import { S3BlobStorageConnector } from '@3sixty/blob-storage-connector-aws-s3';

const connector = new S3BlobStorageConnector({
  config: {
    region: 'eu-central-1',
    bucketName: 'blob-storage-dev',
    authMode: 'pod'
  }
});

const blobData = Converter.utf8ToBytes('Quarterly report');
const blobId = await connector.set(blobData);
console.log(blobId); // blob:urn:blob:s3:...

const storedBlob = await connector.get(blobId);
console.log(storedBlob?.length); // 16

const removed = await connector.remove(blobId);
console.log(removed); // true
```
