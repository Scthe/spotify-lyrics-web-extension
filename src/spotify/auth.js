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
export const getUserConsent = (browser, opts) => {
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
export const getAccessToken = (code, {clientId, clientSecret, redirectUri}) => {
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
 * Oauth other
 */

/*
refreshToken = () => {
  const refreshToken = "...";
  const resp = await getAccessToken(refreshToken, authOpts);
  console.log('Resp:', resp);
  const respData = await resp.json()
  console.log('respText: ', respData);
}
*/