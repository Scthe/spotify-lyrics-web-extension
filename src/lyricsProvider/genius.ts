import { parse } from 'node-html-parser';
import { ICON_GENIUS } from '../components/svg-icon';
import { LyricsLine, LyricsProvider, Song } from '../types';
import { getSongName } from '../utils';
import {
  searchGoogle,
  getUrlFromSearchResults,
  fetchTextOrThrow,
  encodeSongAsSearchParam,
  parseLinesFromHtml,
} from './_utils';

const createSearchUrl = (song: Song) => {
  const query = encodeSongAsSearchParam(song);
  return `https://genius.com/search?q=${query}`;
};

export const parseGeniusPage = (htmlText: string): LyricsLine[] => {
  const root = parse(htmlText);
  // remove song meta E.g. "5 Contributors"
  root
    .querySelectorAll('[data-exclude-from-selection]')
    .forEach((node) => node.remove());

  // find HTML nodes
  const lyricContainers = root.querySelectorAll('[data-lyrics-container]');
  return parseLinesFromHtml(lyricContainers, (el) =>
    el.textContent.split('\n')
  );
};

const search = async ({ artist = '', title }: Song) => {
  const songDbgName = getSongName({ artist, title });

  const googleHtml = await searchGoogle(
    [artist, title, 'genius', 'lyrics'],
    `Google not working, send help ('${songDbgName}' btw.)`
  );

  const pageUrl = getUrlFromSearchResults(
    googleHtml,
    'genius.com',
    `No genius page found for '${songDbgName}'`
  );

  console.log(`Genius lyrics page:`, pageUrl);
  const geniusHtml = await fetchTextOrThrow(
    pageUrl,
    `Could not fetch genius page for '${songDbgName}'`
  );

  return {
    url: pageUrl,
    lines: parseGeniusPage(geniusHtml),
  };
};

export default {
  name: 'genius',
  logo: ICON_GENIUS,
  searchFn: search,
  createSearchUrl,
} satisfies LyricsProvider;
