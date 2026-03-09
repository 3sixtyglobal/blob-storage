# TWIN Blob Storage Connector GCP

This package integrates blob storage workflows with [Google Cloud Storage](https://cloud.google.com/storage). It supports deployments that rely on managed GCP buckets for object persistence and retrieval.

## Installation

```shell
npm install @twin.org/blob-storage-connector-gcp
```

## Docker

To perform testing of this component it may be necessary to launch a local instance to communicate with.

```shell
docker run -d --name twin-blob-storage-gcp -p 4443:4443 fsouza/fake-gcs-server:latest -scheme http
```

## Examples

Usage of the APIs is shown in the examples [docs/examples.md](docs/examples.md)

## Reference

Detailed reference documentation for the API can be found in [docs/reference/index.md](docs/reference/index.md)

## Changelog

The changes between each version can be found in [docs/changelog.md](docs/changelog.md)
