# TWIN Blob Storage Connector IPFS

Blob Storage packages provide interoperable contracts and connectors for managing binary content across local, decentralised, and cloud environments. They share common conventions so blob identifiers, metadata, and lifecycle operations remain consistent across services, clients, and storage back ends.

## Installation

```shell
npm install @twin.org/blob-storage-connector-ipfs
```

## Docker

To perform testing of this component it may be necessary to launch a local instance to communicate with.

```shell
docker run -d --name twin-blob-storage-ipfs -p 4001:4001 -p 4001:4001/udp -p 8080:8080 -p 5001:5001 ipfs/kubo:latest
```

## Examples

Usage of the APIs is shown in the examples [docs/examples.md](docs/examples.md)

## Reference

Detailed reference documentation for the API can be found in [docs/reference/index.md](docs/reference/index.md)

## Changelog

The changes between each version can be found in [docs/changelog.md](docs/changelog.md)
