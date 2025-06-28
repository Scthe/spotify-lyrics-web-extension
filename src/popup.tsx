import { render } from 'preact';
import { useState } from 'preact/hooks';
import { LYRICS_PROVIDERS, useLyrics } from './lyricsProvider';
import { Toolbar, SongHeader, LyricsViewer } from './components';
import { useYoutubeSong } from './youtube';
import { useSpotifySong } from './spotify';
import { getSongName } from './utils';
import { LyricsProvider } from './types';

const DEFAULT_LYRICS_PROVIDER = LYRICS_PROVIDERS[0];

/** Holds which lyrics provider we use e.g. genius or musixmatch */
const useLyricsProviderState = () => {
  const [current, setCurrent] = useState(DEFAULT_LYRICS_PROVIDER.name);
  const lyricsProvider =
    LYRICS_PROVIDERS.find((p) => p.name === current) ?? DEFAULT_LYRICS_PROVIDER;

  return {
    lyricsProvider,
    setLyricsProvider: (lp: LyricsProvider) => setCurrent(lp.name),
    isActiveProvider: (lp: LyricsProvider) => lp.name === lyricsProvider.name,
  };
};

const Popup = () => {
  const [isYouTubeMode, setYouTubeMode] = useState(false);
  const { lyricsProvider, setLyricsProvider, isActiveProvider } =
    useLyricsProviderState();

  // spotify
  const spotifySongData = useSpotifySong();
  const spotifyLyricsData = useLyrics(lyricsProvider, spotifySongData.data);

  // youtube
  const youTubeSongData = useYoutubeSong();
  const youTubeLyricsData = useLyrics(lyricsProvider, youTubeSongData.data);

  // decide on song to display based on current mode
  const songData = isYouTubeMode ? youTubeSongData : spotifySongData;
  const lyricsData = isYouTubeMode ? youTubeLyricsData : spotifyLyricsData;

  const finalError = songData.error || lyricsData.error;
  console.log('<Popup>', {
    spotifySong: spotifySongData.data,
    youTubeSong: youTubeSongData.data,
    spotifyLyricsData,
    youTubeLyricsData,
    songData,
    lyricsData,
    finalError,
  });

  return (
    <div>
      <Toolbar
        song={songData}
        setYouTubeMode={setYouTubeMode}
        isYouTubeMode={isYouTubeMode}
        setLyricsProvider={setLyricsProvider}
        providers={LYRICS_PROVIDERS.map((lp) => ({
          ...lp,
          isActive: isActiveProvider(lp),
          lyricsPageUrl: lyricsData.data?.url, // hacky, but only used if isActive
        }))}
      />
      <SongHeader song={songData} isYouTubeMode={isYouTubeMode} />
      <LyricsViewer
        key={getSongName(songData?.data)}
        lyricLines={lyricsData.data?.lines}
        error={finalError}
      />
    </div>
  );
};

render(<Popup />, document.getElementById('app')!);
