import { useState } from 'preact/hooks';
import { SPOTIFY_API, requestWithSpotifyAuthRetry } from './utils';
import { Song, SongDetectState } from '../types';
import { isError, useEffectOnce } from '../utils';

const adaptSpotifySong = (resp: unknown): Song => {
  const { name, artists, album } = resp.item;
  return {
    title: name,
    artist: artists[0].name,
    albumArt: album.images[album.images.length - 1].url,
  };
};

export const useSpotifySong = (): SongDetectState => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Song | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffectOnce(async () => {
    try {
      const resp = await requestWithSpotifyAuthRetry(
        SPOTIFY_API.currentlyPlaying,
        {}
      );
      const song = adaptSpotifySong(resp);
      console.log('[Spotify song OK]', { resp, song });
      setData(song);
      setLoading(false);
    } catch (e) {
      console.log('[Spotify song ERROR]', e);
      setError(isError(e) ? e.message : String(e));
      setLoading(false);
    }
  });

  return { loading, data, error };
};
