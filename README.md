# 3Sixty Blob Storage

This repository provides a modular blob storage stack for applications that need reliable handling of binary content across local and cloud environments. It combines shared contracts, service building blocks, client access utilities, and interchangeable connectors so teams can adopt one consistent approach to identifiers, metadata, and lifecycle operations.

The packages are designed to reduce integration friction when moving between development and production infrastructure. With a common model layer and connector-specific adapters, projects can keep the same application-facing behaviour while targeting memory, file systems, decentralised networks, or major object storage providers.

## Packages

- [blob-storage-models](packages/blob-storage-models/README.md) - Defines shared contracts, schemas, and interfaces for blob content, metadata, and connector behaviour.
- [blob-storage-connector-memory](packages/blob-storage-connector-memory/README.md) - Provides an in-memory connector for fast local testing and ephemeral blob workflows.
- [blob-storage-service](packages/blob-storage-service/README.md) - Exposes blob operations through service components and HTTP route definitions.
- [blob-storage-rest-client](packages/blob-storage-rest-client/README.md) - Offers client utilities for calling blob service endpoints with consistent request handling.
- [blob-storage-connector-file](packages/blob-storage-connector-file/README.md) - Persists blobs to local directories or mounted volumes through a file system connector.
- [blob-storage-connector-ipfs](packages/blob-storage-connector-ipfs/README.md) - Stores and retrieves blobs through [IPFS](https://ipfs.tech/) for content-addressed and distributed workflows.
- [blob-storage-connector-aws-s3](packages/blob-storage-connector-aws-s3/README.md) - Stores and retrieves blobs in [Amazon S3](https://aws.amazon.com/s3/) and S3-compatible object storage.
- [blob-storage-connector-azure](packages/blob-storage-connector-azure/README.md) - Stores and retrieves blobs in [Azure Blob Storage](https://learn.microsoft.com/azure/storage/blobs/storage-blobs-introduction) containers.
- [blob-storage-connector-gcp](packages/blob-storage-connector-gcp/README.md) - Stores and retrieves blobs in [Google Cloud Storage](https://cloud.google.com/storage) buckets.

## Contributing

To contribute to this package see the guidelines for building and publishing in [CONTRIBUTING](./CONTRIBUTING.md)

## Origin

This repository is derived from the original [iotaledger/twin-blob-storage](https://github.com/iotaledger/twin-blob-storage) repository.
