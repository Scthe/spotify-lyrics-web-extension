import { h, Component } from 'preact';
import { useState, useEffect } from 'preact/hooks';
const browser = require('webextension-polyfill');
/** @jsx h */
import { SPOTIFY_API, requestWithSpotifyAuthRetry } from './utils';

const adaptSpotifySong = (resp) => {
  const { name, artists, album } = resp.item;
  return {
    title: name,
    artist: artists[0].name,
    albumArt: album.images[album.images.length - 1].url,
  };
};

export const useSpotifySong = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(undefined);
  const [error, setError] = useState(undefined);

  useEffect(async () => {
    try {
      const resp = await requestWithSpotifyAuthRetry(
        SPOTIFY_API.currentlyPlaying
      );
      const song = adaptSpotifySong(resp);
      console.log('[SPOTIFY API OK]', { resp, song });
      setData(song);
      setLoading(false);
    } catch (e) {
      console.log('[SPOTIFY API ERR]', e);
      setError(e);
      setLoading(false);
    }
  }, []);

  return { loading, data, error };
};
