import type {
  CreateEpisodeInput,
  CreateShowInput,
  DashboardSnapshot,
  Episode,
  Show,
} from "./types"

export interface PodvivaClient {
  listShows(): Promise<Show[]>
  getShow(id: string): Promise<Show | null>
  createShow(input: CreateShowInput): Promise<Show>

  listEpisodes(showId?: string): Promise<Episode[]>
  getEpisode(id: string): Promise<Episode | null>
  createEpisode(input: CreateEpisodeInput): Promise<Episode>

  getDashboardSnapshot(): Promise<DashboardSnapshot>
}
