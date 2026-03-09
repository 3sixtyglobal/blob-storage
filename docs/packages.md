# Blob Storage Packages

## blob-storage-models

The package serves as a foundational component within the repository. Its primary purpose is to provide shared models, contracts, and connector interfaces for blob storage workflows. By doing so, it enables other packages to build upon a consistent and reliable base. This package is integral to ensuring that common functionality is centralised and reusable across the ecosystem.

- [README](../packages/blob-storage-models/README.md)
- [Examples](../packages/blob-storage-models/docs/examples.md)
- [Changelog](../packages/blob-storage-models/docs/changelog.md)

## blob-storage-connector-memory

This package is designed to provide an in-memory connector that supports local execution and test scenarios without external infrastructure dependencies. It plays a crucial role in ensuring that inputs and outputs across the repository conform to expected standards, thereby reducing integration errors and improving maintainability. Its implementation reflects a focus on semantic clarity and interoperability.

- [README](../packages/blob-storage-connector-memory/README.md)
- [Examples](../packages/blob-storage-connector-memory/docs/examples.md)
- [Changelog](../packages/blob-storage-connector-memory/docs/changelog.md)

## blob-storage-service

The package addresses service-level blob storage behaviour, including contract implementation and REST endpoint definitions for upload, retrieval, and management operations. It is intended to streamline workflows and provide developers with a consistent set of resources that align with the repository's overall objectives. By encapsulating this functionality, the package contributes to both productivity and long-term sustainability of the codebase.

- [README](../packages/blob-storage-service/README.md)
- [Examples](../packages/blob-storage-service/docs/examples.md)
- [Changelog](../packages/blob-storage-service/docs/changelog.md)

## blob-storage-rest-client

This package focuses on client-side integration with blob storage service endpoints through a dedicated REST access layer. Its role is to ensure that the repository can be reliably integrated across different environments and deployment topologies. The package embodies best practices for interoperability and reproducibility, making it a cornerstone of operational stability.

- [README](../packages/blob-storage-rest-client/README.md)
- [Examples](../packages/blob-storage-rest-client/docs/examples.md)
- [Changelog](../packages/blob-storage-rest-client/docs/changelog.md)

## blob-storage-connector-file

The package serves as a foundational component within the repository. Its primary purpose is to persist blobs in a file system based backend for local and mounted storage use cases. By doing so, it enables other packages to build upon a consistent and reliable base. This package is integral to ensuring that common functionality is centralised and reusable across the ecosystem.

- [README](../packages/blob-storage-connector-file/README.md)
- [Examples](../packages/blob-storage-connector-file/docs/examples.md)
- [Changelog](../packages/blob-storage-connector-file/docs/changelog.md)

## blob-storage-connector-ipfs

This package is designed to integrate blob workflows with [IPFS](https://ipfs.tech/) for decentralised content addressing and retrieval. It plays a crucial role in ensuring that inputs and outputs across the repository conform to expected standards, thereby reducing integration errors and improving maintainability. Its implementation reflects a focus on semantic clarity and interoperability.

- [README](../packages/blob-storage-connector-ipfs/README.md)
- [Examples](../packages/blob-storage-connector-ipfs/docs/examples.md)
- [Changelog](../packages/blob-storage-connector-ipfs/docs/changelog.md)

## blob-storage-connector-aws-s3

The package addresses integration with [Amazon S3](https://aws.amazon.com/s3/) so blob operations can run against widely adopted object storage infrastructure. It is intended to streamline workflows and provide developers with a consistent set of resources that align with the repository's overall objectives. By encapsulating this functionality, the package contributes to both productivity and long-term sustainability of the codebase.

- [README](../packages/blob-storage-connector-aws-s3/README.md)
- [Examples](../packages/blob-storage-connector-aws-s3/docs/examples.md)
- [Changelog](../packages/blob-storage-connector-aws-s3/docs/changelog.md)

## blob-storage-connector-azure

This package focuses on integration with [Azure Blob Storage](https://learn.microsoft.com/azure/storage/blobs/storage-blobs-introduction) for cloud-native object storage scenarios. Its role is to ensure that the repository can be reliably deployed and maintained across different environments. The package embodies best practices for automation and reproducibility, making it a cornerstone of operational stability.

- [README](../packages/blob-storage-connector-azure/README.md)
- [Examples](../packages/blob-storage-connector-azure/docs/examples.md)
- [Changelog](../packages/blob-storage-connector-azure/docs/changelog.md)

## blob-storage-connector-gcp

The package serves as a foundational component within the repository. Its primary purpose is to integrate blob workflows with [Google Cloud Storage](https://cloud.google.com/storage) for managed object storage deployments. By doing so, it enables other packages to build upon a consistent and reliable base. This package is integral to ensuring that common functionality is centralised and reusable across the ecosystem.

- [README](../packages/blob-storage-connector-gcp/README.md)
- [Examples](../packages/blob-storage-connector-gcp/docs/examples.md)
- [Changelog](../packages/blob-storage-connector-gcp/docs/changelog.md)
