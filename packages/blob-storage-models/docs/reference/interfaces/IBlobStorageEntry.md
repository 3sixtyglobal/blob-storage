# Interface: IBlobStorageEntry

Interface describing a blob storage entry.

## Properties

### @context {#context}

> **@context**: \[`"https://schema.3sixty.global/blob-storage/"`, `"https://schema.3sixty.global/common/"`, `...IJsonLdContextDefinitionElement[]`\]

JSON-LD Context.

***

### type {#type}

> **type**: `"BlobStorageEntry"`

JSON-LD Type.

***

### id {#id}

> **id**: `string`

The id for the blob.

***

### dateCreated {#datecreated}

> **dateCreated**: `string`

The date/time when the entry was created.

***

### dateModified? {#datemodified}

> `optional` **dateModified?**: `string`

The date/time when the entry was modified.

***

### blobSize {#blobsize}

> **blobSize**: `number`

The size of the data in the blob.

***

### integrity {#integrity}

> **integrity**: `string`

The integrity of the data in the blob.

***

### encodingFormat? {#encodingformat}

> `optional` **encodingFormat?**: `string`

The mime type for the blob.

***

### isEncrypted? {#isencrypted}

> `optional` **isEncrypted?**: `boolean`

Indicates if the blob is encrypted.

***

### compression? {#compression}

> `optional` **compression?**: [`BlobStorageCompressionType`](../type-aliases/BlobStorageCompressionType.md)

The type of compression used for the blob, if not set it is not stored with compression.

***

### fileExtension? {#fileextension}

> `optional` **fileExtension?**: `string`

The extension.

***

### metadata? {#metadata}

> `optional` **metadata?**: `IJsonLdNodeObject`

The metadata for the blob as JSON-LD.

***

### blob? {#blob}

> `optional` **blob?**: `string`

The blob in base64 format, included if the includeContent flag was set in the request.
