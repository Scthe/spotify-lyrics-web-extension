import { ICON_GENIUS } from 'components';
import { getSongName } from '../utils';
import {
  searchGoogle,
  getUrlFromSearchResults,
  fetchTextOrThrow,
  regexMatchOrThrow,
  cleanupLine,
} from './_utils';

const createSearchUrl = ({ artist, title }) => {
  const q1 = `${artist} ${title}`.trim();
  const query = encodeURIComponent(q1);
  return `https://genius.com/search?q=${query}`;
};

// NOTE: we use \S\s as substitute for /s (dotall flag)
// https://stackoverflow.com/questions/1068280/javascript-regex-multiline-flag-doesnt-work
const WRAPPER_REGEX = /data-lyrics-container.*?>([.\S\s]*?)<\/div/gm;

const search = async ({ artist = '', title }) => {
  const songDbgName = getSongName({ artist, title });

  const googleHtml = await searchGoogle(
    [artist, title, 'genius', 'lyrics'],
    `Google not working, send help ('${songDbgName}' btw.)`
  );

  const geniusUrl = getUrlFromSearchResults(
    googleHtml,
    'genius.com',
    `No genius page found for '${songDbgName}'`
  )[0];

  const geniusHtml = await fetchTextOrThrow(
    geniusUrl,
    `Could not fetch genius page for '${songDbgName}'`
  );

  const rawText = regexMatchOrThrow(
    WRAPPER_REGEX,
    geniusHtml,
    `Could not parse genius page for lyrics for '${songDbgName}' (${geniusUrl})`
  ).join('');

  const rawLines = rawText.split(/<br\/?>/gm);

  return {
    lines: rawLines.map(cleanupLine),
    url: geniusUrl,
  };
};

export default {
  name: 'genius',
  logo: ICON_GENIUS,
  searchFn: search,
  createSearchUrl,
};
