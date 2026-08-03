// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import {
	HealthCategory,
	HealthStatus,
	type IHealth,
	type IHealthProviderComponent
} from "@twin.org/api-models";
import type { IBlobStorageConnector } from "@twin.org/blob-storage-models";
import { ContextIdHelper, ContextIdStore } from "@twin.org/context";
import { ComponentFactory, Converter, GeneralError, Guards, Urn } from "@twin.org/core";
import { Sha256 } from "@twin.org/crypto";
import type { ILoggingComponent } from "@twin.org/logging-models";
import { nameof } from "@twin.org/nameof";
import type { IMemoryStorageConnectorConstructorOptions } from "./models/IMemoryStorageConnectorConstructorOptions.js";

/**
 * Class for performing blob storage operations in-memory.
 */
export class MemoryBlobStorageConnector implements IBlobStorageConnector, IHealthProviderComponent {
	/**
	 * The namespace for the items.
	 */
	public static readonly NAMESPACE: string = "memory";

	/**
	 * Runtime name for the class.
	 */
	public static readonly CLASS_NAME: string = nameof<MemoryBlobStorageConnector>();

	/**
	 * The keys to use from the context ids to create partitions.
	 * @internal
	 */
	private readonly _partitionContextIds?: string[];

	/**
	 * The storage for the in-memory items.
	 * @internal
	 */
	private readonly _store: { [id: string]: Uint8Array };

	/**
	 * Create a new instance of MemoryBlobStorageConnector.
	 * @param options The options for the connector.
	 */
	constructor(options?: IMemoryStorageConnectorConstructorOptions) {
		this._partitionContextIds = options?.partitionContextIds;
		this._store = {};
	}

	/**
	 * Returns the class name of the component.
	 * @returns The class name of the component.
	 */
	public className(): string {
		return MemoryBlobStorageConnector.CLASS_NAME;
	}

	/**
	 * Returns the health status of the component.
	 * @param lastTimestamp The Unix timestamp (ms) recorded at the start of the previous cycle.
	 * @returns The health status of the component.
	 */
	public async health(lastTimestamp: number): Promise<IHealth[]> {
		return [
			{
				source: MemoryBlobStorageConnector.CLASS_NAME,
				category: HealthCategory.Connectivity,
				status: HealthStatus.Ok,
				description: "healthDescription",
				data: {
					storedItemCount: Object.keys(this._store).length
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
		Guards.uint8Array(MemoryBlobStorageConnector.CLASS_NAME, nameof(blob), blob);

		const contextIds = await ContextIdStore.getContextIds();
		const partitionKey = ContextIdHelper.combinedContextKey(contextIds, this._partitionContextIds);

		const id = Converter.bytesToHex(Sha256.sum256(blob));

		const fullKey = `${partitionKey ?? "root"}/${id}`;
		this._store[fullKey] = blob;

		return `blob:${new Urn(MemoryBlobStorageConnector.NAMESPACE, id).toString()}`;
	}

	/**
	 * Get the blob.
	 * @param id The id of the blob to get in urn format.
	 * @returns The data for the blob if it can be found or undefined.
	 */
	public async get(id: string): Promise<Uint8Array | undefined> {
		Urn.guard(MemoryBlobStorageConnector.CLASS_NAME, nameof(id), id);

		const contextIds = await ContextIdStore.getContextIds();
		const partitionKey = ContextIdHelper.combinedContextKey(contextIds, this._partitionContextIds);

		const urnParsed = Urn.fromValidString(id);

		if (urnParsed.namespaceMethod() !== MemoryBlobStorageConnector.NAMESPACE) {
			throw new GeneralError(MemoryBlobStorageConnector.CLASS_NAME, "namespaceMismatch", {
				namespace: MemoryBlobStorageConnector.NAMESPACE,
				id
			});
		}

		const namespaceId = urnParsed.namespaceSpecific(1);
		const fullKey = `${partitionKey ?? "root"}/${namespaceId}`;
		return this._store[fullKey];
	}

	/**
	 * Remove the blob.
	 * @param id The id of the blob to remove in urn format.
	 * @returns True if the blob was found.
	 */
	public async remove(id: string): Promise<boolean> {
		Urn.guard(MemoryBlobStorageConnector.CLASS_NAME, nameof(id), id);

		const contextIds = await ContextIdStore.getContextIds();
		const partitionKey = ContextIdHelper.combinedContextKey(contextIds, this._partitionContextIds);

		const urnParsed = Urn.fromValidString(id);

		if (urnParsed.namespaceMethod() !== MemoryBlobStorageConnector.NAMESPACE) {
			throw new GeneralError(MemoryBlobStorageConnector.CLASS_NAME, "namespaceMismatch", {
				namespace: MemoryBlobStorageConnector.NAMESPACE,
				id
			});
		}

		const namespaceId = urnParsed.namespaceSpecific(1);
		const fullKey = `${partitionKey ?? "root"}/${namespaceId}`;
		if (this._store[fullKey]) {
			delete this._store[fullKey];
			return true;
		}
		return false;
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
			source: MemoryBlobStorageConnector.CLASS_NAME,
			message: "storeTearingDown"
		});

		for (const key of Object.keys(this._store)) {
			delete this._store[key];
		}

		await nodeLogging?.log({
			level: "info",
			source: MemoryBlobStorageConnector.CLASS_NAME,
			message: "storeTornDown"
		});

		return true;
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
			for (const key of Object.keys(this._store)) {
				if (key.startsWith(prefix)) {
					delete this._store[key];
				}
			}
		} catch (err) {
			throw new GeneralError(MemoryBlobStorageConnector.CLASS_NAME, "emptyFailed", undefined, err);
		}
	}

	/**
	 * Get the memory store.
	 * @returns The store.
	 */
	public async getStore(): Promise<{ [id: string]: Uint8Array }> {
		return this._store;
	}
}
