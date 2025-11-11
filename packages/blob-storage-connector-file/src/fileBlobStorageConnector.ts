// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { access, mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
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
import type { IFileBlobStorageConnectorConstructorOptions } from "./models/IFileBlobStorageConnectorConstructorOptions.js";

/**
 * Class for performing blob storage operations in file.
 */
export class FileBlobStorageConnector implements IBlobStorageConnector {
	/**
	 * The namespace for the items.
	 */
	public static readonly NAMESPACE: string = "file";

	/**
	 * Runtime name for the class.
	 */
	public static readonly CLASS_NAME: string = nameof<FileBlobStorageConnector>();

	/**
	 * The directory to use for storage.
	 * @internal
	 */
	private readonly _directory: string;

	/**
	 * The extension to use for storage.
	 * @internal
	 */
	private readonly _extension: string;

	/**
	 * The keys to use from the context ids to create partitions.
	 * @internal
	 */
	private readonly _partitionContextIds?: string[];

	/**
	 * Create a new instance of FileBlobStorageConnector.
	 * @param options The options for the connector.
	 */
	constructor(options: IFileBlobStorageConnectorConstructorOptions) {
		Guards.object(FileBlobStorageConnector.CLASS_NAME, nameof(options), options);
		Guards.object(FileBlobStorageConnector.CLASS_NAME, nameof(options.config), options.config);
		Guards.stringValue(
			FileBlobStorageConnector.CLASS_NAME,
			nameof(options.config.directory),
			options.config.directory
		);
		this._directory = path.resolve(options.config.directory);
		this._extension = options.config.extension ?? ".blob";
		this._partitionContextIds = options.partitionContextIds;
	}

	/**
	 * Returns the class name of the component.
	 * @returns The class name of the component.
	 */
	public className(): string {
		return FileBlobStorageConnector.CLASS_NAME;
	}

	/**
	 * Bootstrap the component by creating and initializing any resources it needs.
	 * @param nodeLoggingComponentType The node logging component type.
	 * @returns True if the bootstrapping process was successful.
	 */
	public async bootstrap(nodeLoggingComponentType?: string): Promise<boolean> {
		const nodeLogging = ComponentFactory.getIfExists<ILoggingComponent>(nodeLoggingComponentType);

		if (!(await this.dirExists(this._directory))) {
			try {
				await nodeLogging?.log({
					level: "info",
					source: FileBlobStorageConnector.CLASS_NAME,
					message: "directoryCreating",
					data: {
						directory: this._directory
					}
				});
				await mkdir(this._directory, { recursive: true });
			} catch (err) {
				await nodeLogging?.log({
					level: "error",
					source: FileBlobStorageConnector.CLASS_NAME,
					message: "directoryCreateFailed",
					data: {
						directory: this._directory
					},
					error: BaseError.fromError(err)
				});
				return false;
			}
		} else {
			await nodeLogging?.log({
				level: "info",
				source: FileBlobStorageConnector.CLASS_NAME,
				message: "directoryExists",
				data: {
					directory: this._directory
				}
			});
		}

		return true;
	}

	/**
	 * Set the blob.
	 * @param blob The data for the blob.
	 * @returns The id of the stored blob in urn format.
	 */
	public async set(blob: Uint8Array): Promise<string> {
		Guards.uint8Array(FileBlobStorageConnector.CLASS_NAME, nameof(blob), blob);

		const contextIds = await ContextIdStore.getContextIds();
		const partitionKey = ContextIdHelper.combinedContextKey(contextIds, this._partitionContextIds);

		try {
			const id = Converter.bytesToHex(Sha256.sum256(blob));

			const fullPath = this.createFullPath(id, partitionKey);

			const dir = path.dirname(fullPath);
			if (!(await this.dirExists(dir))) {
				await mkdir(dir, { recursive: true });
			}

			await writeFile(fullPath, blob);

			return `blob:${new Urn(FileBlobStorageConnector.NAMESPACE, id).toString()}`;
		} catch (err) {
			throw new GeneralError(FileBlobStorageConnector.CLASS_NAME, "setBlobFailed", undefined, err);
		}
	}

	/**
	 * Get the blob.
	 * @param id The id of the blob to get in urn format.
	 * @returns The data for the blob if it can be found or undefined.
	 */
	public async get(id: string): Promise<Uint8Array | undefined> {
		Urn.guard(FileBlobStorageConnector.CLASS_NAME, nameof(id), id);
		const urnParsed = Urn.fromValidString(id);

		const contextIds = await ContextIdStore.getContextIds();
		const partitionKey = ContextIdHelper.combinedContextKey(contextIds, this._partitionContextIds);

		if (urnParsed.namespaceMethod() !== FileBlobStorageConnector.NAMESPACE) {
			throw new GeneralError(FileBlobStorageConnector.CLASS_NAME, "namespaceMismatch", {
				namespace: FileBlobStorageConnector.NAMESPACE,
				id
			});
		}

		try {
			const fullPath = this.createFullPath(urnParsed.namespaceSpecific(1), partitionKey);

			return await readFile(fullPath);
		} catch (err) {
			if (BaseError.isErrorCode(err, "ENOENT")) {
				return;
			}
			throw new GeneralError(FileBlobStorageConnector.CLASS_NAME, "getBlobFailed", { id }, err);
		}
	}

	/**
	 * Remove the blob.
	 * @param id The id of the blob to remove in urn format.
	 * @returns True if the blob was found.
	 */
	public async remove(id: string): Promise<boolean> {
		Urn.guard(FileBlobStorageConnector.CLASS_NAME, nameof(id), id);

		const urnParsed = Urn.fromValidString(id);

		const contextIds = await ContextIdStore.getContextIds();
		const partitionKey = ContextIdHelper.combinedContextKey(contextIds, this._partitionContextIds);

		if (urnParsed.namespaceMethod() !== FileBlobStorageConnector.NAMESPACE) {
			throw new GeneralError(FileBlobStorageConnector.CLASS_NAME, "namespaceMismatch", {
				namespace: FileBlobStorageConnector.NAMESPACE,
				id
			});
		}

		try {
			const fullPath = this.createFullPath(urnParsed.namespaceSpecific(1), partitionKey);

			await unlink(fullPath);

			return true;
		} catch (err) {
			if (BaseError.isErrorCode(err, "ENOENT")) {
				return false;
			}
			throw new GeneralError(FileBlobStorageConnector.CLASS_NAME, "removeBlobFailed", { id }, err);
		}
	}

	/**
	 * Check if the dir exists.
	 * @param dir The directory to check.
	 * @returns True if the dir exists.
	 * @internal
	 */
	private async dirExists(dir: string): Promise<boolean> {
		try {
			await access(dir);
			return true;
		} catch {
			return false;
		}
	}

	/**
	 * Create the full path for the blob.
	 * @param id The id of the blob.
	 * @param partitionKey The partition key.
	 * @returns The full path for the blob.
	 * @internal
	 */
	private createFullPath(id: string, partitionKey?: string): string {
		const partitionPath = Is.stringValue(partitionKey) ? path.join(partitionKey, id) : id;
		return path.join(this._directory, `${partitionPath}${this._extension}`);
	}
}
