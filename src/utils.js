const browser = require('webextension-polyfill');

export const openTab = url => {
  // console.log(`open-tab '${url}'`);
  browser.tabs.create({
    url,
  });
};


export const classes = (...cls) => {
  return cls.join(' ');
};

// only shallow, but we won't need more
export const get = (obj, prop, default_) => (obj && obj[prop]) || default_;

export const getPersistentStorageAsync = async storageKey => {
  const storage = await browser.storage.local.get(storageKey);
  return get(storage, storageKey);
};

export const setPersistentStorageAsync = (storageKey, value) => {
  return browser.storage.local.set({
    [storageKey]: value,
  });
};
