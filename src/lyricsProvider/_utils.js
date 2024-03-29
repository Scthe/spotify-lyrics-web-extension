//////////////////////
/// fetch and requests
//////////////////////

export const fetchTextOrThrow = async (url, exMsg) => {
  const resp = await fetch(url);
  if (!resp.ok) {
    throw exMsg;
  }
  return resp.text();
};

export const createGoogleSearchUrl = (phraseArr) => {
  const q1 = phraseArr.join(' ').trim();
  const query = encodeURIComponent(q1);
  return `https://www.google.com/search?q=${query}`;
};

export const searchGoogle = (phraseArr, exMsg) => {
  // console.log(`Google search for '${phrase}'`);
  return fetchTextOrThrow(createGoogleSearchUrl(phraseArr), exMsg);
};

//////////////////////
/// regex
//////////////////////

const matchAll = (regex, text) => {
  const matches = [];
  text.replace(regex, (...args) => {
    const arr = args.slice(1, -2);
    matches.push(arr);
  });
  return matches.length ? matches : null;
};

export const regexMatchOrThrow = (regex, text, exMsg) => {
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

export const getUrlFromSearchResults = (html, domain, exMsg) => {
  const regex = new RegExp(`href="(https:\/\/${domain}.*?)"`);
  return regexMatchOrThrow(regex, html, exMsg)[0];
};

export const cleanupLine = (line) => {
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
  Object.keys(htmlEntities).forEach((entity) => {
    const entityNumbers = htmlEntities[entity];
    entityNumbers.forEach((entityNumber) => {
      cleanedLine = cleanedLine.replaceAll(entityNumber, entity);
    });
  });

  return cleanedLine.trim();
};
