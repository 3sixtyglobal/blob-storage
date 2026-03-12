# Interface: IBlobStorageServiceConfig

Configuration for the blob storage service.

## Properties

### vaultKeyId? {#vaultkeyid}

> `optional` **vaultKeyId**: `string`

The name of the vault key to use for encryption, if not configured no encryption will happen.

***

### defaultNamespace? {#defaultnamespace}

> `optional` **defaultNamespace**: `string`

The namespace of the default storage connector to use.
Defaults to the first entry in the factory if not provided.
