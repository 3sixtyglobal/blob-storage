// Copyright 2026 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import { MetricType, type ITelemetryMetric } from "@twin.org/telemetry-models";
import { BlobStorageMetricIds } from "./blobStorageMetricIds.js";

/**
 * Metrics registered by the blob storage service.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const BlobStorageMetrics: ITelemetryMetric[] = [
	{ id: BlobStorageMetricIds.BlobCreated, label: "Blobs created", type: MetricType.Counter },
	{ id: BlobStorageMetricIds.BlobRetrieved, label: "Blobs retrieved", type: MetricType.Counter },
	{ id: BlobStorageMetricIds.BlobUpdated, label: "Blobs updated", type: MetricType.Counter },
	{ id: BlobStorageMetricIds.BlobRemoved, label: "Blobs removed", type: MetricType.Counter },
	{ id: BlobStorageMetricIds.BlobQueried, label: "Blob queries executed", type: MetricType.Counter }
];
