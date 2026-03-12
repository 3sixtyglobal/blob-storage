# Interface: IAzureBlobStorageConnectorConfig

Configuration for the Azure Blob Storage Connector.

## Properties

### accountName {#accountname}

> **accountName**: `string`

Storage account name.

***

### accountKey {#accountkey}

> **accountKey**: `string`

Account key.

***

### containerName {#containername}

> **containerName**: `string`

The Azure container name.

***

### endpoint? {#endpoint}

> `optional` **endpoint**: `string`

Endpoint defaults to `https://{accountName}.blob.core.windows.net/` where accountName will be
substituted.
