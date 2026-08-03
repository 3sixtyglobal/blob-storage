// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { Storage } from "@google-cloud/storage";
import {
	HealthCategory,
	HealthStatus,
	type IHealth,
	type IHealthProviderComponent
} from "@twin.org/api-models";
import type { IBlobStorageConnector } from "@twin.org/blob-storage-models";
import { ContextIdHelper, ContextIdStore } from "@twin.org/context";
import {
	BaseError,
	ComponentFactory,
	Converter,
	GeneralError,
	Guards,
	Is,
	ObjectHelper,
	Urn
} from "@twin.org/core";
import { Sha256 } from "@twin.org/crypto";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import { MimeTypes } from "@twin.org/web";
import type { JWTInput } from "google-auth-library";
import type { IGcpBlobStorageConnectorConfig } from "./models/IGcpBlobStorageConnectorConfig.js";
import type { IGcpBlobStorageConnectorConstructorOptions } from "./models/IGcpBlobStorageConnectorConstructorOptions.js";

/**
 * Class for performing blob storage operations on GCP Storage.
 * See https://cloud.google.com/storage/docs/reference/libraries for more information.
 */
export class GcpBlobStorageConnector implements IBlobStorageConnector, IHealthProviderComponent {
	/**
	 * The namespace for the items.
	 */
	public static readonly NAMESPACE: string = "gcp";

	/**
	 * Runtime name for the class.
	 */
	public static readonly CLASS_NAME: string = nameof<GcpBlobStorageConnector>();

	/**
	 * The configuration for the connector.
	 * @internal
	 */
	private readonly _config: IGcpBlobStorageConnectorConfig;

	/**
	 * The keys to use from the context ids to create partitions.
	 * @internal
	 */
	private readonly _partitionContextIds?: string[];

	/**
	 * The GCP Storage client.
	 * @internal
	 */
	private readonly _storage: Storage;

	/**
	 * Create a new instance of GcpBlobStorageConnector.
	 * @param options The options for the connector.
	 */
	constructor(options: IGcpBlobStorageConnectorConstructorOptions) {
		Guards.object(GcpBlobStorageConnector.CLASS_NAME, nameof(options), options);
		Guards.object<IGcpBlobStorageConnectorConfig>(
			GcpBlobStorageConnector.CLASS_NAME,
			nameof(options.config),
			options.config
		);
		Guards.stringValue(
			GcpBlobStorageConnector.CLASS_NAME,
			nameof(options.config.projectId),
			options.config.projectId
		);

		let credentials: JWTInput | undefined;
		if (!Is.empty(options.config.credentials)) {
			Guards.stringBase64(
				GcpBlobStorageConnector.CLASS_NAME,
				nameof(options.config.credentials),
				options.config.credentials
			);
			credentials = ObjectHelper.fromBytes<JWTInput>(
				Converter.base64ToBytes(options.config.credentials)
			);
		}

		Guards.stringValue(
			GcpBlobStorageConnector.CLASS_NAME,
			nameof(options.config.bucketName),
			options.config.bucketName
		);

		this._config = options.config;
		this._partitionContextIds = options.partitionContextIds;
		this._storage = new Storage({
			projectId: this._config.projectId,
			apiEndpoint: this._config.apiEndpoint,
			credentials
		});
	}

	/**
	 * Returns the class name of the component.
	 * @returns The class name of the component.
	 */
	public className(): string {
		return GcpBlobStorageConnector.CLASS_NAME;
	}

	/**
	 * Returns the health status of the component.
	 * @param lastTimestamp The Unix timestamp (ms) recorded at the start of the previous cycle.
	 * @returns The health status of the component.
	 */
	public async health(lastTimestamp: number): Promise<IHealth[]> {
		try {
			await this._storage.bucket(this._config.bucketName).exists();
			return [
				{
					source: GcpBlobStorageConnector.CLASS_NAME,
					category: HealthCategory.Connectivity,
					status: HealthStatus.Ok,
					description: "healthDescription",
					data: {
						bucketName: this._config.bucketName,
						projectId: this._config.projectId
					}
				}
			];
		} catch {
			return [
				{
					source: GcpBlobStorageConnector.CLASS_NAME,
					category: HealthCategory.Connectivity,
					status: HealthStatus.Error,
					description: "healthDescription",
					message: "healthCheckFailed",
					data: {
						bucketName: this._config.bucketName,
						projectId: this._config.projectId
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
			const [buckets] = await this._storage.getBuckets();
			const bucketExists = buckets.some(bucket => bucket.name === this._config.bucketName);

			if (bucketExists) {
				await nodeLogging?.log({
					level: "info",
					source: GcpBlobStorageConnector.CLASS_NAME,
					message: "bucketExists",
					data: {
						bucket: this._config.bucketName
					}
				});
			} else {
				await nodeLogging?.log({
					level: "info",
					source: GcpBlobStorageConnector.CLASS_NAME,
					message: "bucketCreating",
					data: {
						bucket: this._config.bucketName
					}
				});
				await this._storage.createBucket(this._config.bucketName);
			}
		} catch (err) {
			await nodeLogging?.log({
				level: "error",
				source: GcpBlobStorageConnector.CLASS_NAME,
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
		Guards.uint8Array(GcpBlobStorageConnector.CLASS_NAME, nameof(blob), blob);

		const contextIds = await ContextIdStore.getContextIds();
		const partitionKey = ContextIdHelper.combinedContextKey(contextIds, this._partitionContextIds);

		try {
			const id = Converter.bytesToHex(Sha256.sum256(blob));
			const bucket = this._storage.bucket(this._config.bucketName);
			const file = bucket.file(`${partitionKey ?? "root"}/${id}`);

			await file.save(blob, {
				contentType: MimeTypes.OctetStream
			});

			return `blob:${new Urn(GcpBlobStorageConnector.NAMESPACE, id).toString()}`;
		} catch (err) {
			throw new GeneralError(GcpBlobStorageConnector.CLASS_NAME, "setBlobFailed", undefined, err);
		}
	}

	/**
	 * Get the blob.
	 * @param id The id of the blob to get in urn format.
	 * @returns The data for the blob if it can be found or undefined.
	 */
	public async get(id: string): Promise<Uint8Array | undefined> {
		Urn.guard(GcpBlobStorageConnector.CLASS_NAME, nameof(id), id);

		const contextIds = await ContextIdStore.getContextIds();
		const partitionKey = ContextIdHelper.combinedContextKey(contextIds, this._partitionContextIds);

		const urnParsed = Urn.fromValidString(id);

		if (urnParsed.namespaceMethod() !== GcpBlobStorageConnector.NAMESPACE) {
			throw new GeneralError(GcpBlobStorageConnector.CLASS_NAME, "namespaceMismatch", {
				namespace: GcpBlobStorageConnector.NAMESPACE,
				id
			});
		}

		try {
			const key = urnParsed.namespaceSpecific(1);
			const bucket = this._storage.bucket(this._config.bucketName);
			const file = bucket.file(`${partitionKey ?? "root"}/${key}`);

			const [exists] = await file.exists();
			if (!exists) {
				return undefined;
			}

			const [contents] = await file.download();
			return new Uint8Array(contents);
		} catch (err) {
			throw new GeneralError(GcpBlobStorageConnector.CLASS_NAME, "getBlobFailed", { id }, err);
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
			source: GcpBlobStorageConnector.CLASS_NAME,
			message: "bucketDeleting",
			data: {
				bucket: this._config.bucketName
			}
		});

		try {
			const bucket = this._storage.bucket(this._config.bucketName);
			await bucket.deleteFiles({ force: true });
			await bucket.delete();

			await nodeLogging?.log({
				level: "info",
				source: GcpBlobStorageConnector.CLASS_NAME,
				message: "bucketDeleted",
				data: {
					bucket: this._config.bucketName
				}
			});

			return true;
		} catch (err) {
			await nodeLogging?.log({
				level: "error",
				source: GcpBlobStorageConnector.CLASS_NAME,
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

			const bucket = this._storage.bucket(this._config.bucketName);
			await bucket.deleteFiles({ force: true, prefix });
		} catch (err) {
			throw new GeneralError(
				GcpBlobStorageConnector.CLASS_NAME,
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
		Urn.guard(GcpBlobStorageConnector.CLASS_NAME, nameof(id), id);

		const contextIds = await ContextIdStore.getContextIds();
		const partitionKey = ContextIdHelper.combinedContextKey(contextIds, this._partitionContextIds);

		const urnParsed = Urn.fromValidString(id);

		if (urnParsed.namespaceMethod() !== GcpBlobStorageConnector.NAMESPACE) {
			throw new GeneralError(GcpBlobStorageConnector.CLASS_NAME, "namespaceMismatch", {
				namespace: GcpBlobStorageConnector.NAMESPACE,
				id
			});
		}

		try {
			const key = urnParsed.namespaceSpecific(1);
			const bucket = this._storage.bucket(this._config.bucketName);
			const file = bucket.file(`${partitionKey ?? "root"}/${key}`);

			const [exists] = await file.exists();
			if (!exists) {
				return false;
			}

			await file.delete();
			return true;
		} catch (err) {
			throw new GeneralError(GcpBlobStorageConnector.CLASS_NAME, "removeBlobFailed", { id }, err);
		}
	}
}
