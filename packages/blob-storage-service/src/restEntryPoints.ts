// Copyright 2024 IOTA Stiftung.
// SPDX-License-Identifier: Apache-2.0.
import type { IRestRouteEntryPoint } from "@3sixty/api-models";
import { generateRestRoutesBlobStorage, tagsBlobStorage } from "./blobStorageRoutes.js";

/**
 * Default REST route entry points for the blob storage service.
 * Applications should create their own entry points based on the blob types
 * they want to store, using a custom defaultBaseRoute.
 */
export const restEntryPoints: IRestRouteEntryPoint[] = [
	{
		name: "blob-storage",
		defaultBaseRoute: "blob-storage",
		tags: tagsBlobStorage,
		generateRoutes: generateRestRoutesBlobStorage
	}
];
