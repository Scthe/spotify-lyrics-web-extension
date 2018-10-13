const executeAuthorizedCall = (authOpts, path, {headers, ...restOpts}) => {
  const {access_token} = authOpts;
  return fetch(`https://api.spotify.com/v1${path}`, {
    ...restOpts,
    headers: new Headers({
      Accept: "application/json",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${access_token}`,
      ...headers,
    }),
  });
}

const simpleGet = path => authOpts => 
  executeAuthorizedCall(authOpts, path, { method: 'GET' });

export const getCurrentSong = simpleGet('/me/player/currently-playing');

