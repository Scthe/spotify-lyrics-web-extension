import { h, Component } from 'preact';
/** @jsx h */
import * as auth from './auth';
import * as api from './api';
import config from '../config';

/////////////////////////////////////////

const STORAGE_KEY = 'spotify_token';
const RETRY_COUNT = 3;
const AUTH_OPTS = {
  clientId: config.spotify.clientId,
  clientSecret: config.spotify.clientSecret,
  redirectUri: browser.identity.getRedirectURL(),
  scope: 'user-read-currently-playing',
};
console.log('AUTH_OPTS: ', AUTH_OPTS);
console.warn(
  `Will do spotify auth with redirect url '${AUTH_OPTS.redirectUri}'.`
  + 'Make sure it is allowed in spotify app settings (in spotify dev portal)'
);


export const withSpotify = ComposedComponent => {

   return class WithSpotifyDecoratorWrapper extends Component {

    constructor (props) {
      super(props);

      // api.getCurrentSong(oauthToken);
      this.spotifyApi = {
        // getCurrentSong: this.wrapApiCall(this.getCurrentSong),
        getCurrentSong: this.wrapApiCall(api.getCurrentSong),
      };
    }

    wrapApiCall = fn_ => {
      const fn = api.withErrorCatch(fn_);
      const refreshToken = api.withErrorCatch(this.refreshToken);

      return async () => {
        let lastErr;
        let oauthToken = await this.getToken();
        console.log(`Will do API calls with init token:`, oauthToken);

        for (let i = 0; i < RETRY_COUNT; i++) {
          // execute API call
          const { result: fnRes, error: fnErr } = await fn(oauthToken);
          // console.log(`API call [${i+1}] returned`, {fnRes, fnErr});
          if (!fnErr && fnRes) {
            return { result: fnRes };
          }
          lastErr = fnErr;

          // API call failed, try to refresh API token
          const { result: refreshRes, error: refreshErr } = await refreshToken(oauthToken);
          // console.log(`Tried refresh token after [${i+1}] `, {refreshRes, refreshErr});
          if (refreshErr || !refreshRes) {
            // error during token refreh - panic!
            throw `Error refreshing spotify token: ${refreshErr || '-'}`;
          }

          // will retry with updated token. superfluous for last iter,
          // but comes handy when user opens extension again
          oauthToken = refreshRes;
        }

        // TODO at this point should request new auth/refresh pair
        return { error: lastErr };
      };
    }

    getToken = async () => {
      const storageToken = await this.loadTokenFromStorage(browser);

      if (storageToken) {
        console.log('[spotify] Found token in storage');
        return storageToken;
      } else {
        console.log('[spotify] Token not found in storage... requesting new');
        const newToken = await auth.doNewTokenRequest(browser, AUTH_OPTS);
        await this.storeTokenInStorage(newToken);
        return newToken;
      }
    }

    refreshToken = async (oldToken) => {
      let newToken = await auth.refreshToken(AUTH_OPTS, oldToken.refresh_token);
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
