import { useCallback } from 'preact/hooks';

import { SvgIcon, ICON_GOOGLE_G, ICON_YOUTUBE } from './index';
import { openTab, classes } from '../utils';
import { createGoogleSearchUrl } from '../lyricsProvider/_utils';
import { useYoutubeSong } from '../youtube';
import { LyricsProvider, SongDetectState, WithClassName } from '../types';

type ToolbarBtnProps = WithClassName & {
  active: boolean;
  logo: string;
  tooltip?: string;
  onClick?: preact.JSX.MouseEventHandler<HTMLDivElement>;
};

const ToolbarBtn = ({
  logo,
  className,
  active,
  onClick,
  tooltip,
}: ToolbarBtnProps) => {
  return (
    <SvgIcon
      tooltip={tooltip}
      className={classes(
        'toolbar_btn',
        className,
        active ? 'toolbar_active' : 'toolbar_inactive'
      )}
      svg={logo}
      onClick={onClick}
    />
  );
};

type LyricsProviderOpts = LyricsProvider & {
  isActive: boolean;
  lyricsPageUrl: string | undefined;
};

interface Props {
  song: SongDetectState;
  setYouTubeMode: (b: boolean) => void;
  isYouTubeMode: boolean;
  setLyricsProvider: (lp: LyricsProvider) => void;
  providers: Array<LyricsProviderOpts>;
}

const ProviderBtn = ({
  song,
  provider,
  setLyricsProvider,
}: Pick<Props, 'song' | 'setLyricsProvider'> & {
  provider: LyricsProviderOpts;
}) => {
  const { name, logo, lyricsPageUrl, isActive } = provider;

  const onClick = useCallback(() => {
    if (isActive && song.data != null) {
      if (lyricsPageUrl) {
        openTab(lyricsPageUrl);
      }
    } else {
      setLyricsProvider(provider);
    }
  }, [isActive, song, name]);

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
}: Pick<Props, 'isYouTubeMode' | 'setYouTubeMode'>) => {
  const { loading, data } = useYoutubeSong();

  const toggleYouTubeMode = useCallback(() => {
    setYouTubeMode(!isYouTubeMode);
  }, [isYouTubeMode]);

  return !loading && data != null ? (
    <ToolbarBtn
      tooltip="Toggle YouTube mode"
      logo={ICON_YOUTUBE}
      className="toolbar_youtube"
      active={isYouTubeMode}
      onClick={toggleYouTubeMode}
    />
  ) : null;
};

export const Toolbar = ({
  song,
  setYouTubeMode,
  isYouTubeMode,
  setLyricsProvider,
  providers,
}: Props) => {
  console.log('<Toolbar>', { song, isYouTubeMode, providers });

  const onGoogleClick = useCallback(() => {
    const googleUrl = createGoogleSearchUrl([
      song.data?.artist || '',
      song.data?.title || '',
      'lyrics',
    ]);

    if (googleUrl && song.data != null) {
      openTab(googleUrl);
    }
  }, [song]);

  return (
    <div className="toolbar">
      <div className="toolbar__left">
        <YouTubeBtn
          isYouTubeMode={isYouTubeMode}
          setYouTubeMode={setYouTubeMode}
        />
      </div>
      <div className="toolbar__right">
        <ToolbarBtn
          tooltip="Search Google for lyrics"
          logo={ICON_GOOGLE_G}
          className="toolbar_google"
          active={true}
          onClick={onGoogleClick}
        />
        {providers.map((p) => (
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
