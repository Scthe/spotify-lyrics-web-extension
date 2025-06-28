//////////////////////
/// fetch and requests
//////////////////////

import { Song } from '../types';
import { typesafeObjectKeys } from '../utils';

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
  // console.log(`Google search for '${phrase}'`);
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

const REMOVE_HTML_TAG_REGEX = /<\/?[^>]*>/g;
const REMOVE_NEWLINE_REGEX = '\n'; // nice regex m8

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

export const cleanupLine = (line: string) => {
  // some special cases I noticed:
  const htmlEntities = {
    // e.g. "Sultans of swing"
    "'": ['&#x27;', '&#39;'],
    // e.g. "Buffalo Springfield - For What It's Worth 1967"
    '"': ['&quot;', '&#34;'],
    // probably also:
    '&': ['&amp;', '&#38;'],
    '<': ['&lt;', '&#60;'],
    '>': ['&gt;'],
    ' ': ['&nbsp;', '&#160;'],
    '-': ['&ndash;', '&mdash;'],
  };

  let cleanedLine = unescape(line)
    .replaceAll(REMOVE_HTML_TAG_REGEX, '')
    .replace(REMOVE_NEWLINE_REGEX, '');

  // could create regexes. Whatever
  typesafeObjectKeys(htmlEntities).forEach((entity) => {
    const entityNumbers = htmlEntities[entity];
    entityNumbers.forEach((entityNumber) => {
      cleanedLine = cleanedLine.replaceAll(entityNumber, entity);
    });
  });

  return cleanedLine.trim();
};
