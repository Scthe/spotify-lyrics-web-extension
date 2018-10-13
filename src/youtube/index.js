// TODO verify support mobile etc.
const IS_YOUTUBE_URL_REGEX = /https?:\/\/[^\/]+youtube\.com\/watch/;

export const getYoutubeTitle = browser => {
  return browser.tabs.query({active: true}).then(tabs => {
    const {url, title} = tabs[0];
    if (!IS_YOUTUBE_URL_REGEX.test(url)) {
      return undefined;
    }
    // console.log(title);
    return title.replace('YouTube', '');
  });
};