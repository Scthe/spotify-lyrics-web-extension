import { h, Component } from 'preact';
/** @jsx h */
import * as auth from './auth';
import * as api from './api';
import config from '../config';


const STORAGE_KEY = 'spotify_token';
const RETRY_COUNT = 3;
const AUTH_OPTS = {
  clientId: config.spotify.clientId,
  clientSecret: config.spotify.clientSecret,
  redirectUri: browser.identity.getRedirectURL(),
  scope: 'user-read-currently-playing',
};
// console.log('AUTH_OPTS: ', AUTH_OPTS);
console.warn(
  `Will do spotify auth with redirect url '${AUTH_OPTS.redirectUri}'.`
  + 'Make sure it is allowed in spotify app settings (in spotify dev portal)'
);


export const withSpotify = ComposedComponent => {

   return class WithSpotifyDecoratorWrapper extends Component {

    constructor (props) {
      super(props);

      this.spotifyApi = {
        getCurrentSong: this.wrapApiCall(api.getCurrentSong),
      };
    }

    wrapApiCall = fn_ => {
      const fn = api.withErrorCatch(fn_);
      const refreshToken = api.withErrorCatch(this.refreshToken);

      return async () => {
        let lastErr;
        let oauthToken = await this.loadInitalToken();
        // console.log(`Will do API calls with init token:`, oauthToken);

        for (let i = 0; i < RETRY_COUNT; i++) {
          // execute API call
          const { result, error } = await fn(oauthToken);
          if (result) {
            return { result: result };
          }
          lastErr = error;

          // API call failed, try to refresh API token.
          // Next iteration of for-loop will try again
          const { result: refreshRes, error: refreshErr } = await refreshToken(oauthToken);
          if (refreshErr) {
            // error during token refreh - panic!
            return {
              error: `Error refreshing spotify token: ${refreshErr || '-'}`
            };
          }

          // will retry with updated token. superfluous for last iter,
          // but comes handy when user opens extension again
          oauthToken = refreshRes;
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
        this.loadInitalToken(true); // do auth hard reset

        return { error: lastErr };
      };
    }

    /** Get first token, either from local storage, or from Spotify API */
    loadInitalToken = async (forceRenew = false) => {
      const storageToken = await this.loadTokenFromStorage(browser);

      if (!forceRenew && storageToken) {
        console.log('[spotify] Found token in storage');
        return storageToken;
      } else {
        console.log('[spotify] Token not found in storage... requesting new');
        const newToken = await auth.doNewTokenRequest(browser, AUTH_OPTS);
        await this.storeTokenInStorage(newToken);
        return newToken;
      }
    }

    /** Use auth.refresh_token to get new credentials */
    refreshToken = async (oldToken) => {
      let newToken = await auth.refreshToken(AUTH_OPTS, oldToken.refresh_token);

      // the fact we execute this line means that auth.refreshToken did not threw and went ok
      newToken =  {...oldToken, ...newToken };

      await this.storeTokenInStorage(newToken);
      return newToken;
    }

    async loadTokenFromStorage (browser) {
      const storage = await browser.storage.local.get(STORAGE_KEY);

      if (storage && storage[STORAGE_KEY] && storage[STORAGE_KEY].access_token) {
        return storage[STORAGE_KEY];
      }

      return null;
    }

    storeTokenInStorage (token) {
      return browser.storage.local.set({
        [STORAGE_KEY]: token,
      });
    }

    render() {
      return (
        <ComposedComponent
          spotify={this.spotifyApi}
          {...this.props}
        />
      );
    }

  }; // END class WithSpotifyDecoratorWrapper

};
