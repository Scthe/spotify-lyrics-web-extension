import { h, render } from "preact";
import { useState, useCallback } from "preact/hooks";
/** @jsx h */
import { LYRICS_PROVIDERS, useLyrics } from "./lyricsProvider";
import { Toolbar, SongHeader, LyricsViewer } from "./components";
import { useYoutubeSong } from "./youtube";
import { useSpotifySong } from "./spotify";
import { get } from "./utils";

// TODO change icon to one similar to chrome

/** Holds which lyrics provider we use e.g. genius or musixmatch */
const useLyricsProviderState = () => {
  const [current, setCurrent] = useState(LYRICS_PROVIDERS[0].name);
  const lyricsProvider = LYRICS_PROVIDERS.find((p) => p.name === current);

  const setLyricsProvider = useCallback((lp) => setCurrent(lp.name), []);
  const isActiveProvider = useCallback(
    (lp) => lp.name === lyricsProvider.name,
    [lyricsProvider.name]
  );

  return [lyricsProvider, setLyricsProvider, isActiveProvider];
};

const Popup = () => {
  const [isYouTubeMode, setYouTubeMode] = useState(false);
  const [lyricsProvider, setLyricsProvider, isActiveProvider] =
    useLyricsProviderState();

  // spotify
  const spotifySongData = useSpotifySong();
  const spotifyLyricsData = useLyrics(lyricsProvider, spotifySongData.data);

  // youtube
  const youTubeSongData = useYoutubeSong();
  const youTubeLyricsData = useLyrics(lyricsProvider, youTubeSongData.data);

  // decide on song to display based on current mode
  let lyricsData, songData;
  if (isYouTubeMode) {
    songData = youTubeSongData;
    lyricsData = youTubeLyricsData;
  } else {
    songData = spotifySongData;
    lyricsData = spotifyLyricsData;
  }

  const finalError = songData.error || lyricsData.error;
  console.log("<Popup>", {
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
          lyricsPageUrl: get(lyricsData.data, "url"), // hacky, but only used if isActive
        }))}
      />
      <SongHeader song={songData} isYouTubeMode={isYouTubeMode} />
      <LyricsViewer
        lyricLines={get(lyricsData.data, "lines")}
        error={finalError}
      />
    </div>
  );
};

render(<Popup />, document.getElementById("app"));
