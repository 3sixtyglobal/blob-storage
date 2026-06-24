# TWIN Blob Storage Connector AWS S3

This package integrates blob storage workflows with [Amazon S3](https://aws.amazon.com/s3/) and compatible object storage services. It is suited to deployments that need durable, managed cloud object storage.

## Installation

```shell
npm install @twin.org/blob-storage-connector-aws-s3
```

## Docker

To perform testing of this component it may be necessary to launch a local instance to communicate with.

```shell
docker run -d --name twin-blob-storage-aws-s3 -p 5000:5000 motoserver/moto:latest
```

## Examples

Usage of the APIs is shown in the examples [docs/examples.md](docs/examples.md)

## Reference

Detailed reference documentation for the API can be found in [docs/reference/index.md](docs/reference/index.md)

## Changelog

The changes between each version can be found in [docs/changelog.md](docs/changelog.md)
