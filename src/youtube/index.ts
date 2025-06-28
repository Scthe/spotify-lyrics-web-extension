import { useState } from 'preact/hooks';
import Browser from 'webextension-polyfill';
import { Song, SongDetectState } from '../types';
import { useEffectOnce } from '../utils';

const browser: Browser.Browser = require('webextension-polyfill');

const IS_YOUTUBE_URL_REGEX = /https?:\/\/[^\/]+youtube\.com\/watch/;

const cleanUpPageTitle = (title: string = '') => {
  let t1 = title.replace('YouTube', '').trim();
  if (t1.endsWith('-')) {
    t1 = t1.substring(0, t1.length - 1);
  }
  return t1.trim();
};

const getYoutubeTitle = async () => {
  const activeTabs = await browser.tabs.query({ active: true });

  const youtubeTab = activeTabs.find((tab) =>
    IS_YOUTUBE_URL_REGEX.test(tab.url || '')
  );
  // console.log({activeTabs, youtubeTab});
  return youtubeTab ? cleanUpPageTitle(youtubeTab.title) : undefined;
};

export const useYoutubeSong = (): SongDetectState => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Song | undefined>(undefined);

  useEffectOnce(async () => {
    const title = await getYoutubeTitle();
    const song: Song | undefined = title ? { title } : undefined;
    setData(song);
    setLoading(false);
  });

  return { loading, data, error: undefined };
};
