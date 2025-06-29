import { useReducer, useEffect } from 'preact/hooks';
import { getSongName } from '../utils';
import genius from './genius';
import musixmatch from './musixmatch';
import { LyricsProvider, LyricsSearchResult, Song } from '../types';

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

export const LYRICS_PROVIDERS: LyricsProvider[] = [genius, musixmatch];

export type LyricsProviderState = {
  loading: boolean;
  error: string | undefined;
  data: LyricsSearchResult | undefined;
};
type State = Record<LyricsProvider['name'], LyricsProviderState>;

const DEFAULT_LYRICS_STATE: LyricsProviderState = {
  loading: true,
  data: undefined,
  error: undefined,
};

type ActionBase<T> = T & { providerName: string; song: Song };
type Action =
  | ActionBase<{ action: 'reset' }>
  | ActionBase<{ action: 'success'; data: LyricsSearchResult }>
  | ActionBase<{ action: 'error' }>;

const reducer = (state: State, actionObj: Action) => {
  const { action, providerName, song } = actionObj;
  console.log(`[${providerName} ${action}] '${getSongName(song)}'`);

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

export const useLyrics = (
  currentLyricsProvider: LyricsProvider,
  song: Song | undefined
) => {
  const { artist, title } = song ?? {};

  const [lyricsCache, dispatch] = useReducer(reducer, {});
  // console.log(`[useLyrics] ${currentLyricsProvider.name} '${artist}-${title}'`);

  useEffect(() => {
    if (!song || title == null) {
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
