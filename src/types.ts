export type WithClassName = { className?: string };

export interface Song {
  title: string;
  artist?: string;
  albumArt?: string;
}

export interface SongDetectState {
  loading: boolean;
  data: Song | undefined;
  error: string | undefined;
}

export type LyricsLine = string;

export type LyricsSearchResult = {
  lines: LyricsLine[];
  url: string;
};

export interface LyricsProvider {
  name: string;
  logo: string;
  searchFn: (song: Song) => Promise<LyricsSearchResult>;
  createSearchUrl: (song: Song) => string;
}

export type RefreshToken = string;
export type SpotifyAuthToken = {
  access_token: string;
  refresh_token: RefreshToken;
};
export type SpotifyApiFunction = (
  authToken: SpotifyAuthToken,
  fetchOpts: RequestInit
) => Promise<unknown>;
