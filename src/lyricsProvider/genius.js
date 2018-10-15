import {
  searchGoogle,
  getUrlFromSearchResults,
  fetchTextOrThrow,
  regexMatchOrThrow,
  cleanupLine
} from './_utils';


// NOTE: we use \S\s as substitute for /s (dotall flag)
// https://stackoverflow.com/questions/1068280/javascript-regex-multiline-flag-doesnt-work
// const WRAPPER_REGEX = /<div class="lyrics">[.\S\s]*?<p>([.\S\s]*?)<\/p>/gm;
const WRAPPER_REGEX = /<div class="lyrics">([.\S\s]*?)<\/p>/gm;


const search = async ({artist, title}) => {
  const googleHtml = await searchGoogle(
    [artist, title, 'genius', 'lyrics'],
    `Google not working, send help (${artist} - ${title} btw.)`
  );

  const geniusUrl = getUrlFromSearchResults(
    googleHtml, 'genius.com',
    `No genius page found for ${artist} - ${title}`
  )[0];
  // console.log('geniusUrl', geniusUrl);

  const geniusHtml = await fetchTextOrThrow(
    geniusUrl,
    `Could not fetch genius page for ${artist} - ${title}`
  );

  let rawText = regexMatchOrThrow(
    WRAPPER_REGEX, geniusHtml,
    `Could not parse genius page for lyrics for ${artist} - ${title} (${geniusUrl})`
  ).join('');
  rawText.substring(rawText.indexOf('<p>') + 3);

  const rawLines = rawText.split('<br>');
  return rawLines.map(cleanupLine);
};

export default {
  name: 'genius',
  logo: '',
  searchFn: search,
};