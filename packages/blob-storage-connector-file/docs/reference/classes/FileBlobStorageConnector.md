# Class: FileBlobStorageConnector

Class for performing blob storage operations in file.

## Implements

- `IBlobStorageConnector`
- `IHealthProviderComponent`

## Constructors

### Constructor

> **new FileBlobStorageConnector**(`options`): `FileBlobStorageConnector`

Create a new instance of FileBlobStorageConnector.

#### Parameters

##### options

[`IFileBlobStorageConnectorConstructorOptions`](../interfaces/IFileBlobStorageConnectorConstructorOptions.md)

The options for the connector.

#### Returns

`FileBlobStorageConnector`

## Properties

### NAMESPACE {#namespace}

> `readonly` `static` **NAMESPACE**: `string` = `"file"`

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

> **health**(`lastTimestamp`): `Promise`\<`IHealth`[]\>

Returns the health status of the component.

#### Parameters

##### lastTimestamp

`number`

The Unix timestamp (ms) recorded at the start of the previous cycle.

#### Returns

`Promise`\<`IHealth`[]\>

The health status of the component.

#### Implementation of

`IHealthProviderComponent.health`

***

### bootstrap() {#bootstrap}

> **bootstrap**(`nodeLoggingComponentType?`): `Promise`\<`boolean`\>

Bootstrap the component by creating and initializing any resources it needs.

#### Parameters

##### nodeLoggingComponentType?

`string`

The node logging component type.

#### Returns

`Promise`\<`boolean`\>

True if the bootstrapping process was successful.

#### Implementation of

`IBlobStorageConnector.bootstrap`

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
