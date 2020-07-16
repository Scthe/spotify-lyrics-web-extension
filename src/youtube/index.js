const browser = require('webextension-polyfill');
import { useState, useEffect } from 'preact/hooks';

const IS_YOUTUBE_URL_REGEX = /https?:\/\/[^\/]+youtube\.com\/watch/;

const cleanUpPageTitle = title => {
  let t1 = title.replace('YouTube', '').trim();
  if (t1.endsWith('-')) {
    t1 = t1.substring(0, t1.length - 1);
  }
  return t1.trim();
};

const getYoutubeTitle = async () => {
  const activeTabs = await browser.tabs.query({active: true});

  const youtubeTab = activeTabs.find(
    tab => IS_YOUTUBE_URL_REGEX.test(tab.url || '')
  );
  // console.log({activeTabs, youtubeTab});
  return youtubeTab ? cleanUpPageTitle(youtubeTab.title) : undefined;
};


export const useYoutubeSong = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(undefined);

  useEffect(async () => {
    const title = await getYoutubeTitle();
    const song = title ? {title} : undefined;
    setData(song);
    setLoading(false);
  }, []);

  return { loading, data, };
};
