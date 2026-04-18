import type { PodvivaClient } from "./client"
import { mockClient } from "./mock-client"

// Phase 1: always the mock client. Phase 2 will branch on an env flag and return
// an HttpClient that calls /api/v1/*.
export const client: PodvivaClient = mockClient

export type { PodvivaClient } from "./client"
export * from "./types"
