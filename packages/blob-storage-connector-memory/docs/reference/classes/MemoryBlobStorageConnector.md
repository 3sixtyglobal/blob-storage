# Class: MemoryBlobStorageConnector

Class for performing blob storage operations in-memory.

## Implements

- `IBlobStorageConnector`

## Constructors

### Constructor

> **new MemoryBlobStorageConnector**(`options?`): `MemoryBlobStorageConnector`

Create a new instance of MemoryBlobStorageConnector.

#### Parameters

##### options?

[`IMemoryStorageConnectorConstructorOptions`](../interfaces/IMemoryStorageConnectorConstructorOptions.md)

The options for the connector.

#### Returns

`MemoryBlobStorageConnector`

## Properties

### NAMESPACE {#namespace}

> `readonly` `static` **NAMESPACE**: `string` = `"memory"`

The namespace for the items.

***

### CLASS\_NAME {#class_name}

> `readonly` `static` **CLASS\_NAME**: `string`

Runtime name for the class.

## Methods

### className() {#classname}

> **className**(): `string`

Returns the class name of the component.

#### Returns

`string`

The class name of the component.

#### Implementation of

`IBlobStorageConnector.className`

***

### health() {#health}

> **health**(): `Promise`\<`IHealth`[]\>

Returns the health status of the component.

#### Returns

`Promise`\<`IHealth`[]\>

The health status of the component.

#### Implementation of

`IBlobStorageConnector.health`

***

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

#### Implementation of

`IBlobStorageConnector.set`

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

#### Implementation of

`IBlobStorageConnector.get`

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

#### Implementation of

`IBlobStorageConnector.remove`

***

### teardown() {#teardown}

> **teardown**(`nodeLoggingComponentType?`): `Promise`\<`boolean`\>

Teardown the component and remove any resources it created.

#### Parameters

##### nodeLoggingComponentType?

`string`

The node logging component type.

#### Returns

`Promise`\<`boolean`\>

True if the teardown process was successful.

#### Implementation of

`IBlobStorageConnector.teardown`

***

### empty() {#empty}

> **empty**(): `Promise`\<`void`\>

Remove all blobs from the storage.

#### Returns

`Promise`\<`void`\>

A promise that resolves when all blobs in the current partition have been removed.

#### Implementation of

`IBlobStorageConnector.empty`

***

### getStore() {#getstore}

> **getStore**(): `object`

Get the memory store.

#### Returns

`object`

The store.
