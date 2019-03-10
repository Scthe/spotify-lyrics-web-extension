const HTTP_NO_CONTENT = 204;

export const withErrorCatch = fn => async (...args) => {
  try {
    const result = await fn(...args);
    return { result };
  } catch (error) {
    return { error };
  }
};

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

const simpleGet = path => async authOpts => {
  const resp = await executeAuthorizedCall(authOpts, path, { method: 'GET' });
  if (resp.status === HTTP_NO_CONTENT) {
    throw 'Spotify returned no data (http status 204)';
  }

  const result = await resp.json();

  if (!resp.ok || result.error) {
    throw result.error.message + ` (http status ${resp.status})`;
  }
  return result;
}


export const getCurrentSong = simpleGet('/me/player/currently-playing');

