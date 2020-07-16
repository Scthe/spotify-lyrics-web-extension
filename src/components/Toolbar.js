import { h } from 'preact';
import { useCallback } from 'preact/hooks';
/** @jsx h */

import {SvgIcon, ICON_GOOGLE_G, ICON_YOUTUBE} from './index';
import {openTab, get} from '../utils';
import {createGoogleSearchUrl} from '../lyricsProvider/_utils';
import {useYoutubeSong} from '../youtube';


const ToolbarBtn = ({logo, className, active, onClick, tooltip}) => {
  const classes = [
    'toolbar_btn',
    className,
    active ? 'toolbar_active' : 'toolbar_inactive',
  ].join(' ');

  return (
    <SvgIcon
      tooltip={tooltip}
      className={classes}
      svg={logo}
      onClick={onClick}
    />
  );
};


const ProviderBtn = ({
  song,
  provider,
  setLyricsProvider,
}) => {
  const {name, logo, lyricsPageUrl, isActive} = provider;

  const onClick = useCallback(
    () => {
      if (isActive && song.data != null) {
        if (lyricsPageUrl) {
          openTab(lyricsPageUrl);
        }
      } else {
        setLyricsProvider(provider);
      }
    },
    [isActive, song, name]
  );

  return (
    <ToolbarBtn
      tooltip={name}
      logo={logo}
      className={`toolbar_${name}`}
      active={isActive}
      onClick={onClick}
    />
  );
};


const YouTubeBtn = ({
  isYouTubeMode,
  setYouTubeMode,
}) => {
  const {loading, data} = useYoutubeSong();

  const toggleYouTubeMode = useCallback(() => {
    setYouTubeMode(!isYouTubeMode);
  }, [isYouTubeMode]);

  return !loading && data != null ? (
    <ToolbarBtn
      tooltip='Toggle YouTube mode'
      logo={ICON_YOUTUBE}
      className='toolbar_youtube'
      active={isYouTubeMode}
      onClick={toggleYouTubeMode}
    />
  ) : null;
}


export const Toolbar = ({
  song,
  setYouTubeMode,
  isYouTubeMode,
  setLyricsProvider,
  providers,
}) => {
  console.log('<Toolbar>', {song, isYouTubeMode, providers});

  const onGoogleClick = useCallback(
    () => {
      const googleUrl = createGoogleSearchUrl([
        get(song.data, 'artist', ''),
        get(song.data, 'title', ''),
        'lyrics'
      ]);

      if (googleUrl && song.data != null) {
        openTab(googleUrl);
      }
    },
    [song]
  );

  return (
    <div class="toolbar clearfix">
      <div class="toolbar__left">
        <YouTubeBtn
          isYouTubeMode={isYouTubeMode}
          setYouTubeMode={setYouTubeMode}
        />
      </div>
      <div class="toolbar__right">
        <ToolbarBtn
          tooltip='Search Google for lyrics'
          logo={ICON_GOOGLE_G}
          className='toolbar_google'
          active={true}
          onClick={onGoogleClick}
        />
        {providers.map(p => (
          <ProviderBtn
            key={p.name}
            provider={p}
            song={song}
            setLyricsProvider={setLyricsProvider}
          />
        ))}
      </div>
    </div>
  );
};
