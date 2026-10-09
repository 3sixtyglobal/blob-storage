# 3Sixty Blob Storage Connector Azure

This package integrates blob storage workflows with [Azure Blob Storage](https://learn.microsoft.com/azure/storage/blobs/storage-blobs-introduction). It is designed for environments that use Azure containers for scalable object persistence.

## Installation

```shell
npm install @3sixty/blob-storage-connector-azure
```

## Docker

To perform testing of this component it may be necessary to launch a local instance to communicate with.

```shell
docker pull mcr.microsoft.com/azure-storage/azurite:latest
docker run -d --name 3sixty-blob-storage-azure -p 20620:10000 -e AZURITE_ACCOUNTS=testAccount:testKey mcr.microsoft.com/azure-storage/azurite:latest azurite --skipApiVersionCheck --blobHost 0.0.0.0 --queueHost 0.0.0.0 --tableHost 0.0.0.0
```

## Examples

Usage of the APIs is shown in the examples [docs/examples.md](docs/examples.md)

## Reference

Detailed reference documentation for the API can be found in [docs/reference/index.md](docs/reference/index.md)

## Changelog

The changes between each version can be found in [docs/changelog.md](docs/changelog.md)

## Origin

This package is derived from the original [iotaledger/twin-blob-storage](https://github.com/iotaledger/twin-blob-storage/tree/next/packages/blob-storage-connector-azure) repository.
