const searchGoogle = phraseArr => {
  const phrase = phraseArr.join(' ');
  // console.log(`Google search for '${phrase}'`);
  return fetch(`http://www.google.com/search?q=${phrase}`);
};

const getUrlFromSearchResults = (html, domain) => {
  // <a href="https:\/\/genius\.com.*?"
  const regex = new RegExp(`<a href="(https://${domain}.*?)"`);
  const regexRes = regex.exec(html);
  // console.log('match', match);
  // console.log('result', result);
  return regexRes !== null && regexRes.length > 1 ? regexRes[1] : undefined;
};

// const fetchTextOrThrow = (url, exMsg) => {} // TODO

/*
function getContentByURL(url, callback) {
  var req = new XMLHttpRequest();
  if(req) {
      req.open('GET', url, true);
      req.onreadystatechange =  function() {
          if (req.readyState == 4) {
              callback(req.responseText);
          }
      };
      req.send();
  }
}
*/

export const searchGenius = async ({artist, title}) => {
  const googleResp = await searchGoogle([artist, title, 'genius', 'lyrics']);
  // TODO check response and return error
  const googleHtml = await googleResp.text();
  const geniusUrl = getUrlFromSearchResults(googleHtml, 'genius.com');
  if (geniusUrl === undefined) {
    throw `No genius page found for ${artist} - ${title}`;
  }
  // console.log('geniusUrl', geniusUrl);
  
  // NOTE: we use \S\s as substitute for /s (dotall flag)
  // https://stackoverflow.com/questions/1068280/javascript-regex-multiline-flag-doesnt-work
  const WRAPPER_REGEX = /<div class="lyrics">[.\S\s]*?<p>([.\S\s]*?)<\/p>/gm; 
  const REMOVE_HTML_TAG = /<\/?[^>]*>/g;
  const REMOVE_NEWLINE = '\n';

  const geniusResp = await fetch(geniusUrl);
  // TODO check response and return error
  const geniusHtml = await geniusResp.text();
  const regexRes = WRAPPER_REGEX.exec(geniusHtml);
  if (regexRes === null) {
    throw `Could not parse genius page for lyrics for ${artist} - ${title} (${geniusUrl})`;
  }

  // console.log(regexRes[1]);
  const rawLines = regexRes[1].split('<br>');
  // console.log(rawLines);
  const lines = rawLines.map(line => {
    return (line
      .replace(REMOVE_HTML_TAG, '')
      .replace(REMOVE_NEWLINE, ''));
    });
  // console.log(lines);

  return lines;
};