# Interface: IBlobStorageEntry

Interface describing a blob storage entry.

## Properties

### @context

> **@context**: \[`"https://schema.twindev.org/blob-storage/"`, `"https://schema.twindev.org/common/"`, `...IJsonLdContextDefinitionElement[]`\]

JSON-LD Context.

***

### type

> **type**: `"BlobStorageEntry"`

JSON-LD Type.

***

### id

> **id**: `string`

The id for the blob.

***

### dateCreated

> **dateCreated**: `string`

The date/time when the entry was created.
json-ld namespace:schema

***

### dateModified?

> `optional` **dateModified**: `string`

The date/time when the entry was modified.
json-ld namespace:schema

***

### blobSize

> **blobSize**: `number`

The size of the data in the blob.
json-ld type:schema:Integer

***

### integrity

> **integrity**: `string`

The integrity of the data in the blob.
json-ld namespace:twin-common

***

### encodingFormat?

> `optional` **encodingFormat**: `string`

The mime type for the blob.
json-ld namespace:schema

***

### isEncrypted?

> `optional` **isEncrypted**: `boolean`

Indicates if the blob is encrypted.
json-ld type:schema:Boolean

***

### compression?

> `optional` **compression**: [`BlobStorageCompressionType`](../type-aliases/BlobStorageCompressionType.md)

The type of compression used for the blob, if not set it is not stored with compression.
json-ld type:schema:Text

***

### fileExtension?

> `optional` **fileExtension**: `string`

The extension.
json-ld type:schema:Text

***

### metadata?

> `optional` **metadata**: `IJsonLdNodeObject`

The metadata for the blob as JSON-LD.
json-ld id

***

### blob?

> `optional` **blob**: `string`

The blob in base64 format, included if the includeContent flag was set in the request.
json-ld type:schema:Text
