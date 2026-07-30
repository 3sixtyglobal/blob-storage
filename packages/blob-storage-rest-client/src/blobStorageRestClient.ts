// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { BaseRestClient } from "@twin.org/api-core";
import {
	HttpHeaderHelper,
	HttpParameterHelper,
	type IBaseRestClientConfig,
	type ICreatedResponse,
	type INoContentResponse
} from "@twin.org/api-models";
import type {
	BlobStorageCompressionType,
	IBlobStorageComponent,
	IBlobStorageCreateRequest,
	IBlobStorageEmptyRequest,
	IBlobStorageEntry,
	IBlobStorageEntryList,
	IBlobStorageGetRequest,
	IBlobStorageGetResponse,
	IBlobStorageListRequest,
	IBlobStorageListResponse,
	IBlobStorageRemoveRequest,
	IBlobStorageUpdateRequest
} from "@twin.org/blob-storage-models";
import { Coerce, Guards, Is, StringHelper, Urn } from "@twin.org/core";
import type { IJsonLdNodeObject } from "@twin.org/data-json-ld";
import type { EntityCondition, SortDirection } from "@twin.org/entity";
import { nameof } from "@twin.org/nameof";
import { HeaderTypes, HttpMethod, MimeTypes } from "@twin.org/web";

/**
 * Client for performing blob storage through to REST endpoints.
 */
export class BlobStorageRestClient extends BaseRestClient implements IBlobStorageComponent {
	/**
	 * Runtime name for the class.
	 */
	public static readonly CLASS_NAME: string = nameof<BlobStorageRestClient>();

	/**
	 * Create a new instance of BlobStorageRestClient.
	 * @param config The configuration for the client.
	 */
	constructor(config: IBaseRestClientConfig) {
		super(BlobStorageRestClient.CLASS_NAME, config, "blob");
	}

	/**
	 * Returns the class name of the component.
	 * @returns The class name of the component.
	 */
	public className(): string {
		return BlobStorageRestClient.CLASS_NAME;
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
		Guards.stringBase64(BlobStorageRestClient.CLASS_NAME, nameof(blob), blob);

		const response = await this.fetch<IBlobStorageCreateRequest, ICreatedResponse>(
			"/",
			HttpMethod.POST,
			{
				body: {
					blob,
					encodingFormat,
					fileExtension,
					metadata,
					disableEncryption: options?.disableEncryption,
					overrideVaultKeyId: options?.overrideVaultKeyId,
					compress: options?.compress,
					namespace: options?.namespace
				}
			}
		);

		return HttpHeaderHelper.extractId(response.headers, `${this.getPathPrefix()}/:id`);
	}

	/**
	 * Get the blob and metadata.
	 * @param id The id of the blob to get in urn format.
	 * @param options Optional options for the retrieval of the blob.
	 * @param options.includeContent Include the content, or just get the metadata.
	 * @param options.overrideVaultKeyId Use a different vault key id for decryption, if not provided the default vault key id will be used.
	 * @param options.decompress If the content should be decompressed, if it was compressed when stored, defaults to true.
	 * @returns The metadata and data for the blob if it can be found.
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
		Urn.guard(BlobStorageRestClient.CLASS_NAME, nameof(id), id);

		const response = await this.fetch<IBlobStorageGetRequest, IBlobStorageGetResponse>(
			"/:id",
			HttpMethod.GET,
			{
				headers: {
					[HeaderTypes.Accept]: MimeTypes.JsonLd
				},
				pathParams: {
					id
				},
				query: {
					includeContent: Coerce.string(options?.includeContent),
					decompress: Coerce.string(options?.decompress),
					overrideVaultKeyId: options?.overrideVaultKeyId
				}
			}
		);

		return response.body;
	}

	/**
	 * Update the blob with metadata.
	 * @param id The id of the blob metadata to update.
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
		Urn.guard(BlobStorageRestClient.CLASS_NAME, nameof(id), id);

		await this.fetch<IBlobStorageUpdateRequest, INoContentResponse>("/:id", HttpMethod.PUT, {
			pathParams: {
				id
			},
			body: {
				encodingFormat,
				fileExtension,
				metadata
			}
		});
	}

	/**
	 * Remove all blobs from the storage.
	 * @returns A promise that resolves when all blobs have been removed.
	 */
	public async empty(): Promise<void> {
		await this.fetch<IBlobStorageEmptyRequest, INoContentResponse>("/", HttpMethod.DELETE);
	}

	/**
	 * Remove the blob.
	 * @param id The id of the blob to remove in urn format.
	 * @returns A promise that resolves when the blob has been removed.
	 */
	public async remove(id: string): Promise<void> {
		Urn.guard(BlobStorageRestClient.CLASS_NAME, nameof(id), id);

		await this.fetch<IBlobStorageRemoveRequest, INoContentResponse>("/:id", HttpMethod.DELETE, {
			pathParams: {
				id
			}
		});
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
		const response = await this.fetch<IBlobStorageListRequest, IBlobStorageListResponse>(
			"/",
			HttpMethod.GET,
			{
				headers: {
					[HeaderTypes.Accept]: MimeTypes.JsonLd
				},
				query: {
					conditions: HttpParameterHelper.objectToString(conditions),
					orderBy,
					orderByDirection,
					limit: Coerce.string(limit),
					cursor
				}
			}
		);

		return {
			entries: response.body,
			cursor: HttpHeaderHelper.extractCursor(response.headers)
		};
	}

	/**
	 * Create a download link for the blob.
	 * @param id The id of the blob to get in urn format.
	 * @param download Should the content disposition be set to download.
	 * @param filename The filename to use for the download.
	 * @returns The download link.
	 */
	public createDownloadLink(id: string, download?: boolean, filename?: string): string {
		Urn.guard(BlobStorageRestClient.CLASS_NAME, nameof(id), id);

		let link = StringHelper.trimTrailingSlashes(this.getEndpointWithPrefix());
		link += `/${id}/content`;

		const downloadQuery: string[] = [];
		if (download) {
			downloadQuery.push("download=true");
		}
		if (Is.stringValue(filename)) {
			downloadQuery.push(`filename=${encodeURIComponent(filename)}`);
		}
		if (downloadQuery.length > 0) {
			link += `?${downloadQuery.join("&")}`;
		}

		return link;
	}
}
