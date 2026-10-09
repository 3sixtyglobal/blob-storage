// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { MemoryBlobStorageConnector } from "@3sixty/blob-storage-connector-memory";
import {
	BlobStorageCompressionType,
	BlobStorageConnectorFactory
} from "@3sixty/blob-storage-models";
import { ContextIdStore } from "@3sixty/context";
import { Converter } from "@3sixty/core";
import { EntitySchemaFactory, EntitySchemaHelper } from "@3sixty/entity";
import { MemoryEntityStorageConnector } from "@3sixty/entity-storage-connector-memory";
import { EntityStorageConnectorFactory } from "@3sixty/entity-storage-models";
import { nameof } from "@3sixty/nameof";
import {
	EntityStorageVaultConnector,
	type VaultKey,
	type VaultSecret,
	initSchema as initSchemaVault
} from "@3sixty/vault-connector-entity-storage";
import { VaultConnectorFactory, VaultKeyType } from "@3sixty/vault-models";
import { BlobStorageService } from "../src/blobStorageService.js";
import { BlobStorageEntry } from "../src/entities/blobStorageEntry.js";

const TEST_USER_IDENTITY = "test-user-identity";
const TEST_NODE_IDENTITY = "test-node-identity";
const TEST_ORGANIZATION_IDENTITY = "test-organization-identity";
let entityStorage: MemoryEntityStorageConnector<BlobStorageEntry>;
let blobStorage: MemoryBlobStorageConnector;

describe("blob-storage-service", () => {
	beforeEach(async () => {
		EntitySchemaFactory.register(nameof<BlobStorageEntry>(), () =>
			EntitySchemaHelper.getSchema(BlobStorageEntry)
		);

		entityStorage = new MemoryEntityStorageConnector<BlobStorageEntry>({
			entitySchema: nameof<BlobStorageEntry>(),
			config: { storageKey: "blob-storage-entry" }
		});
		await entityStorage.teardown();

		EntityStorageConnectorFactory.register("blob-storage-entry", () => entityStorage);

		blobStorage = new MemoryBlobStorageConnector();
		BlobStorageConnectorFactory.register("memory", () => blobStorage);

		Date.now = vi
			.fn()
			.mockImplementationOnce(() => 1724327716271)
			.mockImplementation(() => 1724327816272);

		initSchemaVault();

		ContextIdStore.getContextIds = vi.fn().mockImplementation(() => ({
			node: TEST_NODE_IDENTITY,
			organization: TEST_ORGANIZATION_IDENTITY,
			user: TEST_USER_IDENTITY
		}));
	});

	afterEach(async () => {
		await entityStorage.teardown();
	});

	test("can create the service", async () => {
		const service = new BlobStorageService();
		expect(service).toBeDefined();
	});

	test("can add a file with no metadata", async () => {
		const service = new BlobStorageService();
		const dataBytes = Converter.utf8ToBytes("The quick brown fox jumps over the lazy dog");
		const data = Converter.bytesToBase64(dataBytes);
		await service.create(data);
		expect(await entityStorage.getStore()).toEqual([
			{
				id: "blob:memory:d7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592",
				blobSize: 43,
				integrity: "sha256-16j7swfXgJRpypq8sAguT41WUeRtPNt2LQLQvzfJ5ZI=",
				dateCreated: "2024-08-22T11:55:16.271Z",
				fileExtension: "txt",
				encodingFormat: "text/plain",
				isEncrypted: false
			}
		]);
		expect(await blobStorage.getStore()).toEqual({
			"root/d7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592": dataBytes
		});
	});

	test("can add a file with no metadata with userId and nodeId", async () => {
		const service = new BlobStorageService();
		const dataBytes = Converter.utf8ToBytes("The quick brown fox jumps over the lazy dog");
		const data = Converter.bytesToBase64(dataBytes);
		await service.create(data, undefined, undefined, undefined, undefined);
		expect(await entityStorage.getStore()).toEqual([
			{
				id: "blob:memory:d7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592",
				blobSize: 43,
				integrity: "sha256-16j7swfXgJRpypq8sAguT41WUeRtPNt2LQLQvzfJ5ZI=",
				dateCreated: "2024-08-22T11:55:16.271Z",
				fileExtension: "txt",
				encodingFormat: "text/plain",
				isEncrypted: false
			}
		]);
		expect(await blobStorage.getStore()).toEqual({
			"root/d7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592": dataBytes
		});
	});

	test("can add a file with metadata with userId", async () => {
		const service = new BlobStorageService();
		const dataBytes = Converter.utf8ToBytes("The quick brown fox jumps over the lazy dog");
		const data = Converter.bytesToBase64(dataBytes);
		await service.create(data, undefined, undefined, {
			"@context": "https://schema.org",
			"@type": "CreativeWork",
			name: "Test"
		});
		expect(await entityStorage.getStore()).toEqual([
			{
				id: "blob:memory:d7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592",
				blobSize: 43,
				integrity: "sha256-16j7swfXgJRpypq8sAguT41WUeRtPNt2LQLQvzfJ5ZI=",
				dateCreated: "2024-08-22T11:56:56.272Z",
				fileExtension: "txt",
				encodingFormat: "text/plain",
				isEncrypted: false,
				metadata: {
					"@context": "https://schema.org",
					"@type": "CreativeWork",
					name: "Test"
				}
			}
		]);
		expect(await blobStorage.getStore()).toEqual({
			"root/d7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592": dataBytes
		});
	});

	test("can get a file with no metadata", async () => {
		const service = new BlobStorageService();
		const dataBytes = Converter.utf8ToBytes("The quick brown fox jumps over the lazy dog");
		const data = Converter.bytesToBase64(dataBytes);
		const id = await service.create(data);

		const result = await service.get(id, { includeContent: true });
		expect(result).toEqual({
			"@context": [
				"https://schema.3sixty.global/blob-storage/",
				"https://schema.3sixty.global/common/",
				"https://schema.org"
			],
			type: "BlobStorageEntry",
			id: "blob:memory:d7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592",
			blobSize: 43,
			integrity: "sha256-16j7swfXgJRpypq8sAguT41WUeRtPNt2LQLQvzfJ5ZI=",
			dateCreated: "2024-08-22T11:55:16.271Z",
			fileExtension: "txt",
			encodingFormat: "text/plain",
			blob: "VGhlIHF1aWNrIGJyb3duIGZveCBqdW1wcyBvdmVyIHRoZSBsYXp5IGRvZw==",
			isEncrypted: false
		});
	});

	test("can get a file with no metadata with userId and nodeId", async () => {
		const service = new BlobStorageService();
		const dataBytes = Converter.utf8ToBytes("The quick brown fox jumps over the lazy dog");
		const data = Converter.bytesToBase64(dataBytes);
		const id = await service.create(data);

		const result = await service.get(id, { includeContent: true });
		expect(result).toEqual({
			"@context": [
				"https://schema.3sixty.global/blob-storage/",
				"https://schema.3sixty.global/common/",
				"https://schema.org"
			],
			type: "BlobStorageEntry",
			id: "blob:memory:d7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592",
			fileExtension: "txt",
			dateCreated: "2024-08-22T11:55:16.271Z",
			encodingFormat: "text/plain",
			blobSize: 43,
			integrity: "sha256-16j7swfXgJRpypq8sAguT41WUeRtPNt2LQLQvzfJ5ZI=",
			blob: "VGhlIHF1aWNrIGJyb3duIGZveCBqdW1wcyBvdmVyIHRoZSBsYXp5IGRvZw==",
			isEncrypted: false
		});
	});

	test("can get a file with metadata with userId and nodeId", async () => {
		const service = new BlobStorageService();
		const dataBytes = Converter.utf8ToBytes("The quick brown fox jumps over the lazy dog");
		const data = Converter.bytesToBase64(dataBytes);
		const id = await service.create(data, undefined, undefined, {
			"@context": "https://schema.org",
			"@type": "CreativeWork",
			name: "Test"
		});

		const result = await service.get(id, { includeContent: true });
		expect(result).toEqual({
			"@context": [
				"https://schema.3sixty.global/blob-storage/",
				"https://schema.3sixty.global/common/",
				"https://schema.org"
			],
			type: "BlobStorageEntry",
			id: "blob:memory:d7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592",
			fileExtension: "txt",
			dateCreated: "2024-08-22T11:56:56.272Z",
			encodingFormat: "text/plain",
			blobSize: 43,
			integrity: "sha256-16j7swfXgJRpypq8sAguT41WUeRtPNt2LQLQvzfJ5ZI=",
			blob: "VGhlIHF1aWNrIGJyb3duIGZveCBqdW1wcyBvdmVyIHRoZSBsYXp5IGRvZw==",
			isEncrypted: false,
			metadata: {
				type: "CreativeWork",
				name: "Test"
			}
		});
	});

	test("can get a file metadata only with userId and nodeId", async () => {
		const service = new BlobStorageService();
		const dataBytes = Converter.utf8ToBytes("The quick brown fox jumps over the lazy dog");
		const data = Converter.bytesToBase64(dataBytes);
		const id = await service.create(data, undefined, undefined, {
			"@context": "https://www.w3.org/ns/activitystreams",
			type: "Create",
			actor: {
				type: "Person",
				id: "acct:person@example.org",
				name: "Person"
			},
			object: {
				type: "Note",
				content: "This is a simple note"
			},
			published: "2015-01-25T12:34:56Z"
		});

		const result = await service.get(id);
		expect(result).toEqual({
			"@context": [
				"https://schema.3sixty.global/blob-storage/",
				"https://schema.3sixty.global/common/",
				"https://schema.org",
				"https://www.w3.org/ns/activitystreams"
			],
			type: "BlobStorageEntry",
			id: "blob:memory:d7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592",
			fileExtension: "txt",
			dateCreated: "2024-08-22T11:56:56.272Z",
			encodingFormat: "text/plain",
			blobSize: 43,
			integrity: "sha256-16j7swfXgJRpypq8sAguT41WUeRtPNt2LQLQvzfJ5ZI=",
			isEncrypted: false,
			metadata: {
				type: "Create",
				actor: {
					type: "Person",
					id: "acct:person@example.org",
					name: "Person"
				},
				object: {
					type: "Note",
					content: "This is a simple note"
				},
				published: "2015-01-25T12:34:56Z"
			}
		});
	});

	test("can update a file with metadata", async () => {
		const service = new BlobStorageService();
		const dataBytes = Converter.utf8ToBytes("The quick brown fox jumps over the lazy dog");
		const data = Converter.bytesToBase64(dataBytes);
		const id = await service.create(data);

		await service.update(id, undefined, undefined, {
			"@context": "https://schema.org",
			"@type": "CreativeWork",
			name: "Test2"
		});
		expect(await entityStorage.getStore()).toEqual([
			{
				id: "blob:memory:d7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592",
				fileExtension: "txt",
				dateCreated: "2024-08-22T11:55:16.271Z",
				dateModified: "2024-08-22T11:56:56.272Z",
				encodingFormat: "text/plain",
				blobSize: 43,
				integrity: "sha256-16j7swfXgJRpypq8sAguT41WUeRtPNt2LQLQvzfJ5ZI=",
				isEncrypted: false,
				metadata: {
					"@context": "https://schema.org",
					"@type": "CreativeWork",
					name: "Test2"
				}
			}
		]);
	});

	test("can update a file with metadata with userId and nodeId", async () => {
		const service = new BlobStorageService();
		const dataBytes = Converter.utf8ToBytes("The quick brown fox jumps over the lazy dog");
		const data = Converter.bytesToBase64(dataBytes);
		const id = await service.create(data);

		await service.update(id, undefined, undefined, {
			"@context": "https://schema.org",
			"@type": "CreativeWork",
			name: "Test2"
		});
		expect(await entityStorage.getStore()).toEqual([
			{
				id: "blob:memory:d7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592",
				fileExtension: "txt",
				dateCreated: "2024-08-22T11:55:16.271Z",
				dateModified: "2024-08-22T11:56:56.272Z",
				encodingFormat: "text/plain",
				blobSize: 43,
				integrity: "sha256-16j7swfXgJRpypq8sAguT41WUeRtPNt2LQLQvzfJ5ZI=",
				isEncrypted: false,
				metadata: {
					"@context": "https://schema.org",
					"@type": "CreativeWork",
					name: "Test2"
				}
			}
		]);
	});

	test("can remove a file with metadata", async () => {
		const service = new BlobStorageService();
		const dataBytes = Converter.utf8ToBytes("The quick brown fox jumps over the lazy dog");
		const data = Converter.bytesToBase64(dataBytes);
		const id = await service.create(data, undefined, undefined, {
			"@context": "https://schema.org",
			"@type": "CreativeWork",
			name: "Test2"
		});

		await service.remove(id);
		expect(await entityStorage.getStore()).toEqual([]);
		expect(await blobStorage.getStore()).toEqual({});
	});

	test("can remove a file with metadata with userId and nodeId", async () => {
		const service = new BlobStorageService();
		const dataBytes = Converter.utf8ToBytes("The quick brown fox jumps over the lazy dog");
		const data = Converter.bytesToBase64(dataBytes);
		const id = await service.create(data, undefined, undefined, {
			"@context": "https://schema.org",
			"@type": "CreativeWork",
			name: "Test2"
		});

		await service.remove(id);
		expect(await entityStorage.getStore()).toEqual([]);
		expect(await blobStorage.getStore()).toEqual({});
	});

	test("can query the entries", async () => {
		const service = new BlobStorageService();

		for (let i = 0; i < 3; i++) {
			const dataBytes = Converter.utf8ToBytes(`The quick brown fox jumps over the lazy dog${i}`);
			const data = Converter.bytesToBase64(dataBytes);
			await service.create(data, undefined, undefined, {
				"@context": "https://www.w3.org/ns/activitystreams",
				type: "Create",
				actor: {
					type: `Person${i}`,
					id: "acct:person@example.org",
					name: "Person"
				},
				object: {
					type: "Note",
					content: "This is a simple note"
				},
				published: "2015-01-25T12:34:56Z"
			});
		}

		expect((await entityStorage.getStore()).length).toEqual(3);
		expect(Object.keys(await blobStorage.getStore()).length).toEqual(3);

		const entriesAndCursor = await service.query();

		expect(entriesAndCursor.entries).toEqual({
			"@context": [
				"https://schema.org",
				"https://schema.3sixty.global/blob-storage/",
				"https://schema.3sixty.global/common/",
				"https://www.w3.org/ns/activitystreams"
			],
			type: "ItemList",
			itemListElement: [
				{
					id: "blob:memory:29047d3b56d7e6f3cdaed85ffd549d86badf7241d245aa66102f556b0e0e0946",
					type: "BlobStorageEntry",
					dateCreated: "2024-08-22T11:56:56.272Z",
					encodingFormat: "text/plain",
					blobSize: 44,
					integrity: "sha256-KQR9O1bX5vPNrthf/VSdhrrfckHSRapmEC9Vaw4OCUY=",
					fileExtension: "txt",
					isEncrypted: false,
					metadata: {
						type: "Create",
						actor: {
							type: "Person0",
							id: "acct:person@example.org",
							name: "Person"
						},
						object: {
							type: "Note",
							content: "This is a simple note"
						},
						published: "2015-01-25T12:34:56Z"
					}
				},
				{
					id: "blob:memory:35bbc692cc25c4ed8417eb2a78eba260ea6b166830a8c1e236a1131dd041c632",
					type: "BlobStorageEntry",
					dateCreated: "2024-08-22T11:56:56.272Z",
					encodingFormat: "text/plain",
					blobSize: 44,
					integrity: "sha256-NbvGkswlxO2EF+sqeOuiYOprFmgwqMHiNqETHdBBxjI=",
					fileExtension: "txt",
					isEncrypted: false,
					metadata: {
						type: "Create",
						actor: {
							type: "Person1",
							id: "acct:person@example.org",
							name: "Person"
						},
						object: {
							type: "Note",
							content: "This is a simple note"
						},
						published: "2015-01-25T12:34:56Z"
					}
				},
				{
					id: "blob:memory:199998607d2fe64c9e6cac5522ba5f62ea87e0608221411cfc2b4994de4fef63",
					type: "BlobStorageEntry",
					dateCreated: "2024-08-22T11:56:56.272Z",
					encodingFormat: "text/plain",
					blobSize: 44,
					integrity: "sha256-GZmYYH0v5kyebKxVIrpfYuqH4GCCIUEc/CtJlN5P72M=",
					fileExtension: "txt",
					isEncrypted: false,
					metadata: {
						type: "Create",
						actor: {
							type: "Person2",
							id: "acct:person@example.org",
							name: "Person"
						},
						object: {
							type: "Note",
							content: "This is a simple note"
						},
						published: "2015-01-25T12:34:56Z"
					}
				}
			]
		});
	});

	test("can fail to add a file with encryption when vault is not configured", async () => {
		const service = new BlobStorageService({
			config: { vaultKeyId: "my-key" }
		});
		const dataBytes = Converter.utf8ToBytes("The quick brown fox jumps over the lazy dog");
		const data = Converter.bytesToBase64(dataBytes);
		await expect(service.create(data)).rejects.toMatchObject({
			name: "GeneralError",
			message: "blobStorageService.createFailed",
			cause: {
				name: "GeneralError",
				message: "blobStorageService.vaultConnectorNotConfigured"
			}
		});
	});

	test("can add a file with encryption", async () => {
		const vaultKeyEntityStorageConnector = new MemoryEntityStorageConnector<VaultKey>({
			entitySchema: nameof<VaultKey>(),
			config: { storageKey: "vault-key" }
		});

		const vaultSecretEntityStorageConnector = new MemoryEntityStorageConnector<VaultSecret>({
			entitySchema: nameof<VaultSecret>(),
			config: { storageKey: "vault-secret" }
		});

		EntityStorageConnectorFactory.register("vault-key", () => vaultKeyEntityStorageConnector);
		EntityStorageConnectorFactory.register("vault-secret", () => vaultSecretEntityStorageConnector);

		VaultConnectorFactory.register("vault", () => new EntityStorageVaultConnector());

		await vaultKeyEntityStorageConnector.set({
			id: `${TEST_ORGANIZATION_IDENTITY}/my-key`,
			type: VaultKeyType.ChaCha20Poly1305,
			privateKey: "vOpvrUcuiDJF09hoe9AWa4OUqcNqr6RpGOuj/A57gag="
		});

		const service = new BlobStorageService({
			config: { vaultKeyId: "my-key" },
			vaultConnectorType: "vault"
		});
		const dataBytes = Converter.utf8ToBytes("The quick brown fox jumps over the lazy dog");
		const data = Converter.bytesToBase64(dataBytes);
		const result = await service.create(data);
		expect(await entityStorage.getStore()).toEqual([
			{
				id: result,
				blobSize: 43,
				integrity: "sha256-16j7swfXgJRpypq8sAguT41WUeRtPNt2LQLQvzfJ5ZI=",
				dateCreated: "2024-08-22T11:56:56.272Z",
				fileExtension: "txt",
				encodingFormat: "text/plain",
				isEncrypted: true
			}
		]);

		const decryptedData = await service.get(result, { includeContent: true });
		expect(Converter.base64ToBytes(decryptedData.blob ?? "")).toEqual(
			Converter.utf8ToBytes("The quick brown fox jumps over the lazy dog")
		);
	});

	test("can add a file with encryption with disable option", async () => {
		const vaultKeyEntityStorageConnector = new MemoryEntityStorageConnector<VaultKey>({
			entitySchema: nameof<VaultKey>(),
			config: { storageKey: "vault-key" }
		});

		const vaultSecretEntityStorageConnector = new MemoryEntityStorageConnector<VaultSecret>({
			entitySchema: nameof<VaultSecret>(),
			config: { storageKey: "vault-secret" }
		});

		EntityStorageConnectorFactory.register("vault-key", () => vaultKeyEntityStorageConnector);
		EntityStorageConnectorFactory.register("vault-secret", () => vaultSecretEntityStorageConnector);

		VaultConnectorFactory.register("vault", () => new EntityStorageVaultConnector());

		await vaultKeyEntityStorageConnector.set({
			id: `${TEST_ORGANIZATION_IDENTITY}/my-key`,
			type: VaultKeyType.ChaCha20Poly1305,
			privateKey: "vOpvrUcuiDJF09hoe9AWa4OUqcNqr6RpGOuj/A57gag="
		});

		const service = new BlobStorageService({
			config: { vaultKeyId: "my-key" },
			vaultConnectorType: "vault"
		});
		const dataBytes = Converter.utf8ToBytes("The quick brown fox jumps over the lazy dog");
		const data = Converter.bytesToBase64(dataBytes);
		const result = await service.create(data, undefined, undefined, undefined, {
			disableEncryption: true
		});
		expect(await entityStorage.getStore()).toEqual([
			{
				id: result,
				blobSize: 43,
				integrity: "sha256-16j7swfXgJRpypq8sAguT41WUeRtPNt2LQLQvzfJ5ZI=",
				dateCreated: "2024-08-22T11:56:56.272Z",
				fileExtension: "txt",
				encodingFormat: "text/plain",
				isEncrypted: false
			}
		]);

		const decryptedData = await service.get(result, { includeContent: true });
		expect(Converter.base64ToBytes(decryptedData.blob ?? "")).toEqual(
			Converter.utf8ToBytes("The quick brown fox jumps over the lazy dog")
		);
	});

	test("can add a file with encryption with override key option", async () => {
		const vaultKeyEntityStorageConnector = new MemoryEntityStorageConnector<VaultKey>({
			entitySchema: nameof<VaultKey>(),
			config: { storageKey: "vault-key" }
		});

		const vaultSecretEntityStorageConnector = new MemoryEntityStorageConnector<VaultSecret>({
			entitySchema: nameof<VaultSecret>(),
			config: { storageKey: "vault-secret" }
		});

		EntityStorageConnectorFactory.register("vault-key", () => vaultKeyEntityStorageConnector);
		EntityStorageConnectorFactory.register("vault-secret", () => vaultSecretEntityStorageConnector);

		VaultConnectorFactory.register("vault", () => new EntityStorageVaultConnector());

		await vaultKeyEntityStorageConnector.set({
			id: `${TEST_ORGANIZATION_IDENTITY}/my-key`,
			type: VaultKeyType.ChaCha20Poly1305,
			privateKey: "vOpvrUcuiDJF09hoe9AWa4OUqcNqr6RpGOuj/A57gag="
		});

		const service = new BlobStorageService({
			config: { vaultKeyId: "my-key-default" },
			vaultConnectorType: "vault"
		});
		const dataBytes = Converter.utf8ToBytes("The quick brown fox jumps over the lazy dog");
		const data = Converter.bytesToBase64(dataBytes);
		const result = await service.create(data, undefined, undefined, undefined, {
			overrideVaultKeyId: "my-key"
		});
		expect(await entityStorage.getStore()).toEqual([
			{
				id: result,
				blobSize: 43,
				integrity: "sha256-16j7swfXgJRpypq8sAguT41WUeRtPNt2LQLQvzfJ5ZI=",
				dateCreated: "2024-08-22T11:56:56.272Z",
				fileExtension: "txt",
				encodingFormat: "text/plain",
				isEncrypted: true
			}
		]);

		const decryptedData = await service.get(result, {
			includeContent: true,
			overrideVaultKeyId: "my-key"
		});
		expect(Converter.base64ToBytes(decryptedData.blob ?? "")).toEqual(
			Converter.utf8ToBytes("The quick brown fox jumps over the lazy dog")
		);
	});

	test("can fail to get an encrypted blob when vault key is not available", async () => {
		const vaultKeyEntityStorageConnector = new MemoryEntityStorageConnector<VaultKey>({
			entitySchema: nameof<VaultKey>(),
			config: { storageKey: "vault-key" }
		});

		const vaultSecretEntityStorageConnector = new MemoryEntityStorageConnector<VaultSecret>({
			entitySchema: nameof<VaultSecret>(),
			config: { storageKey: "vault-secret" }
		});

		EntityStorageConnectorFactory.register("vault-key", () => vaultKeyEntityStorageConnector);
		EntityStorageConnectorFactory.register("vault-secret", () => vaultSecretEntityStorageConnector);

		VaultConnectorFactory.register("vault", () => new EntityStorageVaultConnector());

		await vaultKeyEntityStorageConnector.set({
			id: `${TEST_ORGANIZATION_IDENTITY}/my-key`,
			type: VaultKeyType.ChaCha20Poly1305,
			privateKey: "vOpvrUcuiDJF09hoe9AWa4OUqcNqr6RpGOuj/A57gag="
		});

		const serviceWithVault = new BlobStorageService({
			config: { vaultKeyId: "my-key" },
			vaultConnectorType: "vault"
		});
		const dataBytes = Converter.utf8ToBytes("The quick brown fox jumps over the lazy dog");
		const data = Converter.bytesToBase64(dataBytes);
		const result = await serviceWithVault.create(data);

		const serviceNoKey = new BlobStorageService({ vaultConnectorType: "vault" });
		await expect(serviceNoKey.get(result, { includeContent: true })).rejects.toMatchObject({
			name: "GeneralError",
			message: "blobStorageService.getFailed",
			cause: {
				name: "GeneralError",
				message: "blobStorageService.vaultKeyIdMissing"
			}
		});
	});

	test("treats empty overrideVaultKeyId as absent and falls back to service vault key", async () => {
		const vaultKeyEntityStorageConnector = new MemoryEntityStorageConnector<VaultKey>({
			entitySchema: nameof<VaultKey>(),
			config: { storageKey: "vault-key" }
		});

		const vaultSecretEntityStorageConnector = new MemoryEntityStorageConnector<VaultSecret>({
			entitySchema: nameof<VaultSecret>(),
			config: { storageKey: "vault-secret" }
		});

		EntityStorageConnectorFactory.register("vault-key", () => vaultKeyEntityStorageConnector);
		EntityStorageConnectorFactory.register("vault-secret", () => vaultSecretEntityStorageConnector);

		VaultConnectorFactory.register("vault", () => new EntityStorageVaultConnector());

		await vaultKeyEntityStorageConnector.set({
			id: `${TEST_ORGANIZATION_IDENTITY}/my-key`,
			type: VaultKeyType.ChaCha20Poly1305,
			privateKey: "vOpvrUcuiDJF09hoe9AWa4OUqcNqr6RpGOuj/A57gag="
		});

		const service = new BlobStorageService({
			config: { vaultKeyId: "my-key" },
			vaultConnectorType: "vault"
		});
		const dataBytes = Converter.utf8ToBytes("The quick brown fox jumps over the lazy dog");
		const data = Converter.bytesToBase64(dataBytes);
		const result = await service.create(data);

		const decryptedData = await service.get(result, {
			includeContent: true,
			overrideVaultKeyId: ""
		});
		expect(Converter.base64ToBytes(decryptedData.blob ?? "")).toEqual(dataBytes);
	});

	test("preserves metadata when connector remove throws", async () => {
		const service = new BlobStorageService();
		const dataBytes = Converter.utf8ToBytes("The quick brown fox jumps over the lazy dog");
		const data = Converter.bytesToBase64(dataBytes);
		const id = await service.create(data);

		vi.spyOn(blobStorage, "remove").mockRejectedValueOnce(new Error("connector failure"));

		await expect(service.remove(id)).rejects.toMatchObject({
			name: "GeneralError",
			message: "blobStorageService.removeFailed"
		});

		expect((await entityStorage.getStore()).length).toBe(1);
	});

	test("cleans up metadata when connector reports blob absent", async () => {
		const service = new BlobStorageService();
		const dataBytes = Converter.utf8ToBytes("The quick brown fox jumps over the lazy dog");
		const data = Converter.bytesToBase64(dataBytes);
		const id = await service.create(data);

		vi.spyOn(blobStorage, "remove").mockResolvedValueOnce(false);

		await service.remove(id);

		expect(await entityStorage.getStore()).toEqual([]);
	});

	test("preserves first entry metadata on duplicate content", async () => {
		const service = new BlobStorageService();
		const dataBytes = Converter.utf8ToBytes("The quick brown fox jumps over the lazy dog");
		const data = Converter.bytesToBase64(dataBytes);

		const id1 = await service.create(data, "application/pdf", "pdf");
		const id2 = await service.create(data, "image/png", "png");

		expect(id1).toBe(id2);

		const store = await entityStorage.getStore();
		expect(store.length).toBe(1);
		expect(store[0].encodingFormat).toBe("application/pdf");
		expect(store[0].fileExtension).toBe("pdf");
	});

	test("cleans up orphaned blob when entity storage write fails", async () => {
		const service = new BlobStorageService();
		const dataBytes = Converter.utf8ToBytes("The quick brown fox jumps over the lazy dog");
		const data = Converter.bytesToBase64(dataBytes);

		vi.spyOn(entityStorage, "set").mockRejectedValueOnce(new Error("storage unavailable"));

		await expect(service.create(data)).rejects.toMatchObject({
			name: "GeneralError",
			message: "blobStorageService.createFailed"
		});

		expect(Object.keys(await blobStorage.getStore()).length).toBe(0);
	});

	test("can empty with no files", async () => {
		const service = new BlobStorageService();
		await service.empty();
		expect(await entityStorage.getStore()).toEqual([]);
		expect(await blobStorage.getStore()).toEqual({});
	});

	test("can empty all files", async () => {
		const service = new BlobStorageService();
		const dataBytes1 = Converter.utf8ToBytes("The quick brown fox jumps over the lazy dog");
		const dataBytes2 = Converter.utf8ToBytes("Another blob to be stored and removed");
		await service.create(Converter.bytesToBase64(dataBytes1));
		await service.create(Converter.bytesToBase64(dataBytes2));

		expect((await entityStorage.getStore()).length).toEqual(2);
		expect(Object.keys(await blobStorage.getStore()).length).toEqual(2);

		await service.empty();

		expect(await entityStorage.getStore()).toEqual([]);
		expect(await blobStorage.getStore()).toEqual({});
	});

	test("can add a file with compression", async () => {
		const service = new BlobStorageService({
			config: {}
		});
		const dataBytes = Converter.utf8ToBytes("The quick brown fox jumps over the lazy dog");
		const data = Converter.bytesToBase64(dataBytes);
		const result = await service.create(data, undefined, undefined, undefined, {
			compress: BlobStorageCompressionType.Gzip
		});
		expect(await entityStorage.getStore()).toEqual([
			{
				id: result,
				blobSize: 43,
				integrity: "sha256-16j7swfXgJRpypq8sAguT41WUeRtPNt2LQLQvzfJ5ZI=",
				dateCreated: "2024-08-22T11:56:56.272Z",
				fileExtension: "txt",
				encodingFormat: "text/plain",
				isEncrypted: false,
				compression: BlobStorageCompressionType.Gzip
			}
		]);

		const compressedData = await service.get(result, { includeContent: true, decompress: false });
		// Should still be compressed
		expect(compressedData.blob ?? "").toEqual(
			"H4sIAAAAAAAAAwvJSFUoLM1MzlZIKsovz1NIy69QyCrNLShWyC9LLVIoyUhVyEmsqlRIyU8HADmjT0ErAAAA"
		);

		const uncompressedData = await service.get(result, { includeContent: true });
		expect(Converter.base64ToBytes(uncompressedData.blob ?? "")).toEqual(
			Converter.utf8ToBytes("The quick brown fox jumps over the lazy dog")
		);
	});
});
