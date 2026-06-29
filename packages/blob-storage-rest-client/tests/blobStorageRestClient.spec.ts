// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IBlobStorageEntry, IBlobStorageEntryList } from "@twin.org/blob-storage-models";
import { BlobStorageContexts, BlobStorageTypes } from "@twin.org/blob-storage-models";
import { GuardError } from "@twin.org/core";
import { SchemaOrgContexts, SchemaOrgTypes } from "@twin.org/standards-schema-org";
import { HttpMethod } from "@twin.org/web";
import { BlobStorageRestClient } from "../src/blobStorageRestClient.js";
import {
	createdResponse,
	jsonResponse,
	noContentResponse,
	setupFetchMock,
	teardownFetchMock
} from "./helpers/restClientTestHelpers.js";

// OpenAPI spec: ../../blob-storage-service/docs/open-api/spec.json
const ENDPOINT = "http://localhost:8080";
const PREFIX = "blob";

const BLOB_ID = "urn:blob:default:abc123";
const LOCATION = `${ENDPOINT}/${PREFIX}/${BLOB_ID}`;

const TEST_BLOB_BASE64 = "SGVsbG8gV29ybGQ=";

const TEST_BLOB_ENTRY: IBlobStorageEntry = {
	"@context": [BlobStorageContexts.Context, BlobStorageContexts.ContextCommon],
	type: BlobStorageTypes.Entry,
	id: BLOB_ID,
	dateCreated: "2026-01-01T00:00:00.000Z",
	blobSize: 11,
	integrity: "sha256-abc123"
};

const TEST_BLOB_ENTRY_LIST: IBlobStorageEntryList = {
	"@context": [
		SchemaOrgContexts.Context,
		BlobStorageContexts.Context,
		BlobStorageContexts.ContextCommon
	],
	type: SchemaOrgTypes.ItemList,
	[SchemaOrgTypes.ItemListElement]: [TEST_BLOB_ENTRY]
};

const fetchMock = vi.fn();

describe("BlobStorageRestClient", () => {
	let client: BlobStorageRestClient;

	beforeEach(() => {
		setupFetchMock(fetchMock);
		client = new BlobStorageRestClient({ endpoint: ENDPOINT });
	});

	afterEach(() => {
		teardownFetchMock(fetchMock);
	});

	describe("create", () => {
		test("throws when blob is not valid base64", async () => {
			await expect(client.create("not-base64!!")).rejects.toMatchObject({
				name: GuardError.CLASS_NAME,
				message: "guard.stringBase64"
			});
		});

		test("sends POST to /{prefix}", async () => {
			fetchMock.mockResolvedValueOnce(createdResponse(LOCATION));

			await client.create(TEST_BLOB_BASE64);

			const [url, options] = fetchMock.mock.calls[0];
			expect(url).toBe(`${ENDPOINT}/${PREFIX}`);
			expect(options.method).toBe(HttpMethod.POST);
		});

		test("sends blob in the request body", async () => {
			fetchMock.mockResolvedValueOnce(createdResponse(LOCATION));

			await client.create(TEST_BLOB_BASE64);

			const [, options] = fetchMock.mock.calls[0];
			const body = JSON.parse(options.body);
			expect(body.blob).toBe(TEST_BLOB_BASE64);
		});

		test("sends encodingFormat in the request body when provided", async () => {
			fetchMock.mockResolvedValueOnce(createdResponse(LOCATION));

			await client.create(TEST_BLOB_BASE64, "text/plain");

			const [, options] = fetchMock.mock.calls[0];
			const body = JSON.parse(options.body);
			expect(body.encodingFormat).toBe("text/plain");
		});

		test("sends fileExtension in the request body when provided", async () => {
			fetchMock.mockResolvedValueOnce(createdResponse(LOCATION));

			await client.create(TEST_BLOB_BASE64, undefined, "txt");

			const [, options] = fetchMock.mock.calls[0];
			const body = JSON.parse(options.body);
			expect(body.fileExtension).toBe("txt");
		});

		test("sends namespace in the request body when provided via options", async () => {
			fetchMock.mockResolvedValueOnce(createdResponse(LOCATION));

			await client.create(TEST_BLOB_BASE64, undefined, undefined, undefined, {
				namespace: "custom-ns"
			});

			const [, options] = fetchMock.mock.calls[0];
			const body = JSON.parse(options.body);
			expect(body.namespace).toBe("custom-ns");
		});

		test("sends disableEncryption in the request body when provided via options", async () => {
			fetchMock.mockResolvedValueOnce(createdResponse(LOCATION));

			await client.create(TEST_BLOB_BASE64, undefined, undefined, undefined, {
				disableEncryption: true
			});

			const [, options] = fetchMock.mock.calls[0];
			const body = JSON.parse(options.body);
			expect(body.disableEncryption).toBe(true);
		});

		test("returns the Location header value as the blob id", async () => {
			fetchMock.mockResolvedValueOnce(createdResponse(LOCATION));

			const id = await client.create(TEST_BLOB_BASE64);

			expect(id).toBe(LOCATION);
		});
	});

	describe("get", () => {
		test("throws when id is not a URN", async () => {
			await expect(client.get("not-a-urn")).rejects.toMatchObject({
				name: GuardError.CLASS_NAME,
				message: "guard.urn"
			});
		});

		test("sends GET to /{prefix}/:id", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse(TEST_BLOB_ENTRY));

			await client.get(BLOB_ID);

			const [url, options] = fetchMock.mock.calls[0];
			expect(url).toBe(`${ENDPOINT}/${PREFIX}/${BLOB_ID}`);
			expect(options.method).toBe(HttpMethod.GET);
		});

		test("returns the entry from the response body", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse(TEST_BLOB_ENTRY));

			const result = await client.get(BLOB_ID);

			expect(result).toEqual(TEST_BLOB_ENTRY);
		});

		test("includes includeContent as a query parameter when true", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse(TEST_BLOB_ENTRY));

			await client.get(BLOB_ID, { includeContent: true });

			const [url] = fetchMock.mock.calls[0];
			expect(url).toContain("includeContent=true");
		});

		test("includes decompress as a query parameter when false", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse(TEST_BLOB_ENTRY));

			await client.get(BLOB_ID, { decompress: false });

			const [url] = fetchMock.mock.calls[0];
			expect(url).toContain("decompress=false");
		});

		test("includes overrideVaultKeyId as a query parameter when provided", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse(TEST_BLOB_ENTRY));

			await client.get(BLOB_ID, { overrideVaultKeyId: "key-abc" });

			const [url] = fetchMock.mock.calls[0];
			expect(url).toContain("overrideVaultKeyId=key-abc");
		});
	});

	describe("update", () => {
		test("throws when id is not a URN", async () => {
			await expect(client.update("not-a-urn")).rejects.toMatchObject({
				name: GuardError.CLASS_NAME,
				message: "guard.urn"
			});
		});

		test("sends PUT to /{prefix}/:id", async () => {
			fetchMock.mockResolvedValueOnce(noContentResponse());

			await client.update(BLOB_ID);

			const [url, options] = fetchMock.mock.calls[0];
			expect(url).toBe(`${ENDPOINT}/${PREFIX}/${BLOB_ID}`);
			expect(options.method).toBe(HttpMethod.PUT);
		});

		test("sends encodingFormat in the request body when provided", async () => {
			fetchMock.mockResolvedValueOnce(noContentResponse());

			await client.update(BLOB_ID, "image/png");

			const [, options] = fetchMock.mock.calls[0];
			const body = JSON.parse(options.body);
			expect(body.encodingFormat).toBe("image/png");
		});

		test("sends fileExtension in the request body when provided", async () => {
			fetchMock.mockResolvedValueOnce(noContentResponse());

			await client.update(BLOB_ID, undefined, "png");

			const [, options] = fetchMock.mock.calls[0];
			const body = JSON.parse(options.body);
			expect(body.fileExtension).toBe("png");
		});

		test("resolves without a return value", async () => {
			fetchMock.mockResolvedValueOnce(noContentResponse());

			await expect(client.update(BLOB_ID)).resolves.toBeUndefined();
		});
	});

	describe("empty", () => {
		test("sends DELETE to /{prefix}", async () => {
			fetchMock.mockResolvedValueOnce(noContentResponse());

			await client.empty();

			const [url, options] = fetchMock.mock.calls[0];
			expect(url).toBe(`${ENDPOINT}/${PREFIX}`);
			expect(options.method).toBe(HttpMethod.DELETE);
		});

		test("resolves without a return value", async () => {
			fetchMock.mockResolvedValueOnce(noContentResponse());

			await expect(client.empty()).resolves.toBeUndefined();
		});
	});

	describe("remove", () => {
		test("throws when id is not a URN", async () => {
			await expect(client.remove("not-a-urn")).rejects.toMatchObject({
				name: GuardError.CLASS_NAME,
				message: "guard.urn"
			});
		});

		test("sends DELETE to /{prefix}/:id", async () => {
			fetchMock.mockResolvedValueOnce(noContentResponse());

			await client.remove(BLOB_ID);

			const [url, options] = fetchMock.mock.calls[0];
			expect(url).toBe(`${ENDPOINT}/${PREFIX}/${BLOB_ID}`);
			expect(options.method).toBe(HttpMethod.DELETE);
		});

		test("resolves without a return value", async () => {
			fetchMock.mockResolvedValueOnce(noContentResponse());

			await expect(client.remove(BLOB_ID)).resolves.toBeUndefined();
		});
	});

	describe("query", () => {
		test("sends GET to /{prefix}", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse(TEST_BLOB_ENTRY_LIST));

			await client.query();

			const [url, options] = fetchMock.mock.calls[0];
			expect(url).toBe(`${ENDPOINT}/${PREFIX}`);
			expect(options.method).toBe(HttpMethod.GET);
		});

		test("returns entries from the response body", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse(TEST_BLOB_ENTRY_LIST));

			const result = await client.query();

			expect(result.entries).toEqual(TEST_BLOB_ENTRY_LIST);
		});

		test("returns undefined cursor when no Link header is present", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse(TEST_BLOB_ENTRY_LIST));

			const result = await client.query();

			expect(result.cursor).toBeUndefined();
		});

		test("extracts cursor from the Link next relation header", async () => {
			fetchMock.mockResolvedValueOnce({
				ok: true,
				status: 200,
				headers: new Headers({
					"content-type": "application/json",
					link: `<${ENDPOINT}/${PREFIX}?cursor=page2>; rel="next"`
				}),
				json: async () => TEST_BLOB_ENTRY_LIST
			});

			const result = await client.query();

			expect(result.cursor).toBe("page2");
		});

		test("includes cursor as a query parameter when provided", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse(TEST_BLOB_ENTRY_LIST));

			await client.query(undefined, undefined, undefined, "page1");

			const [url] = fetchMock.mock.calls[0];
			expect(url).toContain("cursor=page1");
		});

		test("includes limit as a query parameter when provided", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse(TEST_BLOB_ENTRY_LIST));

			await client.query(undefined, undefined, undefined, undefined, 25);

			const [url] = fetchMock.mock.calls[0];
			expect(url).toContain("limit=25");
		});

		test("includes orderBy as a query parameter when provided", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse(TEST_BLOB_ENTRY_LIST));

			await client.query(undefined, "dateCreated");

			const [url] = fetchMock.mock.calls[0];
			expect(url).toContain("orderBy=dateCreated");
		});

		test("includes orderByDirection as a query parameter when provided", async () => {
			fetchMock.mockResolvedValueOnce(jsonResponse(TEST_BLOB_ENTRY_LIST));

			await client.query(undefined, undefined, "asc");

			const [url] = fetchMock.mock.calls[0];
			expect(url).toContain("orderByDirection=asc");
		});
	});

	describe("createDownloadLink", () => {
		test("throws when id is not a URN", () => {
			expect(() => client.createDownloadLink("not-a-urn")).toThrow();
		});

		test("returns a link containing the blob id and content path", () => {
			const link = client.createDownloadLink(BLOB_ID);

			expect(link).toContain(`${BLOB_ID}/content`);
		});

		test("appends download=true query parameter when download is true", () => {
			const link = client.createDownloadLink(BLOB_ID, true);

			expect(link).toContain("download=true");
		});

		test("appends filename query parameter when provided", () => {
			const link = client.createDownloadLink(BLOB_ID, false, "my file.txt");

			expect(link).toContain("filename=my%20file.txt");
		});

		test("appends both download and filename when both are provided", () => {
			const link = client.createDownloadLink(BLOB_ID, true, "archive.zip");

			expect(link).toContain("download=true");
			expect(link).toContain("filename=archive.zip");
		});
	});
});
