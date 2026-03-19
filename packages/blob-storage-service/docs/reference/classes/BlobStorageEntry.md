# Class: BlobStorageEntry

Class representing entry for the blob storage.

## Constructors

### Constructor

> **new BlobStorageEntry**(): `BlobStorageEntry`

#### Returns

`BlobStorageEntry`

## Properties

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

The length of the data in the blob.

***

### integrity {#integrity}

> **integrity**: `string`

The integrity of the data in the blob.

***

### encodingFormat? {#encodingformat}

> `optional` **encodingFormat?**: `string`

The mime type for the blob.

***

### fileExtension? {#fileextension}

> `optional` **fileExtension?**: `string`

The extension.

***

### metadata? {#metadata}

> `optional` **metadata?**: `IJsonLdNodeObject`

The metadata for the blob as JSON-LD.

***

### isEncrypted {#isencrypted}

> **isEncrypted**: `boolean`

Is the entry encrypted.

***

### compression? {#compression}

> `optional` **compression?**: `BlobStorageCompressionType`

Is the entry compressed.
