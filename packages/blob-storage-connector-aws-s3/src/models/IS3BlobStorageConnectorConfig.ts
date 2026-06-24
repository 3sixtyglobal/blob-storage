// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.

/**
 * Configuration for the S3 Blob Storage Connector.
 */
export interface IS3BlobStorageConnectorConfig {
	/**
	 * The AWS region.
	 */
	region: string;

	/**
	 * The S3 bucket name.
	 */
	bucketName: string;

	/**
	 * The authentication mode.
	 * - "credentials": Use access key ID and secret access key.
	 * - "pod": Use IAM role attached to the pod (e.g., in EKS).
	 * @default credentials
	 */
	authMode?: "credentials" | "pod";

	/**
	 * The AWS access key ID.
	 */
	accessKeyId?: string;

	/**
	 * The AWS secret access key.
	 */
	secretAccessKey?: string;

	/**
	 * Optional endpoint for S3-compatible storage (e.g., MinIO).
	 */
	endpoint?: string;
}
