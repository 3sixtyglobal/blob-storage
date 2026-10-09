// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { MemoryBlobStorageConnector } from "@3sixty/blob-storage-connector-memory";
import { BlobStorageConnectorFactory, BlobStorageMetricIds } from "@3sixty/blob-storage-models";
import { ContextIdStore } from "@3sixty/context";
import { ComponentFactory, Converter, Factory, Is } from "@3sixty/core";
import { EntitySchemaFactory, EntitySchemaHelper } from "@3sixty/entity";
import { MemoryEntityStorageConnector } from "@3sixty/entity-storage-connector-memory";
import { EntityStorageConnectorFactory } from "@3sixty/entity-storage-models";
import { nameof } from "@3sixty/nameof";
import {
	MetricType,
	type ITelemetryComponent,
	type ITelemetryMetric
} from "@3sixty/telemetry-models";
import { BlobStorageService } from "../src/blobStorageService.js";
import { BlobStorageEntry } from "../src/entities/blobStorageEntry.js";

const TEST_BLOB = Converter.bytesToBase64(Converter.utf8ToBytes("hello metrics"));

interface MetricValueEntry {
	id: string;
	value: "inc" | "dec" | number;
	customData?: { [key: string]: unknown };
}

function makeMockTelemetry(): {
	component: ITelemetryComponent;
	created: ITelemetryMetric[];
	values: MetricValueEntry[];
} {
	const created: ITelemetryMetric[] = [];
	const values: MetricValueEntry[] = [];
	const component: ITelemetryComponent = {
		className: () => "MockTelemetry",
		start: async () => {},
		stop: async () => {},
		createMetric: async m => {
			for (const metric of Is.array(m) ? m : [m]) {
				created.push({ ...metric });
			}
		},
		getMetric: async () => ({ metric: {} as never, value: {} as never }),
		updateMetric: async () => {},
		addMetricValue: async (id, value, customData) => {
			values.push({ id, value, customData });
			return "v";
		},
		addMetricValues: async entries => {
			values.push(...entries);
			return entries.map(() => "v");
		},
		getMetricValue: async (id, valueId) => ({
			id: valueId,
			metricId: id,
			value: 0,
			ts: Date.now()
		}),
		removeMetric: async () => {},
		query: async () => ({ entities: [] }),
		queryValues: async () => ({ metric: {} as never, entities: [] })
	};
	return { component, created, values };
}

describe("BlobStorageService - metrics", () => {
	let entityStorage: MemoryEntityStorageConnector<BlobStorageEntry>;

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
		BlobStorageConnectorFactory.register("memory", () => new MemoryBlobStorageConnector());

		ContextIdStore.getContextIds = vi.fn().mockResolvedValue({
			node: "test-node",
			organization: "test-org",
			user: "test-user"
		});
	});

	afterEach(async () => {
		await entityStorage.teardown();
		Factory.clearFactories();
	});

	describe("instrumented path", () => {
		test("start() registers all blob storage metrics with the telemetry component", async () => {
			const { component, created } = makeMockTelemetry();
			ComponentFactory.register("test-telemetry", () => component);

			const service = new BlobStorageService({ telemetryComponentType: "test-telemetry" });
			await service.start();

			const ids = created.map(m => m.id);
			expect(ids).toContain(BlobStorageMetricIds.BlobCreated);
			expect(ids).toContain(BlobStorageMetricIds.BlobRetrieved);
			expect(ids).toContain(BlobStorageMetricIds.BlobUpdated);
			expect(ids).toContain(BlobStorageMetricIds.BlobRemoved);
			expect(ids).toContain(BlobStorageMetricIds.BlobQueried);
			expect(created.every(m => m.type === MetricType.Counter)).toBe(true);
		});

		test("create() increments blob_storage_blob_created with namespace", async () => {
			const { component, values } = makeMockTelemetry();
			ComponentFactory.register("test-telemetry", () => component);

			const service = new BlobStorageService({ telemetryComponentType: "test-telemetry" });
			await service.start();

			await service.create(TEST_BLOB);

			const created = values.filter(v => v.id === BlobStorageMetricIds.BlobCreated);
			expect(created).toHaveLength(1);
			expect(created[0].value).toBe("inc");
			expect(created[0].customData?.namespace).toBe("memory");
		});

		test("remove() increments blob_storage_blob_removed", async () => {
			const { component, values } = makeMockTelemetry();
			ComponentFactory.register("test-telemetry", () => component);

			const service = new BlobStorageService({ telemetryComponentType: "test-telemetry" });
			await service.start();

			const blobId = await service.create(TEST_BLOB);
			await service.remove(blobId);

			const removed = values.filter(v => v.id === BlobStorageMetricIds.BlobRemoved);
			expect(removed).toHaveLength(1);
			expect(removed[0].value).toBe("inc");
		});
	});

	describe("uninstrumented path", () => {
		test("create() succeeds without a telemetry component", async () => {
			const service = new BlobStorageService();

			const blobId = await service.create(TEST_BLOB);

			expect(blobId).toBeDefined();
		});

		test("remove() succeeds without a telemetry component", async () => {
			const service = new BlobStorageService();

			const blobId = await service.create(TEST_BLOB);
			await expect(service.remove(blobId)).resolves.toBeUndefined();
		});
	});
});
