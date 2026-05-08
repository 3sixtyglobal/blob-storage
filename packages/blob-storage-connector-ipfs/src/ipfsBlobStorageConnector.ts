// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IBlobStorageConnector } from "@twin.org/blob-storage-models";
import { ContextIdHelper, ContextIdStore } from "@twin.org/context";
import {
	BaseError,
	ComponentFactory,
	Converter,
	GeneralError,
	Guards,
	HealthStatus,
	Is,
	StringHelper,
	Urn,
	type IHealth
} from "@twin.org/core";
import { Blake2b } from "@twin.org/crypto";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import { HeaderHelper, HeaderTypes, HttpMethod, MimeTypes } from "@twin.org/web";
import type { IIpfsBlobStorageConnectorConfig } from "./models/IIpfsBlobStorageConnectorConfig.js";
import type { IIpfsBlobStorageConnectorConstructorOptions } from "./models/IIpfsBlobStorageConnectorConstructorOptions.js";

/**
 * Class for performing blob storage operations on IPFS.
 * See https://docs.ipfs.tech/reference/kubo/rpc/ for more information.
 */
export class IpfsBlobStorageConnector implements IBlobStorageConnector {
	/**
	 * The namespace for the items.
	 */
	public static readonly NAMESPACE: string = "ipfs";

	/**
	 * Runtime name for the class.
	 */
	public static readonly CLASS_NAME: string = nameof<IpfsBlobStorageConnector>();

	/**
	 * The configuration for the connector.
	 * @internal
	 */
	private readonly _config: IIpfsBlobStorageConnectorConfig;

	/**
	 * The keys to use from the context ids to create partitions.
	 * @internal
	 */
	private readonly _partitionContextIds?: string[];

	/**
	 * Create a new instance of IpfsBlobStorageConnector.
	 * @param options The options for the connector.
	 */
	constructor(options: IIpfsBlobStorageConnectorConstructorOptions) {
		Guards.object(IpfsBlobStorageConnector.CLASS_NAME, nameof(options), options);
		Guards.object<IIpfsBlobStorageConnectorConfig>(
			IpfsBlobStorageConnector.CLASS_NAME,
			nameof(options.config),
			options.config
		);
		Guards.stringValue(
			IpfsBlobStorageConnector.CLASS_NAME,
			nameof(options.config.apiUrl),
			options.config.apiUrl
		);

		this._config = options.config;
		this._partitionContextIds = options.partitionContextIds;
		this._config.apiUrl = StringHelper.trimTrailingSlashes(this._config.apiUrl);
	}

	/**
	 * Returns the class name of the component.
	 * @returns The class name of the component.
	 */
	public className(): string {
		return IpfsBlobStorageConnector.CLASS_NAME;
	}

	/**
	 * Returns the health status of the component.
	 * @returns The health status of the component.
	 */
	public async health(): Promise<IHealth[]> {
		try {
			const fetchOptions: RequestInit = {
				method: HttpMethod.POST,
				headers: {
					accept: MimeTypes.Json
				}
			};
			this.addSecurity(fetchOptions);
			const response = await fetch(`${this._config.apiUrl}/version`, fetchOptions);
			if (response.ok) {
				return [
					{
						source: IpfsBlobStorageConnector.CLASS_NAME,
						status: HealthStatus.Ok,
						description: "healthDescription",
						data: {
							apiUrl: this._config.apiUrl
						}
					}
				];
			}
		} catch {}
		return [
			{
				source: IpfsBlobStorageConnector.CLASS_NAME,
				status: HealthStatus.Error,
				description: "healthDescription",
				message: "healthCheckFailed",
				data: {
					apiUrl: this._config.apiUrl
				}
			}
		];
	}

	/**
	 * Set the blob.
	 * @param blob The data for the blob.
	 * @returns The id of the stored blob in urn format.
	 */
	public async set(blob: Uint8Array): Promise<string> {
		Guards.uint8Array(IpfsBlobStorageConnector.CLASS_NAME, nameof(blob), blob);

		try {
			const formBlob = new Blob([new Uint8Array(blob)], { type: MimeTypes.OctetStream });
			const formData = new FormData();
			formData.append("file", formBlob);

			const fetchOptions: RequestInit = {
				method: HttpMethod.POST,
				body: formData,
				headers: {
					[HeaderTypes.Accept]: MimeTypes.Json,
					[HeaderTypes.ContentDisposition]: "form-data"
				}
			};

			this.addSecurity(fetchOptions);

			const response = await fetch(`${this._config.apiUrl}/add?pin=true`, fetchOptions);

			if (response.ok) {
				const result = (await response.json()) as {
					Name: string;
					Hash: string;
					Size: string;
				};

				const partitionSegment = await this.buildPartitionSegment();
				const urnParts = Is.stringValue(partitionSegment)
					? [result.Hash, partitionSegment]
					: [result.Hash];

				return `blob:${new Urn(IpfsBlobStorageConnector.NAMESPACE, urnParts).toString()}`;
			}

			const error = await response.json();
			throw new GeneralError(IpfsBlobStorageConnector.CLASS_NAME, "fetchFail", error);
		} catch (err) {
			throw new GeneralError(IpfsBlobStorageConnector.CLASS_NAME, "setBlobFailed", undefined, err);
		}
	}

	/**
	 * Get the blob.
	 * @param id The id of the blob to get in urn format.
	 * @returns The data for the blob if it can be found or undefined.
	 */
	public async get(id: string): Promise<Uint8Array | undefined> {
		Urn.guard(IpfsBlobStorageConnector.CLASS_NAME, nameof(id), id);
		const urnParsed = Urn.fromValidString(id);

		if (urnParsed.namespaceMethod() !== IpfsBlobStorageConnector.NAMESPACE) {
			throw new GeneralError(IpfsBlobStorageConnector.CLASS_NAME, "namespaceMismatch", {
				namespace: IpfsBlobStorageConnector.NAMESPACE,
				id
			});
		}

		const partitionSegment = await this.buildPartitionSegment();
		const storedPartitionSegment = Is.stringValue(urnParsed.namespaceSpecific(2))
			? urnParsed.namespaceSpecific(2)
			: undefined;

		if (partitionSegment !== storedPartitionSegment) {
			return undefined;
		}

		const ipfsHash = urnParsed.namespaceSpecific(1).split(":")[0];

		try {
			const fetchOptions: RequestInit = {
				method: HttpMethod.POST,
				headers: {
					accept: MimeTypes.Json
				}
			};

			this.addSecurity(fetchOptions);

			const responseStat = await fetch(
				`${this._config.apiUrl}/block/stat?arg=${ipfsHash}&local=true`,
				fetchOptions
			);

			if (!responseStat.ok) {
				const resp = await responseStat.json();
				if (
					Is.object<{ Message: string }>(resp) &&
					Is.stringValue(resp.Message) &&
					resp.Message.includes("not found")
				) {
					return;
				}
			}

			const response = await fetch(`${this._config.apiUrl}/cat?arg=${ipfsHash}`, fetchOptions);

			if (response.ok) {
				const result = await response.arrayBuffer();
				return new Uint8Array(result);
			}

			const error = await response.json();
			throw new GeneralError(IpfsBlobStorageConnector.CLASS_NAME, "fetchFail", error);
		} catch (err) {
			throw new GeneralError(IpfsBlobStorageConnector.CLASS_NAME, "getBlobFailed", undefined, err);
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
			source: IpfsBlobStorageConnector.CLASS_NAME,
			message: "storeTearingDown"
		});

		try {
			const fetchOptions: RequestInit = {
				method: HttpMethod.POST,
				headers: {
					accept: MimeTypes.Json
				}
			};
			this.addSecurity(fetchOptions);

			const response = await fetch(`${this._config.apiUrl}/pin/ls`, fetchOptions);

			if (response.ok) {
				const result = (await response.json()) as { Keys: { [cid: string]: unknown } };

				for (const cid of Object.keys(result.Keys)) {
					const unpinFetchOptions: RequestInit = {
						method: HttpMethod.POST,
						headers: {
							accept: MimeTypes.Json
						}
					};
					this.addSecurity(unpinFetchOptions);
					await fetch(`${this._config.apiUrl}/pin/rm?arg=${cid}`, unpinFetchOptions);
				}
			}

			await nodeLogging?.log({
				level: "info",
				source: IpfsBlobStorageConnector.CLASS_NAME,
				message: "storeTornDown"
			});

			return true;
		} catch (err) {
			await nodeLogging?.log({
				level: "error",
				source: IpfsBlobStorageConnector.CLASS_NAME,
				message: "teardownFailed",
				error: BaseError.fromError(err)
			});
			return false;
		}
	}

	/**
	 * Remove all blobs from the storage.
	 * @returns Nothing.
	 */
	public async empty(): Promise<void> {
		try {
			const fetchOptions: RequestInit = {
				method: HttpMethod.POST,
				headers: {
					accept: MimeTypes.Json
				}
			};
			this.addSecurity(fetchOptions);

			const response = await fetch(`${this._config.apiUrl}/pin/ls`, fetchOptions);

			if (response.ok) {
				const result = (await response.json()) as { Keys: { [cid: string]: unknown } };

				for (const cid of Object.keys(result.Keys)) {
					const unpinFetchOptions: RequestInit = {
						method: HttpMethod.POST,
						headers: {
							accept: MimeTypes.Json
						}
					};
					this.addSecurity(unpinFetchOptions);
					await fetch(`${this._config.apiUrl}/pin/rm?arg=${cid}`, unpinFetchOptions);
				}
			}

			const gcFetchOptions: RequestInit = {
				method: HttpMethod.POST,
				headers: {
					accept: MimeTypes.Json
				}
			};
			this.addSecurity(gcFetchOptions);
			const gcResponse = await fetch(`${this._config.apiUrl}/repo/gc`, gcFetchOptions);
			await gcResponse.text();
		} catch (err) {
			throw new GeneralError(IpfsBlobStorageConnector.CLASS_NAME, "emptyFailed", undefined, err);
		}
	}

	/**
	 * Remove the blob.
	 * @param id The id of the blob to remove in urn format.
	 * @returns True if the blob was found.
	 */
	public async remove(id: string): Promise<boolean> {
		Urn.guard(IpfsBlobStorageConnector.CLASS_NAME, nameof(id), id);
		const urnParsed = Urn.fromValidString(id);

		if (urnParsed.namespaceMethod() !== IpfsBlobStorageConnector.NAMESPACE) {
			throw new GeneralError(IpfsBlobStorageConnector.CLASS_NAME, "namespaceMismatch", {
				namespace: IpfsBlobStorageConnector.NAMESPACE,
				id
			});
		}

		const partitionSegment = await this.buildPartitionSegment();
		const storedPartitionSegment = Is.stringValue(urnParsed.namespaceSpecific(2))
			? urnParsed.namespaceSpecific(2)
			: undefined;

		if (partitionSegment !== storedPartitionSegment) {
			return false;
		}

		const ipfsHash = urnParsed.namespaceSpecific(1).split(":")[0];

		try {
			const fetchOptions: RequestInit = {
				method: HttpMethod.POST,
				headers: {
					accept: MimeTypes.Json
				}
			};

			this.addSecurity(fetchOptions);

			const response = await fetch(`${this._config.apiUrl}/pin/rm?arg=${ipfsHash}`, fetchOptions);

			if (response.ok) {
				return true;
			}

			const error = await response.json();
			throw new GeneralError(IpfsBlobStorageConnector.CLASS_NAME, "fetchFail", error);
		} catch (err) {
			throw new GeneralError(
				IpfsBlobStorageConnector.CLASS_NAME,
				"removeBlobFailed",
				undefined,
				err
			);
		}
	}

	/**
	 * Add the security to the request.
	 * @param requestInit The request options.
	 * @internal
	 */
	private addSecurity(requestInit: RequestInit): void {
		if (Is.stringValue(this._config.bearerToken)) {
			requestInit.headers = {
				...requestInit.headers,
				[HeaderTypes.Authorization]: HeaderHelper.createBearer(this._config.bearerToken)
			};
		}
	}

	/**
	 * Build the partition segment from the current context.
	 * @returns The hex-encoded Blake2b hash of the partition key, or undefined if no partition applies.
	 * @internal
	 */
	private async buildPartitionSegment(): Promise<string | undefined> {
		const contextIds = await ContextIdStore.getContextIds();
		const partitionKey = ContextIdHelper.combinedContextKey(contextIds, this._partitionContextIds);
		if (Is.stringValue(partitionKey)) {
			return Converter.bytesToHex(Blake2b.sum256(Converter.utf8ToBytes(partitionKey)));
		}
		return undefined;
	}
}
