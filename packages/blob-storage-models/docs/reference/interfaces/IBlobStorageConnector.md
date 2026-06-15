# Interface: IBlobStorageConnector

Interface describing a blob storage connector.

## Extends

- `IComponent`

## Methods

### set() {#set}

> **set**(`blob`): `Promise`\<`string`\>

Set the blob.

#### Parameters

##### blob

`Uint8Array`

The data for the blob.

#### Returns

`Promise`\<`string`\>

The id of the stored blob in urn format.

***

### get() {#get}

> **get**(`id`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\> \| `undefined`\>

Get the blob.

#### Parameters

##### id

`string`

The id of the blob to get in urn format.

#### Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\> \| `undefined`\>

The data for the blob if it can be found or undefined.

***

### remove() {#remove}

> **remove**(`id`): `Promise`\<`boolean`\>

Remove the blob.

#### Parameters

##### id

`string`

The id of the blob to remove in urn format.

#### Returns

`Promise`\<`boolean`\>

True if the blob was found.

***

### empty() {#empty}

> **empty**(): `Promise`\<`void`\>

Remove all blobs from the storage.

#### Returns

`Promise`\<`void`\>

A promise that resolves when all blobs have been removed.
