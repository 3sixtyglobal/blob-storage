# Blob Storage Packages

## blob-storage-models

This package defines the shared contracts and schemas used throughout the repository for blob identifiers, metadata, and connector behaviour. It provides the semantic foundation that keeps service, client, and connector packages interoperable and predictable.

- [README](../packages/blob-storage-models/README.md)
- [Examples](../packages/blob-storage-models/docs/examples.md)
- [Changelog](../packages/blob-storage-models/docs/changelog.md)

## blob-storage-connector-memory

This package provides an in-memory connector for fast local execution and test scenarios where external infrastructure is unnecessary. It is useful for validating behaviour and integration paths before moving to persistent back ends.

- [README](../packages/blob-storage-connector-memory/README.md)
- [Examples](../packages/blob-storage-connector-memory/docs/examples.md)
- [Changelog](../packages/blob-storage-connector-memory/docs/changelog.md)

## blob-storage-service

This package exposes service-side components and HTTP route definitions for blob upload, retrieval, and lifecycle operations. It translates shared models into application-facing service behaviour for consistent integration across deployments.

- [README](../packages/blob-storage-service/README.md)
- [Examples](../packages/blob-storage-service/docs/examples.md)
- [Changelog](../packages/blob-storage-service/docs/changelog.md)

## blob-storage-rest-client

This package offers client-side utilities for calling blob service endpoints with consistent request and response handling. It helps consumers integrate service APIs without duplicating transport and mapping logic.

- [README](../packages/blob-storage-rest-client/README.md)
- [Examples](../packages/blob-storage-rest-client/docs/examples.md)
- [Changelog](../packages/blob-storage-rest-client/docs/changelog.md)

## blob-storage-connector-file

This package implements blob persistence on local file systems and mounted volumes. It supports straightforward development and deployment setups where directory-backed storage is preferred.

- [README](../packages/blob-storage-connector-file/README.md)
- [Examples](../packages/blob-storage-connector-file/docs/examples.md)
- [Changelog](../packages/blob-storage-connector-file/docs/changelog.md)

## blob-storage-connector-ipfs

This package integrates blob workflows with [IPFS](https://ipfs.tech/) for content-addressed and decentralised storage. It enables retrieval and distribution patterns that align with peer-to-peer infrastructure.

- [README](../packages/blob-storage-connector-ipfs/README.md)
- [Examples](../packages/blob-storage-connector-ipfs/docs/examples.md)
- [Changelog](../packages/blob-storage-connector-ipfs/docs/changelog.md)

## blob-storage-connector-aws-s3

This package integrates blob operations with [Amazon S3](https://aws.amazon.com/s3/) and compatible object storage services. It is suited to teams using managed S3-style infrastructure for durable blob persistence.

- [README](../packages/blob-storage-connector-aws-s3/README.md)
- [Examples](../packages/blob-storage-connector-aws-s3/docs/examples.md)
- [Changelog](../packages/blob-storage-connector-aws-s3/docs/changelog.md)

## blob-storage-connector-azure

This package integrates blob operations with [Azure Blob Storage](https://learn.microsoft.com/azure/storage/blobs/storage-blobs-introduction) for container-based cloud object storage. It supports environments standardised on Azure services.

- [README](../packages/blob-storage-connector-azure/README.md)
- [Examples](../packages/blob-storage-connector-azure/docs/examples.md)
- [Changelog](../packages/blob-storage-connector-azure/docs/changelog.md)

## blob-storage-connector-gcp

This package integrates blob operations with [Google Cloud Storage](https://cloud.google.com/storage) for managed bucket-based persistence. It supports cloud deployments that rely on GCP storage services.

- [README](../packages/blob-storage-connector-gcp/README.md)
- [Examples](../packages/blob-storage-connector-gcp/docs/examples.md)
- [Changelog](../packages/blob-storage-connector-gcp/docs/changelog.md)
