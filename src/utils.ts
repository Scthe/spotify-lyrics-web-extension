import Browser from 'webextension-polyfill';
import { Song } from './types';
import { useEffect } from 'preact/hooks';

const browser: Browser.Browser = require('webextension-polyfill');

export const openTab = (url: string) => {
  console.log(`Open new tab: '${url}'`);
  browser.tabs.create({
    url,
  });
};

export const classes = (...cls: Array<string | undefined>) => {
  return cls.filter((e) => !!e).join(' ');
};

export const getPersistentStorageAsync = async (storageKey: string) => {
  const storage = await browser.storage.local.get(storageKey);
  console.log(`[Storage] get '${storageKey}'`, storage);
  return storage[storageKey]; // weird API..
};

export const setPersistentStorageAsync = (storageKey: string, value: any) => {
  console.log(`[Storage] set '${storageKey}'`, value);
  return browser.storage.local.set({
    [storageKey]: value,
  });
};

export const getSongName = (song: Song | undefined) => {
  const { artist = '', title = '' } = song || {};
  return artist && artist.length > 0 ? `${artist} - '${title}'` : title;
};

export const useEffectOnce = (fn: () => void) => {
  useEffect(fn, []);
};

export const isError = (e: unknown): e is Error => !!e && typeof e === 'object'; // && 'message' in e
