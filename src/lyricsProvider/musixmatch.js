import {ICON_MUSIXMATCH} from 'components';
import {
  searchGoogle,
  getUrlFromSearchResults,
  fetchTextOrThrow,
  regexMatchOrThrow,
  cleanupLine
} from './_utils';


const createSearchUrl = ({artist, title}) => {
  const q1 =`${artist} ${title}`.trim();
  const query = encodeURIComponent(q1);
  return `https://www.musixmatch.com/search/${query}`;
}

// NOTE: we use \S\s as substitute for /s (dotall flag)
// https://stackoverflow.com/questions/1068280/javascript-regex-multiline-flag-doesnt-work
const WRAPPER_REGEX = /<p class="mxm-lyrics__content ">([.\S\s]*?)<\/p>/gm;


const search = async ({artist, title}) => {
  const googleHtml = await searchGoogle(
    [artist, title, 'musixmatch', 'lyrics'],
    `Google not working, send help ('${artist}' - '${title}' btw.)`
  );

  const pageUrl = getUrlFromSearchResults(
    googleHtml, 'www.musixmatch.com',
    `No musixmatch page found for '${artist}' - '${title}'`
  )[0];

  const html = await fetchTextOrThrow(
    pageUrl,
    `Could not fetch musixmatch page for '${artist}' - '${title}'`
  );

  const rawText = regexMatchOrThrow(
    WRAPPER_REGEX, html,
    `Could not parse musixmatch page for lyrics for '${artist}' - '${title}' (${pageUrl})`
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
};