const browser = require('webextension-polyfill');

// https://developer.spotify.com/documentation/general/guides/authorization-guide/

/*
 * Oauth step 1
 */

const constructAuthCodeUrl = ({clientId, scope, redirectUri}) => {
  return [
    'https://accounts.spotify.com/authorize',
    '?response_type=code',
    '&client_id=' + clientId,
    (scope ? '&scope=' + encodeURIComponent(scope) : ''),
    '&redirect_uri=' + encodeURIComponent(redirectUri),
  ].join('');
};

/** First step of oauth: get code */
const getUserConsent = (opts) => {
  return browser.identity.launchWebAuthFlow({
    url: constructAuthCodeUrl(opts), // CLIENT_ID, scope, redirectUri
    interactive: true, // first time should always be interactive!
  })
};


/*
 * Oauth step 2
 */

/** Convert js object to 'a=1&b=2&...'  */
const bodyToFormUrlEncoded = bodyObj => {
  const sp = new URLSearchParams(bodyObj);
  return sp.toString();
};

/** Second step of oauth: given code, we get access_token, refresh_token et al.  */
const getAccessToken = (code, {clientId, clientSecret, redirectUri}) => {
  const body = {
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri, // NOTE: do not use 'encodeURIComponent' here
    client_id: clientId,
    client_secret: clientSecret,
  };

  return fetch("https://accounts.spotify.com/api/token", {
    method: 'POST',
    headers: new Headers({
      // Authorization: 'Basic ' + btoa(`${clientId}:${clientSecret}`), // or provide in body
      'Content-Type': 'application/x-www-form-urlencoded', // NOTE: important
    }),
    body: bodyToFormUrlEncoded(body),
  });
};



/*
 * Oauth main
 */

const parseUrlParams = url => {
  const paramStart = url.indexOf('?');
  const paramsString = paramStart === -1 ? '' : url.substr(paramStart + 1);
  return new URLSearchParams(paramsString);
};

export const doNewTokenRequest = async (authOpts) => {
  // step 1
  const respAsUrl = await getUserConsent(authOpts);
  const params = parseUrlParams(respAsUrl);
  const code = params.get('code');
  const err = params.get('error');

  if (code === undefined || err !== null) {
    throw `Could not get user consent, returned error: '${err || ''}'`;
  }

  // step 2
  const resp = await getAccessToken(code, authOpts);
  const respData = await resp.json();
  if (!resp.ok) {
    throw 'Error converting code to access token: ' + JSON.stringify(respData);
  }

  // console.log('doNewTokenRequest returns', respData);
  return respData;
}



/*
 * Oauth refresh
 */

const doRefreshToken = (refreshToken, {clientId, clientSecret}) => {
  const body = {
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret,
  };

  return fetch("https://accounts.spotify.com/api/token", {
    method: 'POST',
    headers: new Headers({
      // Authorization: 'Basic ' + btoa(`${clientId}:${clientSecret}`), // or provide in body
      'Content-Type': 'application/x-www-form-urlencoded', // NOTE: important
    }),
    body: bodyToFormUrlEncoded(body),
  });
};

export const refreshToken = async (authOpts, refreshToken) => {
  console.log(`refreshToken '${refreshToken}'`, authOpts);
  const resp = await doRefreshToken(refreshToken, authOpts);
  const respData = await resp.json();
  if (!resp.ok) {
    throw 'Error refreshing spotify token: ' + JSON.stringify(respData);
  }

  return respData;
}
