# Function: blobStorageEmpty()

> **blobStorageEmpty**(`httpRequestContext`, `componentName`, `request`): `Promise`\<`INoContentResponse`\>

Remove all entries from blob storage.

## Parameters

### httpRequestContext

`IHttpRequestContext`

The request context for the API.

### componentName

`string`

The name of the component to use in the routes.

### request

`IBlobStorageEmptyRequest`

The request.

## Returns

`Promise`\<`INoContentResponse`\>

The response object with additional http response properties.
