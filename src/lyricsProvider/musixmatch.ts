import { parse } from 'node-html-parser';
import { ICON_MUSIXMATCH } from '../components';
import { getLyricsLineText, LyricsLine, LyricsProvider, Song } from '../types';
import { getSongName } from '../utils';
import {
  searchGoogle,
  getUrlFromSearchResults,
  fetchTextOrThrow,
  encodeSongAsSearchParam,
  parseLinesFromHtml,
  removeDuplicatedEmptyLines,
} from './_utils';

const createSearchUrl = (song: Song) => {
  const query = encodeSongAsSearchParam(song);
  return `https://www.musixmatch.com/search/${query}`;
};

export const parseMusixmatchPage = (
  htmlText: string,
  errMsg: string
): LyricsLine[] => {
  const root = parse(htmlText);

  // find first node
  const lyricsStartHeader = root
    .querySelectorAll('h2')
    .find((node) => node.text.trim().toLowerCase().startsWith('lyrics of'));
  if (!lyricsStartHeader) throw new Error(errMsg);

  // find div that contains all divs for each verse/refrain, etc.
  let lyricsContainer = lyricsStartHeader.parentNode;
  // count levels between line text and $lyricsContainer
  // if levels===3, then all sections are parented to $lyricsContainer
  // if levels===5, then there is an additional div that wraps all sections
  // otherwise: ????
  let lineEl = lyricsContainer.querySelectorAll('[dir="auto"]')[1]; // skip first h2 we used earlier
  let levels = 0;
  while (lineEl && lineEl !== lyricsContainer) {
    lineEl = lineEl.parentNode;
    ++levels;
  }
  if (levels >= 5) lyricsContainer = lyricsContainer.children[1];
  // console.log('musixmatch lyrics container:', {
  // classNames: lyricsContainer.classNames,
  // levels,
  // }); // dr=3, sos=5, bms=5

  // remove song name
  root.querySelectorAll('h2').forEach((node) => node.remove());

  // mark meta lines
  lyricsContainer.querySelectorAll('h3').forEach((node) => {
    node.textContent = `[${node.textContent.trim()}]`;
  });

  // add explicit line end markers
  // lyricsContainer.querySelectorAll('[dir="auto"]').forEach((node) => {
  // node.textContent = `${node.textContent}\n`;
  // });

  // console.log(lyricsContainer.children);
  let lines = parseLinesFromHtml(lyricsContainer.children, (el) =>
    el
      .querySelectorAll('[dir="auto"]')
      .map((lineEl) => lineEl.textContent.split('\n'))
  );

  // remove fluff at the end
  const forbiddenLines = ['add to favorites', 'share', 'show performers'];
  lines = lines.filter(
    (line) => !forbiddenLines.includes(getLyricsLineText(line).toLowerCase())
  );

  return removeDuplicatedEmptyLines(lines);
};

const search = async ({ artist = '', title }: Song) => {
  const songDbgName = getSongName({ artist, title });

  const googleHtml = await searchGoogle(
    [artist, title, 'musixmatch', 'lyrics'],
    `Google not working, send help ('${songDbgName}' btw.)`
  );
  // console.log(googleHtml);

  const pageUrl = getUrlFromSearchResults(
    googleHtml,
    'www.musixmatch.com',
    `No musixmatch page found for '${songDbgName}'`
  );

  console.log(`Musixmatch lyrics page:`, pageUrl);
  const htmlText = await fetchTextOrThrow(
    pageUrl,
    `Could not fetch musixmatch page for '${songDbgName}'`
  );

  return {
    url: pageUrl,
    lines: parseMusixmatchPage(
      htmlText,
      `Could not parse musixmatch page for lyrics for '${songDbgName}' (${pageUrl})`
    ),
  };
};

export default {
  name: 'musixmatch',
  logo: ICON_MUSIXMATCH,
  searchFn: search,
  createSearchUrl,
} satisfies LyricsProvider;
