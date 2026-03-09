# TWIN Blob Storage Connector Azure

Blob Storage packages provide interoperable contracts and connectors for managing binary content across local, decentralised, and cloud environments. They share common conventions so blob identifiers, metadata, and lifecycle operations remain consistent across services, clients, and storage back ends.

## Installation

```shell
npm install @twin.org/blob-storage-connector-azure
```

## Docker

To perform testing of this component it may be necessary to launch a local instance to communicate with.

```shell
docker pull mcr.microsoft.com/azure-storage/azurite:latest
docker run -d --name twin-blob-storage-azure -p 20610:10000 -e AZURITE_ACCOUNTS=testAccount:testKey mcr.microsoft.com/azure-storage/azurite:latest azurite --skipApiVersionCheck
```

## Examples

Usage of the APIs is shown in the examples [docs/examples.md](docs/examples.md)

## Reference

Detailed reference documentation for the API can be found in [docs/reference/index.md](docs/reference/index.md)

## Changelog

The changes between each version can be found in [docs/changelog.md](docs/changelog.md)
