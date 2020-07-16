const browser = require('webextension-polyfill');

import * as auth from './auth';
import config from '../config';
import {getPersistentStorageAsync, setPersistentStorageAsync} from '../utils';

const STORAGE_KEY = 'spotify_token';
const RETRY_COUNT = 3;
const HTTP_NO_CONTENT = 204;
const AUTH_OPTS = {
  clientId: config.spotify.clientId,
  clientSecret: config.spotify.clientSecret,
  redirectUri: browser.identity.getRedirectURL(),
  scope: 'user-read-currently-playing',
};


// console.log('AUTH_OPTS: ', AUTH_OPTS);
console.warn(
  `Will do spotify auth with redirect url '${AUTH_OPTS.redirectUri}' .`
  + 'Make sure it is allowed in spotify dev app settings (https://developer.spotify.com/dashboard/applications).'
);


/////////////////////////////
/////////////////////////////

/** Declare spotify API method */
const declareSpotifyApiMethod = (method, path) => async (authOpts, fetchOpts = {}) => {
  const resp = await fetch(`https://api.spotify.com/v1${path}`, {
    ...fetchOpts,
    headers: new Headers({
      Accept: "application/json",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${authOpts.access_token}`,
      ...fetchOpts.headers,
    }),
    method,
  });

  if (resp.status === HTTP_NO_CONTENT) {
    throw 'Spotify returned no data (http status 204)';
  }

  const result = await resp.json();
  if (!resp.ok || result.error) {
    throw result.error.message + ` (http status ${resp.status})`;
  }
  return result;
};

export const SPOTIFY_API = {
  currentlyPlaying: declareSpotifyApiMethod('GET', '/me/player/currently-playing'),
};


/////////////////////////////
/////////////////////////////

const getTokenFromStorageAsync = () => getPersistentStorageAsync(STORAGE_KEY);
const storeTokenInStorageAsync = newToken => setPersistentStorageAsync(STORAGE_KEY, newToken);

/** Get authorization token, either from local storage or from Spotify API */
const loadInitalToken = async (forceRenew = false) => {
  const storageToken = await getTokenFromStorageAsync();

  if (!forceRenew && storageToken) {
    console.log('[spotify] Found token in storage');
    return storageToken;
  } else {
    console.log('[spotify] Token not found in storage... requesting new');
    const newToken = await auth.doNewTokenRequest(AUTH_OPTS);
    await storeTokenInStorageAsync(newToken);
    return newToken;
  }
};

/** Use auth.refresh_token to get new credentials */
const refreshToken = async oldToken => {
  let newToken = await auth.refreshToken(AUTH_OPTS, oldToken.refresh_token);

  // the fact we execute this line means that auth.refreshToken did not threw and went ok
  newToken = { ...oldToken, ...newToken };

  await storeTokenInStorageAsync(newToken);
  return newToken;
};


/** Call with auto retries */
export const requestWithSpotifyAuthRetry = async (spotifyApiFn, fetchArgs) => {
  let lastErr;
  let oauthToken = await loadInitalToken();
  // console.log(`Will do API calls with init token:`, oauthToken);

  for (let i = 0; i < RETRY_COUNT; i++) {
    try {
      // execute API call
      const result = await spotifyApiFn(oauthToken, fetchArgs);
      return result; // success case

    } catch (error) {
      lastErr = error;

      // API call failed, try to refresh API token.
      // Next iteration of for-loop will try again.
      // Error during token refreh will panic!
      oauthToken = await refreshToken(oauthToken);
    }
  }

  // Well, we tried. None of the API tries suceeded.
  // We assume it was cause auth failed.
  // Could have been network error (so this whole fn is noop),
  // or lack of endpoint-specific permissions (this extension does
  // not require any). Could have been many things. We ignore them all.
  console.error([
    'Could not connect to Spotify.',
    'Network is down or some auth or totally wtf...',
    'Doing auth hard reset',
  ].join(' '));

  loadInitalToken(true); // do auth hard reset

  throw lastErr;
};
