# Function: blobStorageCreate()

> **blobStorageCreate**(`httpRequestContext`, `componentName`, `request`, `baseRouteName`): `Promise`\<`ICreatedResponse`\>

Create a blob in storage.

## Parameters

### httpRequestContext

`IHttpRequestContext`

The request context for the API.

### componentName

`string`

The name of the component to use in the routes.

### request

`IBlobStorageCreateRequest`

The request.

### baseRouteName

`string`

The base route name to use for the location header.

## Returns

`Promise`\<`ICreatedResponse`\>

The response object with additional http response properties.
