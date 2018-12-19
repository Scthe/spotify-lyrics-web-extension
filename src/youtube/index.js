const browser = require('webextension-polyfill');

const IS_YOUTUBE_URL_REGEX = /https?:\/\/[^\/]+youtube\.com\/watch/;

const cleanUpPageTitle = title => {
  let t1 = title.replace('YouTube', '').trim();
  if (t1.endsWith('-')) {
    t1 = t1.substring(0, t1.length - 1);
  }
  return t1.trim();
};

export const getYoutubeTitle = () => {
  return browser.tabs.query({active: true}).then(tabs => {
    const {url, title} = tabs[0];
    if (!IS_YOUTUBE_URL_REGEX.test(url)) {
      return undefined;
    }
    // console.log(title);
    return cleanUpPageTitle(title);
  });
};