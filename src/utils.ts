import Browser from 'webextension-polyfill';
import { Song } from './types';
import { useEffect } from 'preact/hooks';

const browser: Browser.Browser = require('webextension-polyfill');

export const openTab = (url: string) => {
  // console.log(`open-tab '${url}'`);
  browser.tabs.create({
    url,
  });
};

export const classes = (...cls: Array<string | undefined>) => {
  return cls.filter((e) => !!e).join(' ');
};

export const getPersistentStorageAsync = async (storageKey: string) => {
  const storage = await browser.storage.local.get(storageKey);
  return storage[storageKey];
};

export const setPersistentStorageAsync = (storageKey: string, value: any) => {
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

/** Same as `Object.keys()`, but preserves key type if record used */
export function typesafeObjectKeys<T extends string | number | symbol>(
  obj: Record<T, unknown>
): T[] {
  const result = Object.keys(obj);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return result as any;
}

export const isError = (e: unknown): e is Error => !!e && typeof e === 'object'; // && 'message' in e
