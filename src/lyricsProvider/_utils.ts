import { HTMLElement } from 'node-html-parser';
import { getLyricsLineText, LyricsLine, Song } from '../types';

//////////////////////
/// fetch and requests
//////////////////////

export const fetchTextOrThrow = async (url: string, exMsg: string) => {
  const resp = await fetch(url);
  if (!resp.ok) {
    throw exMsg;
  }
  return resp.text();
};

export const createGoogleSearchUrl = (phraseArr: string[]) => {
  const q1 = phraseArr.join(' ').trim();
  const query = encodeURIComponent(q1);
  return `https://www.google.com/search?q=${query}`;
};

export const searchGoogle = (phraseArr: string[], exMsg: string) => {
  console.log(`Google search for:`, phraseArr);
  return fetchTextOrThrow(createGoogleSearchUrl(phraseArr), exMsg);
};

export const encodeSongAsSearchParam = ({ artist = '', title }: Song) => {
  const q1 = `${artist} ${title}`.trim();
  return encodeURIComponent(q1);
};

//////////////////////
/// regex
//////////////////////

const matchAll = (regex: RegExp, text: string) => {
  const matches: string[][] = [];
  text.replace(regex, (...args) => {
    const arr = args.slice(1, -2) as string[];
    matches.push(arr);
    return ''; // does not matter
  });
  return matches.length ? matches : null;
};

export const regexMatchOrThrow = (
  regex: RegExp,
  text: string,
  exMsg: string
) => {
  const res = matchAll(regex, text);

  if (res === null || res.length === 0) {
    throw exMsg;
  }

  return res;
};

//////////////////////
/// html parse
//////////////////////

export const getUrlFromSearchResults = (
  html: string,
  domain: string,
  exMsg: string
) => {
  const regex = new RegExp(`href="(https:\/\/${domain}.*?)"`);
  const firstMatch = regexMatchOrThrow(regex, html, exMsg)[0];
  if (firstMatch === null || firstMatch.length === 0) {
    throw exMsg;
  }
  return firstMatch[0];
};

export const removeDuplicatedEmptyLines = <LineT extends string | LyricsLine>(
  originalLines: LineT[]
): LineT[] => {
  let lastLineWasEmpty = true;
  const result: LineT[] = [];

  originalLines.forEach((line) => {
    const lineText = getLyricsLineText(line).trim();
    if (lineText.length) {
      lastLineWasEmpty = false;
      result.push(line);
    } else {
      if (!lastLineWasEmpty) result.push(line);
      lastLineWasEmpty = true;
    }
  });

  while (result.length > 0 && getLyricsLineText(result.at(-1)!).length === 0) {
    result.pop();
  }

  return result;
};

/** e.g. "[Verse 1]" on genius.com. Musixmatch sometimes has "(...)", but probably community contributed */
const isMetaLine = (line: string) => {
  if (line == null || typeof line !== 'string') return false;
  line = line.trim();
  return line.startsWith('[') && line.endsWith(']');
};

export const parseLinesFromHtml = (
  lyricContainers: HTMLElement[],
  extractTextNodes: (el: HTMLElement) => Array<string | string[]>
) => {
  const resultLines: LyricsLine[] = [];
  // return lyricContainers.map((e) => e?.textContent).flat();
  lyricContainers.forEach((lyricFragment) => {
    resultLines.push('', ''); // indicate fragment border
    // console.log(
    // '--- FRAGMENT:',
    // lyricFragment.textContent.trimStart().substring(0, 20).trim()
    // );

    // console.log(lyricFragment.textContent);
    // let lines = lyricFragment.textContent.split('\n');
    let lines = extractTextNodes(lyricFragment).flat();
    lines.forEach((rawLine) => {
      let line = rawLine.trim();
      // console.log(`LINE: '${line}'`);

      // HTML whitespace quirks...
      if (rawLine.startsWith(' ') && resultLines.length > 0) {
        const prevLine = resultLines.pop();
        line = `${prevLine} ${line}`;
      }

      // append
      line = line.trim();
      if (isMetaLine(line)) {
        resultLines.push(''); // ensure empty line before
        resultLines.push({ meta: true, text: line });
      } else {
        resultLines.push(line);
      }
    });
  });

  return removeDuplicatedEmptyLines(resultLines);
};
