# Interface: IFileBlobStorageConnectorConfig

Configuration for the File Blob Storage Connector.

## Properties

### directory {#directory}

> **directory**: `string`

The directory to use for storage.

***

### extension? {#extension}

> `optional` **extension?**: `string`

The extension to add to files when they are stored.

***

### diskErrorThresholdBytes? {#diskerrorthresholdbytes}

> `optional` **diskErrorThresholdBytes?**: `number`

Free bytes below which health reports an error.
Defaults to 100 MB.

***

### diskWarningThresholdBytes? {#diskwarningthresholdbytes}

> `optional` **diskWarningThresholdBytes?**: `number`

Free bytes below which health reports a warning.
Defaults to 500 MB.
