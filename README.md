# TWIN Blob Storage

This repository provides a coherent blob storage toolkit for defining contracts, exposing service interfaces, and integrating with multiple storage back ends. The packages are designed to work together so teams can model binary content consistently, switch storage providers with minimal friction, and keep client and server behaviour aligned.

By combining shared models, service components, client access layers, and pluggable connectors, the repository supports both local development workflows and production deployments. It helps projects adopt a single approach to blob lifecycle management while remaining adaptable to different infrastructure choices.

## Packages

- [blob-storage-models](packages/blob-storage-models/README.md) - Shared models that define blob storage contracts and connector interfaces
- [blob-storage-connector-memory](packages/blob-storage-connector-memory/README.md) - In-memory connector for local development and testing workflows
- [blob-storage-service](packages/blob-storage-service/README.md) - Service-side contract implementation and REST endpoint definitions for blob operations
- [blob-storage-rest-client](packages/blob-storage-rest-client/README.md) - REST client for interacting with blob storage service endpoints
- [blob-storage-connector-file](packages/blob-storage-connector-file/README.md) - File system connector for storing blobs on local or mounted volumes
- [blob-storage-connector-ipfs](packages/blob-storage-connector-ipfs/README.md) - Connector for storing and retrieving blobs over [IPFS](https://ipfs.tech/)
- [blob-storage-connector-aws-s3](packages/blob-storage-connector-aws-s3/README.md) - Connector for integrating blob workflows with [Amazon S3](https://aws.amazon.com/s3/)
- [blob-storage-connector-azure](packages/blob-storage-connector-azure/README.md) - Connector for integrating blob workflows with [Azure Blob Storage](https://learn.microsoft.com/azure/storage/blobs/storage-blobs-introduction)
- [blob-storage-connector-gcp](packages/blob-storage-connector-gcp/README.md) - Connector for integrating blob workflows with [Google Cloud Storage](https://cloud.google.com/storage)

## Contributing

To contribute to this package see the guidelines for building and publishing in [CONTRIBUTING](./CONTRIBUTING.md)
