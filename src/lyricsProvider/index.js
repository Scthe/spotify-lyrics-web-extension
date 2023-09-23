// I could use APIs like a normal human being.
//
// ...
//
// ...
//
// Or, I can make use of the fact that browser extensions can bypass CORS.
//
// ...
//
// thonk..

import { h, Component } from 'preact';
import { useState, useReducer, useEffect } from 'preact/hooks';
/** @jsx h */
import { getSongName } from '../utils';
import genius from './genius';
import musixmatch from './musixmatch';

export const LYRICS_PROVIDERS = [genius, musixmatch];

const DEFAULT_LYRICS_STATE = {
  loading: true,
  data: undefined,
  error: undefined,
};

const reducer = (state, actionObj) => {
  const { action, providerName, song } = actionObj;
  console.log(`[Lyrics ${action}] ${providerName} '${getSongName(song)}'`);

  switch (action) {
    case 'reset':
      return {
        ...state,
        [providerName]: { ...DEFAULT_LYRICS_STATE },
      };
    case 'error':
      return {
        ...state,
        [providerName]: {
          loading: false,
          error: 'Unable to find lyrics',
          data: undefined,
        },
      };
    case 'success':
      return {
        ...state,
        [providerName]: {
          loading: false,
          error: undefined,
          data: actionObj.data,
        },
      };
    default:
      throw new Error('Unexpected action');
  }
};

export const useLyrics = (currentLyricsProvider, song = {}) => {
  const { artist, title } = song;

  const [lyricsCache, dispatch] = useReducer(reducer, {});
  // console.log(`[useLyrics] ${currentLyricsProvider.name} '${artist}-${title}'`);

  useEffect(() => {
    if (title == null) {
      return;
    }

    LYRICS_PROVIDERS.forEach(async (lyricsProvider) => {
      const actionBase = {
        providerName: lyricsProvider.name,
        song,
      };
      dispatch({ ...actionBase, action: 'reset' });

      try {
        const data = await lyricsProvider.searchFn(song);
        dispatch({ ...actionBase, action: 'success', data });
      } catch (error) {
        console.error('Lyrics fetch error', actionBase, error);
        dispatch({ ...actionBase, action: 'error' });
      }
    });
  }, [artist, title]);

  return lyricsCache[currentLyricsProvider.name] || DEFAULT_LYRICS_STATE;
};
