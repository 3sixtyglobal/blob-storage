# Interface: IGcpBlobStorageConnectorConfig

Configuration for the GCP Blob Storage Connector.

## Properties

### projectId {#projectid}

> **projectId**: `string`

The GCP project ID.

***

### credentials? {#credentials}

> `optional` **credentials?**: `string`

The GCP credentials, a base64 encoded version of the JWTInput data type.

***

### bucketName {#bucketname}

> **bucketName**: `string`

The GCP bucket name.

***

### apiEndpoint? {#apiendpoint}

> `optional` **apiEndpoint?**: `string`

Optional endpoint for GCP Storage emulator.
