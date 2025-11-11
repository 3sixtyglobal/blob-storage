// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import {
	type BlobClient,
	type BlobDeleteOptions,
	type BlobDeleteResponse,
	BlobServiceClient,
	type BlockBlobClient,
	type ContainerClient,
	StorageSharedKeyCredential
} from "@azure/storage-blob";
import type { IBlobStorageConnector } from "@twin.org/blob-storage-models";
import { ContextIdHelper, ContextIdStore } from "@twin.org/context";
import {
	BaseError,
	ComponentFactory,
	Converter,
	GeneralError,
	Guards,
	Is,
	Urn
} from "@twin.org/core";
import { Sha256 } from "@twin.org/crypto";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import type { IAzureBlobStorageConnectorConfig } from "./models/IAzureBlobStorageConnectorConfig.js";
import type { IAzureBlobStorageConnectorConstructorOptions } from "./models/IAzureBlobStorageConnectorConstructorOptions.js";

/**
 * Class for performing blob storage operations on Azure.
 * See https://learn.microsoft.com/en-us/azure/storage/common/storage-samples-javascript?toc=%2Fazure%2Fstorage%2Fblobs%2Ftoc.json for more information.
 */
export class AzureBlobStorageConnector implements IBlobStorageConnector {
	/**
	 * The namespace for the items.
	 */
	public static readonly NAMESPACE: string = "azure";

	/**
	 * Runtime name for the class.
	 */
	public static readonly CLASS_NAME: string = nameof<AzureBlobStorageConnector>();

	/**
	 * The configuration for the connector.
	 * @internal
	 */
	private readonly _config: IAzureBlobStorageConnectorConfig;

	/**
	 * The keys to use from the context ids to create partitions.
	 * @internal
	 */
	private readonly _partitionContextIds?: string[];

	/**
	 * The Azure Service client.
	 * @internal
	 */
	private readonly _azureBlobServiceClient: BlobServiceClient;

	/**
	 * The Azure Container client.
	 * @internal
	 */
	private readonly _azureContainerClient: ContainerClient;

	/**
	 * Create a new instance of AzureBlobStorageConnector.
	 * @param options The options for the connector.
	 */
	constructor(options: IAzureBlobStorageConnectorConstructorOptions) {
		Guards.object(AzureBlobStorageConnector.CLASS_NAME, nameof(options), options);
		Guards.object<IAzureBlobStorageConnectorConfig>(
			AzureBlobStorageConnector.CLASS_NAME,
			nameof(options.config),
			options.config
		);
		Guards.stringValue(
			AzureBlobStorageConnector.CLASS_NAME,
			nameof(options.config.accountName),
			options.config.accountName
		);
		Guards.stringValue(
			AzureBlobStorageConnector.CLASS_NAME,
			nameof(options.config.accountKey),
			options.config.accountKey
		);
		Guards.stringValue(
			AzureBlobStorageConnector.CLASS_NAME,
			nameof(options.config.containerName),
			options.config.containerName
		);

		this._config = options.config;
		this._partitionContextIds = options.partitionContextIds;

		this._azureBlobServiceClient = new BlobServiceClient(
			(options.config.endpoint ?? "https://{accountName}.blob.core.windows.net/").replace(
				"{accountName}",
				options.config.accountName
			),
			new StorageSharedKeyCredential(options.config.accountName, options.config.accountKey)
		);

		this._azureContainerClient = this._azureBlobServiceClient.getContainerClient(
			options.config.containerName
		);
	}

	/**
	 * Returns the class name of the component.
	 * @returns The class name of the component.
	 */
	public className(): string {
		return AzureBlobStorageConnector.CLASS_NAME;
	}

	/**
	 * Bootstrap the component by creating and initializing any resources it needs.
	 * @param nodeLoggingComponentType The node logging component type.
	 * @returns True if the bootstrapping process was successful.
	 */
	public async bootstrap(nodeLoggingComponentType?: string): Promise<boolean> {
		const nodeLogging = ComponentFactory.getIfExists<ILoggingComponent>(nodeLoggingComponentType);

		try {
			const exists = await this._azureContainerClient.exists();

			if (exists) {
				await nodeLogging?.log({
					level: "info",
					source: AzureBlobStorageConnector.CLASS_NAME,
					message: "containerExists",
					data: {
						container: this._config.containerName
					}
				});
			} else {
				await nodeLogging?.log({
					level: "info",
					source: AzureBlobStorageConnector.CLASS_NAME,
					message: "containerCreating",
					data: {
						container: this._config.containerName
					}
				});
				await this._azureContainerClient.create();
			}
		} catch (err) {
			await nodeLogging?.log({
				level: "error",
				source: AzureBlobStorageConnector.CLASS_NAME,
				message: "containerCreateFailed",
				data: {
					container: this._config.containerName
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
		Guards.uint8Array(AzureBlobStorageConnector.CLASS_NAME, nameof(blob), blob);

		const contextIds = await ContextIdStore.getContextIds();
		const partitionKey = ContextIdHelper.combinedContextKey(contextIds, this._partitionContextIds);

		try {
			const id = Converter.bytesToHex(Sha256.sum256(blob));
			const blockBlobClient: BlockBlobClient = this._azureContainerClient.getBlockBlobClient(
				`${partitionKey ?? "root"}/${id}`
			);
			await blockBlobClient.uploadData(blob);

			return `blob:${new Urn(AzureBlobStorageConnector.NAMESPACE, id).toString()}`;
		} catch (err) {
			throw new GeneralError(AzureBlobStorageConnector.CLASS_NAME, "setBlobFailed", undefined, err);
		}
	}

	/**
	 * Get the blob.
	 * @param id The id of the blob to get in urn format.
	 * @returns The data for the blob if it can be found or undefined.
	 */
	public async get(id: string): Promise<Uint8Array | undefined> {
		Urn.guard(AzureBlobStorageConnector.CLASS_NAME, nameof(id), id);
		const urnParsed = Urn.fromValidString(id);

		const contextIds = await ContextIdStore.getContextIds();
		const partitionKey = ContextIdHelper.combinedContextKey(contextIds, this._partitionContextIds);

		if (urnParsed.namespaceMethod() !== AzureBlobStorageConnector.NAMESPACE) {
			throw new GeneralError(AzureBlobStorageConnector.CLASS_NAME, "namespaceMismatch", {
				namespace: AzureBlobStorageConnector.NAMESPACE,
				id
			});
		}

		try {
			const key = urnParsed.namespaceSpecific(1);
			const blobClient: BlobClient = this._azureContainerClient.getBlobClient(
				`${partitionKey ?? "root"}/${key}`
			);
			const buffer = await blobClient.downloadToBuffer();
			return new Uint8Array(buffer);
		} catch (err) {
			if (Is.object<{ statusCode: number }>(err) && err.statusCode === 404) {
				return;
			}
			throw new GeneralError(
				AzureBlobStorageConnector.CLASS_NAME,
				"getBlobFailed",
				{
					id,
					namespace: AzureBlobStorageConnector.NAMESPACE
				},
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
		Urn.guard(AzureBlobStorageConnector.CLASS_NAME, nameof(id), id);
		const urnParsed = Urn.fromValidString(id);

		const contextIds = await ContextIdStore.getContextIds();
		const partitionKey = ContextIdHelper.combinedContextKey(contextIds, this._partitionContextIds);

		if (urnParsed.namespaceMethod() !== AzureBlobStorageConnector.NAMESPACE) {
			throw new GeneralError(AzureBlobStorageConnector.CLASS_NAME, "namespaceMismatch", {
				namespace: AzureBlobStorageConnector.NAMESPACE,
				id
			});
		}

		try {
			const key = urnParsed.namespaceSpecific(1);

			const blockBlobClient: BlockBlobClient = this._azureContainerClient.getBlockBlobClient(
				`${partitionKey ?? "root"}/${key}`
			);

			const options: BlobDeleteOptions = {
				deleteSnapshots: "include"
			};
			const blobDeleteResponse: BlobDeleteResponse = await blockBlobClient.delete(options);

			if (!blobDeleteResponse.errorCode) {
				return true;
			}
			return false;
		} catch (err) {
			if (Is.object<{ statusCode: number }>(err) && err.statusCode === 404) {
				return false;
			}
			throw new GeneralError(AzureBlobStorageConnector.CLASS_NAME, "removeBlobFailed", { id }, err);
		}
	}
}
