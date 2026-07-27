// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import {
	BlobStorageConnectorFactory,
	BlobStorageContexts,
	BlobStorageTypes,
	type BlobStorageCompressionType,
	type IBlobStorageComponent,
	type IBlobStorageConnector,
	type IBlobStorageEntry,
	type IBlobStorageEntryList
} from "@twin.org/blob-storage-models";
import { ContextIdHelper, ContextIdKeys, ContextIdStore } from "@twin.org/context";
import {
	Compression,
	Converter,
	GeneralError,
	Guards,
	Is,
	NotFoundError,
	Urn,
	Validation,
	type IValidationFailure
} from "@twin.org/core";
import { IntegrityAlgorithm, IntegrityHelper } from "@twin.org/crypto";
import { JsonLdHelper, JsonLdProcessor, type IJsonLdNodeObject } from "@twin.org/data-json-ld";
import {
	ComparisonOperator,
	EntitySchemaHelper,
	LogicalOperator,
	SortDirection,
	type EntityCondition
} from "@twin.org/entity";
import {
	EntityStorageConnectorFactory,
	type IEntityStorageConnector
} from "@twin.org/entity-storage-models";
import { nameof } from "@twin.org/nameof";
import {
	SchemaOrgContexts,
	SchemaOrgDataTypes,
	SchemaOrgTypes
} from "@twin.org/standards-schema-org";
import {
	VaultConnectorFactory,
	VaultEncryptionType,
	type IVaultConnector
} from "@twin.org/vault-models";
import { MimeTypeHelper } from "@twin.org/web";
import type { BlobStorageEntry } from "./entities/blobStorageEntry.js";
import type { IBlobStorageServiceConstructorOptions } from "./models/IBlobStorageServiceConstructorOptions.js";

/**
 * Service for performing blob storage operations to a connector.
 */
export class BlobStorageService implements IBlobStorageComponent {
	/**
	 * Runtime name for the class.
	 */
	public static readonly CLASS_NAME: string = nameof<BlobStorageService>();

	/**
	 * The namespace supported by the blob storage service.
	 * @internal
	 */
	private static readonly _NAMESPACE: string = "blob";

	/**
	 * The namespace of the default storage connector to use.
	 * Defaults to the first entry in the factory if not provided.
	 * @internal
	 */
	private readonly _defaultNamespace: string;

	/**
	 * The storage connector for the metadata.
	 * @internal
	 */
	private readonly _entryEntityStorage: IEntityStorageConnector<BlobStorageEntry>;

	/**
	 * The vault connector for the encryption, can be undefined if no encryption required.
	 * @internal
	 */
	private readonly _vaultConnector?: IVaultConnector;

	/**
	 * The id of the vault key to use for encryption if the service has a vault connector configured.
	 * @internal
	 */
	private readonly _vaultKeyId: string | undefined;

	/**
	 * Create a new instance of BlobStorageService.
	 * @param options The options for the service.
	 * @throws {GeneralError} If no blob storage connectors are registered.
	 */
	constructor(options?: IBlobStorageServiceConstructorOptions) {
		const names = BlobStorageConnectorFactory.names();
		if (names.length === 0) {
			throw new GeneralError(BlobStorageService.CLASS_NAME, "noConnectors");
		}

		this._entryEntityStorage = EntityStorageConnectorFactory.get(
			options?.entryEntityStorageType ?? "blob-storage-entry"
		);
		if (Is.stringValue(options?.vaultConnectorType)) {
			this._vaultConnector = VaultConnectorFactory.get(options.vaultConnectorType);
		}

		this._defaultNamespace = options?.config?.defaultNamespace ?? names[0];
		this._vaultKeyId = options?.config?.vaultKeyId;

		SchemaOrgDataTypes.registerRedirects();
	}

	/**
	 * Returns the class name of the component.
	 * @returns The class name of the component.
	 */
	public className(): string {
		return BlobStorageService.CLASS_NAME;
	}

	/**
	 * Create the blob with some metadata.
	 * @param blob The data for the blob in base64 format.
	 * @param encodingFormat Mime type for the blob, will be detected if left undefined.
	 * @param fileExtension Extension for the blob, will be detected if left undefined.
	 * @param metadata Data for the custom metadata as JSON-LD.
	 * @param options Optional options for the creation of the blob.
	 * @param options.disableEncryption Disables encryption if enabled by default.
	 * @param options.overrideVaultKeyId Use a different vault key id for encryption, if not provided the default vault key id will be used.
	 * @param options.compress Optional compression type to use for the blob, defaults to no compression.
	 * @param options.namespace The namespace to use for storing, defaults to component configured namespace.
	 * @returns The id of the stored blob in urn format.
	 */
	public async create(
		blob: string,
		encodingFormat?: string,
		fileExtension?: string,
		metadata?: IJsonLdNodeObject,
		options?: {
			disableEncryption?: boolean;
			overrideVaultKeyId?: string;
			compress?: BlobStorageCompressionType;
			namespace?: string;
		}
	): Promise<string> {
		Guards.stringBase64(BlobStorageService.CLASS_NAME, nameof(blob), blob);

		const disableEncryption = options?.disableEncryption ?? false;
		const vaultKeyId = options?.overrideVaultKeyId ?? this._vaultKeyId;
		const encryptionEnabled = !disableEncryption && Is.stringValue(vaultKeyId);

		try {
			const connectorNamespace = options?.namespace ?? this._defaultNamespace;

			const blobStorageConnector =
				BlobStorageConnectorFactory.get<IBlobStorageConnector>(connectorNamespace);

			// Convert the base64 data into bytes
			let storeBlob = Converter.base64ToBytes(blob);
			const blobSize = storeBlob.length;

			// See if we can detect the mime type and default extension for the data.
			// If not already supplied by the caller. We have to perform this operation
			// on the unencrypted data.
			if (!Is.stringValue(encodingFormat)) {
				encodingFormat = await MimeTypeHelper.detect(storeBlob);
			}

			if (!Is.stringValue(fileExtension) && Is.stringValue(encodingFormat)) {
				fileExtension = MimeTypeHelper.defaultExtension(encodingFormat);
			}

			if (Is.object(metadata)) {
				const validationFailures: IValidationFailure[] = [];
				await JsonLdHelper.validate(metadata, validationFailures);
				Validation.asValidationError(
					BlobStorageService.CLASS_NAME,
					nameof(metadata),
					validationFailures
				);
			}

			const integrity = IntegrityHelper.generate(IntegrityAlgorithm.Sha256, storeBlob);

			if (!Is.empty(options?.compress)) {
				storeBlob = await Compression.compress(storeBlob, options.compress);
			}

			// If we have a vault connector then encrypt the data.
			if (encryptionEnabled) {
				const contextIds = await ContextIdStore.getContextIds();
				ContextIdHelper.guard(contextIds, ContextIdKeys.Organization);

				if (Is.empty(this._vaultConnector)) {
					throw new GeneralError(BlobStorageService.CLASS_NAME, "vaultConnectorNotConfigured");
				}
				storeBlob = await this._vaultConnector.encrypt(
					`${contextIds[ContextIdKeys.Organization]}/${vaultKeyId}`,
					VaultEncryptionType.ChaCha20Poly1305,
					storeBlob
				);
			}

			// Set the blob in the storage connector, which may now be encrypted
			const blobId = await blobStorageConnector.set(storeBlob);

			// Now store the entry in entity storage
			const blobEntry: BlobStorageEntry = {
				id: blobId,
				dateCreated: new Date(Date.now()).toISOString(),
				blobSize,
				integrity,
				encodingFormat,
				fileExtension,
				metadata,
				isEncrypted: encryptionEnabled,
				compression: options?.compress
			};

			await this._entryEntityStorage.set(blobEntry);

			return blobId;
		} catch (error) {
			throw new GeneralError(BlobStorageService.CLASS_NAME, "createFailed", undefined, error);
		}
	}

	/**
	 * Get the blob entry.
	 * @param id The id of the blob to get in urn format.
	 * @param options Optional options for the retrieval of the blob.
	 * @param options.includeContent Include the content, or just get the metadata.
	 * @param options.overrideVaultKeyId Use a different vault key id for decryption, if not provided the default vault key id will be used.
	 * @param options.decompress If the content should be decompressed, if it was compressed when stored, defaults to true.
	 * @returns The entry and data for the blob if it can be found.
	 * @throws Not found error if the blob cannot be found.
	 */
	public async get(
		id: string,
		options?: {
			includeContent?: boolean;
			decompress?: boolean;
			overrideVaultKeyId?: string;
		}
	): Promise<IBlobStorageEntry> {
		Urn.guard(BlobStorageService.CLASS_NAME, nameof(id), id);

		const includeContent = options?.includeContent ?? false;
		const vaultKeyId = options?.overrideVaultKeyId ?? this._vaultKeyId;

		try {
			const blobEntry = await this.internalGet(id);

			let returnBlob: Uint8Array | undefined;
			if (includeContent) {
				const blobStorageConnector = this.getConnector(id);
				returnBlob = await blobStorageConnector.get(id);
				if (Is.undefined(returnBlob)) {
					throw new NotFoundError(BlobStorageService.CLASS_NAME, "blobNotFound", id);
				}

				// If the data is encrypted then decrypt it.
				const decryptionEnabled = blobEntry.isEncrypted && Is.stringValue(vaultKeyId);
				if (decryptionEnabled) {
					const contextIds = await ContextIdStore.getContextIds();
					ContextIdHelper.guard(contextIds, ContextIdKeys.Organization);

					if (Is.empty(this._vaultConnector)) {
						throw new GeneralError(BlobStorageService.CLASS_NAME, "vaultConnectorNotConfigured");
					}

					returnBlob = await this._vaultConnector.decrypt(
						`${contextIds[ContextIdKeys.Organization]}/${vaultKeyId}`,
						VaultEncryptionType.ChaCha20Poly1305,
						returnBlob
					);
				}

				if (!Is.empty(blobEntry.compression) && (options?.decompress ?? true)) {
					returnBlob = await Compression.decompress(returnBlob, blobEntry.compression);
				}
			}

			const jsonLd = this.entryToJsonLd(blobEntry, returnBlob);
			const result = await JsonLdProcessor.compact(jsonLd, jsonLd["@context"], {
				compactArrays: false
			});
			return result;
		} catch (error) {
			throw new GeneralError(BlobStorageService.CLASS_NAME, "getFailed", undefined, error);
		}
	}

	/**
	 * Update the blob with metadata.
	 * @param id The id of the blob entry to update.
	 * @param encodingFormat Mime type for the blob, will be detected if left undefined.
	 * @param fileExtension Extension for the blob, will be detected if left undefined.
	 * @param metadata Data for the custom metadata as JSON-LD.
	 * @returns A promise that resolves when the blob metadata has been updated.
	 * @throws Not found error if the blob cannot be found.
	 */
	public async update(
		id: string,
		encodingFormat?: string,
		fileExtension?: string,
		metadata?: IJsonLdNodeObject
	): Promise<void> {
		Urn.guard(BlobStorageService.CLASS_NAME, nameof(id), id);

		try {
			const blobEntry = await this._entryEntityStorage.get(id);

			if (Is.undefined(blobEntry)) {
				throw new NotFoundError(BlobStorageService.CLASS_NAME, "blobNotFound", id);
			}

			if (Is.object(metadata)) {
				const validationFailures: IValidationFailure[] = [];
				await JsonLdHelper.validate(metadata, validationFailures);
				Validation.asValidationError(
					BlobStorageService.CLASS_NAME,
					nameof(metadata),
					validationFailures
				);
			}

			// Now store the entry in entity storage
			const updatedBlobEntry: BlobStorageEntry = {
				id: blobEntry.id,
				dateCreated: blobEntry.dateCreated,
				dateModified: new Date(Date.now()).toISOString(),
				blobSize: blobEntry.blobSize,
				integrity: blobEntry.integrity,
				encodingFormat: encodingFormat ?? blobEntry.encodingFormat,
				fileExtension: fileExtension ?? blobEntry.fileExtension,
				metadata: metadata ?? blobEntry.metadata,
				isEncrypted: blobEntry.isEncrypted,
				compression: blobEntry.compression
			};

			await this._entryEntityStorage.set(updatedBlobEntry);
		} catch (error) {
			throw new GeneralError(BlobStorageService.CLASS_NAME, "updateFailed", undefined, error);
		}
	}

	/**
	 * Remove all blobs from the storage.
	 * @returns A promise that resolves when all blobs have been removed.
	 */
	public async empty(): Promise<void> {
		try {
			let moreData = true;
			while (moreData) {
				const result = await this._entryEntityStorage.query(
					undefined,
					undefined,
					undefined,
					undefined,
					100
				);

				if (result.entities.length === 0) {
					moreData = false;
				} else {
					for (const entity of result.entities) {
						const entry = entity as BlobStorageEntry;
						const blobStorageConnector = this.getConnector(entry.id);
						await blobStorageConnector.remove(entry.id);
						await this._entryEntityStorage.remove(entry.id);
					}
				}
			}
		} catch (error) {
			throw new GeneralError(BlobStorageService.CLASS_NAME, "emptyFailed", undefined, error);
		}
	}

	/**
	 * Remove the blob.
	 * @param id The id of the blob to remove in urn format.
	 * @returns A promise that resolves when the blob has been removed.
	 * @throws Not found error if the blob cannot be found.
	 */
	public async remove(id: string): Promise<void> {
		Urn.guard(BlobStorageService.CLASS_NAME, nameof(id), id);

		try {
			const blobStorageConnector = this.getConnector(id);

			await this._entryEntityStorage.remove(id);

			const removed = await blobStorageConnector.remove(id);

			if (!removed) {
				throw new NotFoundError(BlobStorageService.CLASS_NAME, "blobNotFound", id);
			}
		} catch (error) {
			throw new GeneralError(BlobStorageService.CLASS_NAME, "removeFailed", undefined, error);
		}
	}

	/**
	 * Query all the blob storage entries which match the conditions.
	 * @param conditions The conditions to match for the entries.
	 * @param orderBy The order for the results, defaults to created.
	 * @param orderByDirection The direction for the order, defaults to descending.
	 * @param cursor The cursor to request the next page of entries.
	 * @param limit The suggested number of entries to return in each chunk, in some scenarios can return a different amount.
	 * @returns All the entries for the storage matching the conditions,
	 * and a cursor which can be used to request more entities.
	 */
	public async query(
		conditions?: EntityCondition<IBlobStorageEntry>,
		orderBy?: keyof Pick<IBlobStorageEntry, "dateCreated" | "dateModified">,
		orderByDirection?: SortDirection,
		cursor?: string,
		limit?: number
	): Promise<{
		entries: IBlobStorageEntryList;
		cursor?: string;
	}> {
		const orderProperty = orderBy ?? "dateCreated";
		const orderDirection = orderByDirection ?? SortDirection.Descending;

		const result = await this._entryEntityStorage.query(
			conditions,
			[
				{
					property: orderProperty,
					sortDirection: orderDirection
				}
			],
			undefined,
			cursor,
			limit
		);

		let context: IBlobStorageEntryList["@context"] = [
			SchemaOrgContexts.Context,
			BlobStorageContexts.Context,
			BlobStorageContexts.ContextCommon
		];
		const entriesJsonLd = [];

		for (const entry of result.entities) {
			// The entries are never Partial as we don't allow custom property requests.
			entriesJsonLd.push(this.entryToJsonLd(entry as BlobStorageEntry));
			context = JsonLdProcessor.combineContexts(
				context,
				entry.metadata?.["@context"]
			) as IBlobStorageEntryList["@context"];
		}

		const jsonLd: IBlobStorageEntryList = {
			"@context": context,
			type: SchemaOrgTypes.ItemList,
			[SchemaOrgTypes.ItemListElement]: entriesJsonLd
		};

		return {
			entries: await JsonLdProcessor.compact(jsonLd, jsonLd["@context"], { compactArrays: false }),
			cursor: result.cursor
		};
	}

	/**
	 * Get the connector from the uri.
	 * @param id The id of the blob storage item in urn format.
	 * @returns The connector.
	 * @throws {GeneralError} If the namespace does not match.
	 * @internal
	 */
	private getConnector(id: string): IBlobStorageConnector {
		const idUri = Urn.fromValidString(id);

		if (idUri.namespaceIdentifier() !== BlobStorageService._NAMESPACE) {
			throw new GeneralError(BlobStorageService.CLASS_NAME, "namespaceMismatch", {
				namespace: BlobStorageService._NAMESPACE,
				id
			});
		}

		return BlobStorageConnectorFactory.get<IBlobStorageConnector>(idUri.namespaceMethod());
	}

	/**
	 * Get an entity.
	 * @param id The id of the entity to get.
	 * @returns The object if it can be found or throws.
	 * @internal
	 */
	private async internalGet(id: string): Promise<BlobStorageEntry> {
		const schema = this._entryEntityStorage.getSchema();
		const primaryKey = EntitySchemaHelper.getPrimaryKey(schema);

		const conditions: EntityCondition<BlobStorageEntry>[] = [
			{
				property: primaryKey.property,
				comparison: ComparisonOperator.Equals,
				value: id
			}
		];

		const results = await this._entryEntityStorage.query(
			{
				conditions,
				logicalOperator: LogicalOperator.And
			},
			undefined,
			undefined,
			undefined,
			1
		);

		const entity = results.entities[0] as BlobStorageEntry;

		if (Is.empty(entity)) {
			throw new NotFoundError(BlobStorageService.CLASS_NAME, "entityNotFound", id);
		}

		return entity;
	}

	/**
	 * Convert the entry to JSON-LD.
	 * @param entry The entry to convert.
	 * @param blob The optional blob to return.
	 * @returns The JSON-LD representation of the entry.
	 * @internal
	 */
	private entryToJsonLd(entry: BlobStorageEntry, blob?: Uint8Array): IBlobStorageEntry {
		const jsonLd: IBlobStorageEntry = {
			"@context": JsonLdProcessor.combineContexts(
				[BlobStorageContexts.Context, BlobStorageContexts.ContextCommon, SchemaOrgContexts.Context],
				entry?.metadata?.["@context"]
			) as IBlobStorageEntry["@context"],
			id: entry.id,
			type: BlobStorageTypes.Entry,
			dateCreated: entry.dateCreated,
			dateModified: entry.dateModified,
			blobSize: entry.blobSize,
			integrity: entry.integrity,
			encodingFormat: entry?.encodingFormat,
			fileExtension: entry?.fileExtension,
			metadata: entry?.metadata,
			blob: Is.uint8Array(blob) ? Converter.bytesToBase64(blob) : undefined,
			isEncrypted: entry.isEncrypted,
			compression: entry.compression
		};

		return jsonLd;
	}
}
