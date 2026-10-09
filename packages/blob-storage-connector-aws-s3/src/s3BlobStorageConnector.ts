// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import {
	HealthCategory,
	HealthStatus,
	type IHealth,
	type IHealthProviderComponent
} from "@3sixty/api-models";
import type { IBlobStorageConnector } from "@3sixty/blob-storage-models";
import { ContextIdHelper, ContextIdStore } from "@3sixty/context";
import { BaseError, ComponentFactory, Converter, GeneralError, Guards, Urn } from "@3sixty/core";
import { Sha256 } from "@3sixty/crypto";
import type { ILoggingComponent } from "@3sixty/logging-models";
import { nameof } from "@3sixty/nameof";
import {
	CreateBucketCommand,
	DeleteBucketCommand,
	DeleteObjectCommand,
	DeleteObjectsCommand,
	GetObjectCommand,
	HeadBucketCommand,
	HeadObjectCommand,
	ListBucketsCommand,
	ListObjectsV2Command,
	PutObjectCommand,
	S3Client
} from "@aws-sdk/client-s3";
import type { IS3BlobStorageConnectorConfig } from "./models/IS3BlobStorageConnectorConfig.js";
import type { IS3BlobStorageConnectorConstructorOptions } from "./models/IS3BlobStorageConnectorConstructorOptions.js";

/**
 * Class for performing blob storage operations on S3.
 * See https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/s3/ for more information.
 */
export class S3BlobStorageConnector implements IBlobStorageConnector, IHealthProviderComponent {
	/**
	 * The namespace for the items.
	 */
	public static readonly NAMESPACE: string = "s3";

	/**
	 * Runtime name for the class.
	 */
	public static readonly CLASS_NAME: string = nameof<S3BlobStorageConnector>();

	/**
	 * The configuration for the connector.
	 * @internal
	 */
	private readonly _config: IS3BlobStorageConnectorConfig;

	/**
	 * The keys to use from the context ids to create partitions.
	 * @internal
	 */
	private readonly _partitionContextIds?: string[];

	/**
	 * The S3 client.
	 * @internal
	 */
	private readonly _s3Client: S3Client;

	/**
	 * Create a new instance of S3BlobStorageConnector.
	 * @param options The options for the connector.
	 */
	constructor(options: IS3BlobStorageConnectorConstructorOptions) {
		Guards.object(S3BlobStorageConnector.CLASS_NAME, nameof(options), options);
		Guards.object<IS3BlobStorageConnectorConfig>(
			S3BlobStorageConnector.CLASS_NAME,
			nameof(options.config),
			options.config
		);
		Guards.stringValue(
			S3BlobStorageConnector.CLASS_NAME,
			nameof(options.config.region),
			options.config.region
		);
		Guards.stringValue(
			S3BlobStorageConnector.CLASS_NAME,
			nameof(options.config.bucketName),
			options.config.bucketName
		);

		options.config.authMode ??= "credentials";

		let credentials;
		if (options.config.authMode === "credentials") {
			Guards.stringValue(
				S3BlobStorageConnector.CLASS_NAME,
				nameof(options.config.accessKeyId),
				options.config.accessKeyId
			);
			Guards.stringValue(
				S3BlobStorageConnector.CLASS_NAME,
				nameof(options.config.secretAccessKey),
				options.config.secretAccessKey
			);
			credentials = {
				accessKeyId: options.config.accessKeyId,
				secretAccessKey: options.config.secretAccessKey
			};
		}

		this._partitionContextIds = options.partitionContextIds;

		this._config = options.config;
		this._s3Client = new S3Client({
			region: this._config.region,
			endpoint: this._config.endpoint,
			credentials,
			forcePathStyle: true
		});
	}

	/**
	 * Returns the class name of the component.
	 * @returns The class name of the component.
	 */
	public className(): string {
		return S3BlobStorageConnector.CLASS_NAME;
	}

	/**
	 * Returns the health status of the component.
	 * @returns The health status of the component.
	 */
	public async health(): Promise<IHealth[]> {
		try {
			await this._s3Client.send(new HeadBucketCommand({ Bucket: this._config.bucketName }));
			return [
				{
					source: S3BlobStorageConnector.CLASS_NAME,
					category: HealthCategory.Connectivity,
					status: HealthStatus.Ok,
					description: "healthDescription",
					data: {
						bucketName: this._config.bucketName,
						region: this._config.region
					}
				}
			];
		} catch {
			return [
				{
					source: S3BlobStorageConnector.CLASS_NAME,
					category: HealthCategory.Connectivity,
					status: HealthStatus.Error,
					description: "healthDescription",
					message: "healthCheckFailed",
					data: {
						bucketName: this._config.bucketName,
						region: this._config.region
					}
				}
			];
		}
	}

	/**
	 * Bootstrap the component by creating and initializing any resources it needs.
	 * @param nodeLoggingComponentType The node logging component type.
	 * @returns True if the bootstrapping process was successful.
	 */
	public async bootstrap(nodeLoggingComponentType?: string): Promise<boolean> {
		const nodeLogging = ComponentFactory.getIfExists<ILoggingComponent>(nodeLoggingComponentType);

		try {
			const listBucketsCommand = new ListBucketsCommand({});
			const bucketsList = await this._s3Client.send(listBucketsCommand);
			const bucketExists = bucketsList.Buckets?.some(
				bucket => bucket.Name === this._config.bucketName
			);

			if (bucketExists) {
				await nodeLogging?.log({
					level: "info",
					source: S3BlobStorageConnector.CLASS_NAME,
					message: "bucketExists",
					data: {
						bucket: this._config.bucketName
					}
				});
			} else {
				await nodeLogging?.log({
					level: "info",
					source: S3BlobStorageConnector.CLASS_NAME,
					message: "bucketCreating",
					data: {
						bucket: this._config.bucketName
					}
				});
				await this._s3Client.send(new CreateBucketCommand({ Bucket: this._config.bucketName }));
			}
		} catch (err) {
			await nodeLogging?.log({
				level: "error",
				source: S3BlobStorageConnector.CLASS_NAME,
				message: "bucketCreateFailed",
				data: {
					bucket: this._config.bucketName
				},
				error: BaseError.fromError(err)
			});

			return false;
		}

		return true;
	}

	/**
	 * Set the blob.
	 * @param blob The data for the blob.
	 * @returns The id of the stored blob in urn format.
	 */
	public async set(blob: Uint8Array): Promise<string> {
		Guards.uint8Array(S3BlobStorageConnector.CLASS_NAME, nameof(blob), blob);

		try {
			const id = Converter.bytesToHex(Sha256.sum256(blob));

			const contextIds = await ContextIdStore.getContextIds();
			const partitionKey = ContextIdHelper.combinedContextKey(
				contextIds,
				this._partitionContextIds
			);

			const command = new PutObjectCommand({
				Bucket: this._config.bucketName,
				Key: `${partitionKey ?? "root"}/${id}`,
				Body: blob
			});

			await this._s3Client.send(command);

			return `blob:${new Urn(S3BlobStorageConnector.NAMESPACE, id).toString()}`;
		} catch (err) {
			throw new GeneralError(S3BlobStorageConnector.CLASS_NAME, "setBlobFailed", undefined, err);
		}
	}

	/**
	 * Get the blob.
	 * @param id The id of the blob to get in urn format.
	 * @returns The data for the blob if it can be found or undefined.
	 */
	public async get(id: string): Promise<Uint8Array | undefined> {
		Urn.guard(S3BlobStorageConnector.CLASS_NAME, nameof(id), id);
		const urnParsed = Urn.fromValidString(id);

		const contextIds = await ContextIdStore.getContextIds();
		const partitionKey = ContextIdHelper.combinedContextKey(contextIds, this._partitionContextIds);

		if (urnParsed.namespaceMethod() !== S3BlobStorageConnector.NAMESPACE) {
			throw new GeneralError(S3BlobStorageConnector.CLASS_NAME, "namespaceMismatch", {
				namespace: S3BlobStorageConnector.NAMESPACE,
				id
			});
		}

		try {
			const key = urnParsed.namespaceSpecific(1);
			const command = new GetObjectCommand({
				Bucket: this._config.bucketName,
				Key: `${partitionKey ?? "root"}/${key}`
			});

			const response = await this._s3Client.send(command);

			if (response.Body) {
				return new Uint8Array(await response.Body.transformToByteArray());
			}
		} catch (err) {
			if (BaseError.isErrorName(err, "NoSuchKey")) {
				return undefined;
			}
			throw new GeneralError(
				S3BlobStorageConnector.CLASS_NAME,
				"getBlobFailed",
				{
					id,
					namespace: S3BlobStorageConnector.NAMESPACE
				},
				err
			);
		}
	}

	/**
	 * Teardown the component and remove any resources it created.
	 * @param nodeLoggingComponentType The node logging component type.
	 * @returns True if the teardown process was successful.
	 */
	public async teardown(nodeLoggingComponentType?: string): Promise<boolean> {
		const nodeLogging = ComponentFactory.getIfExists<ILoggingComponent>(nodeLoggingComponentType);

		await nodeLogging?.log({
			level: "info",
			source: S3BlobStorageConnector.CLASS_NAME,
			message: "bucketDeleting",
			data: {
				bucket: this._config.bucketName
			}
		});

		try {
			let continuationToken: string | undefined;
			do {
				const listCommand = new ListObjectsV2Command({
					Bucket: this._config.bucketName,
					ContinuationToken: continuationToken
				});
				const listResponse = await this._s3Client.send(listCommand);

				if (listResponse.Contents && listResponse.Contents.length > 0) {
					const deleteCommand = new DeleteObjectsCommand({
						Bucket: this._config.bucketName,
						Delete: {
							Objects: listResponse.Contents.map(obj => ({ Key: obj.Key }))
						}
					});
					await this._s3Client.send(deleteCommand);
				}

				continuationToken = listResponse.IsTruncated
					? listResponse.NextContinuationToken
					: undefined;
			} while (continuationToken);

			await this._s3Client.send(new DeleteBucketCommand({ Bucket: this._config.bucketName }));

			await nodeLogging?.log({
				level: "info",
				source: S3BlobStorageConnector.CLASS_NAME,
				message: "bucketDeleted",
				data: {
					bucket: this._config.bucketName
				}
			});

			return true;
		} catch (err) {
			await nodeLogging?.log({
				level: "error",
				source: S3BlobStorageConnector.CLASS_NAME,
				message: "teardownFailed",
				data: {
					bucket: this._config.bucketName
				},
				error: BaseError.fromError(err)
			});
			return false;
		}
	}

	/**
	 * Remove all blobs from the storage.
	 * @returns A promise that resolves when all blobs in the current partition have been removed.
	 */
	public async empty(): Promise<void> {
		try {
			const contextIds = await ContextIdStore.getContextIds();
			const partitionKey = ContextIdHelper.combinedContextKey(
				contextIds,
				this._partitionContextIds
			);
			const prefix = `${partitionKey ?? "root"}/`;

			let continuationToken: string | undefined;
			do {
				const listCommand = new ListObjectsV2Command({
					Bucket: this._config.bucketName,
					Prefix: prefix,
					ContinuationToken: continuationToken
				});
				const listResponse = await this._s3Client.send(listCommand);

				if (listResponse.Contents && listResponse.Contents.length > 0) {
					const deleteCommand = new DeleteObjectsCommand({
						Bucket: this._config.bucketName,
						Delete: {
							Objects: listResponse.Contents.map(obj => ({ Key: obj.Key }))
						}
					});
					await this._s3Client.send(deleteCommand);
				}

				continuationToken = listResponse.IsTruncated
					? listResponse.NextContinuationToken
					: undefined;
			} while (continuationToken);
		} catch (err) {
			throw new GeneralError(
				S3BlobStorageConnector.CLASS_NAME,
				"emptyFailed",
				{ bucketName: this._config.bucketName },
				err
			);
		}
	}

	/**
	 * Remove the blob.
	 * @param id The id of the blob to remove in urn format.
	 * @returns True if the blob was found.
	 */
	public async remove(id: string): Promise<boolean> {
		Urn.guard(S3BlobStorageConnector.CLASS_NAME, nameof(id), id);
		const urnParsed = Urn.fromValidString(id);

		const contextIds = await ContextIdStore.getContextIds();
		const partitionKey = ContextIdHelper.combinedContextKey(contextIds, this._partitionContextIds);

		if (urnParsed.namespaceMethod() !== S3BlobStorageConnector.NAMESPACE) {
			throw new GeneralError(S3BlobStorageConnector.CLASS_NAME, "namespaceMismatch", {
				namespace: S3BlobStorageConnector.NAMESPACE,
				id
			});
		}

		try {
			const key = urnParsed.namespaceSpecific(1);

			const headCommand = new HeadObjectCommand({
				Bucket: this._config.bucketName,
				Key: `${partitionKey ?? "root"}/${key}`
			});

			try {
				await this._s3Client.send(headCommand);
			} catch (error) {
				if (BaseError.isErrorName(error, "NotFound")) {
					return false;
				}
				throw error;
			}

			const deleteCommand = new DeleteObjectCommand({
				Bucket: this._config.bucketName,
				Key: `${partitionKey ?? "root"}/${key}`
			});

			await this._s3Client.send(deleteCommand);

			return true;
		} catch (err) {
			throw new GeneralError(S3BlobStorageConnector.CLASS_NAME, "removeBlobFailed", { id }, err);
		}
	}
}
