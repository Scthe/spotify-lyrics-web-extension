import { ICON_MUSIXMATCH } from '../components';
import { LyricsProvider, Song } from '../types';
import { getSongName } from '../utils';
import {
  searchGoogle,
  getUrlFromSearchResults,
  fetchTextOrThrow,
  regexMatchOrThrow,
  cleanupLine,
  encodeSongAsSearchParam,
} from './_utils';

// TODO  not working?

const createSearchUrl = (song: Song) => {
  const query = encodeSongAsSearchParam(song);
  return `https://www.musixmatch.com/search/${query}`;
};

// NOTE: we use \S\s as substitute for /s (dotall flag)
// https://stackoverflow.com/questions/1068280/javascript-regex-multiline-flag-doesnt-work
const WRAPPER_REGEX = /<p class="mxm-lyrics__content ">([.\S\s]*?)<\/p>/gm;

const search = async ({ artist = '', title }: Song) => {
  const songDbgName = getSongName({ artist, title });

  const googleHtml = await searchGoogle(
    [artist, title, 'musixmatch', 'lyrics'],
    `Google not working, send help ('${songDbgName}' btw.)`
  );
  console.log(googleHtml);

  const pageUrl = getUrlFromSearchResults(
    googleHtml,
    'www.musixmatch.com',
    `No musixmatch page found for '${songDbgName}'`
  );

  const html = await fetchTextOrThrow(
    pageUrl,
    `Could not fetch musixmatch page for '${songDbgName}'`
  );

  const rawText = regexMatchOrThrow(
    WRAPPER_REGEX,
    html,
    `Could not parse musixmatch page for lyrics for '${songDbgName}' (${pageUrl})`
  ).join('\n');

  const rawLines = rawText.split('\n');
  return {
    lines: rawLines.map(cleanupLine),
    url: pageUrl,
  };
};

export default {
  name: 'musixmatch',
  logo: ICON_MUSIXMATCH,
  searchFn: search,
  createSearchUrl,
} satisfies LyricsProvider;
