import { h, Component } from 'preact';
/** @jsx h */
import {getUserConsent, getAccessToken} from './auth';
import * as api from './api';
import config from '../config';

/////////////////////////////////////////

const authOpts = {
  clientId: config.spotify.clientId,
  clientSecret: config.spotify.clientSecret,
  redirectUri: '', //browser.identity.getRedirectURL(),
  scope: 'user-read-currently-playing',
};
console.log('authOpts: ', authOpts);

const parseUrlParams = url => {
  const paramStart = url.indexOf('?');
  const paramsString = paramStart === -1 ? '' : url.substr(paramStart + 1);
  return new URLSearchParams(paramsString);
};

/////////////////////////////////////////


const STORAGE_KEY = 'spotify_token';

export const withSpotify = ComposedComponent => {

   return class WithSpotifyDecoratorWrapper extends Component {

    async getToken () {
      const storage = await browser.storage.local.get(STORAGE_KEY);

      if (storage && storage[STORAGE_KEY] && storage[STORAGE_KEY].access_token) {
        console.log('Found token in storage');
        return storage[STORAGE_KEY];
      } else {
        console.log('Token not found in storage... requesting new');
        const newToken = await this.requestToken(authOpts);
        return await browser.storage.local.set({
          [STORAGE_KEY]: newToken,
        });
      }
    }

    async requestToken(authOpts) {
      const respAsUrl = await getUserConsent(browser, authOpts);

      const params = parseUrlParams(respAsUrl);
      // console.log(respAsUrl, params);
      const code = params.get('code');
      const err = params.get('error');
      // console.log(code, err);

      if (code === undefined || err !== null) {
        throw `Could not get user consent, returned error: '${err || ''}'`;
      }

      const resp = await getAccessToken(code, authOpts);
      console.log('Resp:', resp);
      const respData = await resp.json()
      console.log('respText: ', respData);
      return respData;

      /*respText:  {
        "access_token":"BQAnuKwFx8ueAIRk5_OU9vkysLsTitmxxeA4dmBX12YFPuI64X9WWQb6S1S0BKqTKNMB1xs7yr3QHk9_Pk3WSCImc06tHKR-fucDVJA4gFesS5ibXb3MmDXtpqjbkiUmY507wEc9fzw3wnUk-yfpgx_D",
        "token_type":"Bearer",
        "expires_in":3600,
        "refresh_token":"AQD8H_d5rMCqyoBdm_uP-FGogs9TLNSw8ed9zP4lVKzo9aLgmdNBzUrmmlfJ824oHm0mn298ZFNMHakXhXO4ofupp1rNjTrEHuJVtR3oY20iNplRAE_51uoj8llMENU_nysuzQ",
        "scope":"user-read-currently-playing"
      }*/
    }

    createSpotifyFacade () {
      const getCurrentSong = async () => {
        const oauthToken = await this.getToken();
        const song = await api.getCurrentSong(oauthToken);
        // TODO handle errors
        return song.json();
      };

      return {
        getCurrentSong,
      };
    }

    render() {
      return <ComposedComponent {...this.props} spotify={this.createSpotifyFacade()} />;
    }
  }

};
