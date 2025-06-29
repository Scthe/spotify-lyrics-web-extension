import { SvgIcon, ICON_YOUTUBE, Loader } from './index';
import { classes } from '../utils';
import { SongDetectState } from '../types';

interface Props {
  song: SongDetectState;
  isYouTubeMode: boolean;
}

const AlbumArt = ({ song, isYouTubeMode }: Props) => {
  // don't need imageUrl for this
  if (isYouTubeMode) {
    return (
      <SvgIcon
        svg={ICON_YOUTUBE}
        className="songHeader__albumArt songHeader__albumArt_youTube"
      />
    );
  }

  const imageUrl = song.data?.albumArt;
  if (!imageUrl) {
    return (
      <div className="songHeader__albumArt songHeader__loader">
        <Loader />
      </div>
    );
  }

  return <img className="songHeader__albumArt" src={imageUrl} />;
};

export const SongHeader = ({ song, isYouTubeMode }: Props) => {
  const className = classes(
    'songHeader',
    'clearfix', // TODO ?!
    isYouTubeMode ? 'songHeader-yt' : 'songHeader-spotify'
  );

  const title = song?.data?.title || '';
  const artist = song.data?.artist || '';
  /*
  console.log('<SongHeader>', {
    isYouTubeMode,
    title,
    artist,
  });*/

  return (
    <div className={className}>
      <AlbumArt song={song} isYouTubeMode={isYouTubeMode} />
      <div className="songHeader__Text">
        <h2 className="songHeader__Title ellipsis">{title}</h2>
        <h4 className="songHeader__Artist ellipsis">{artist}</h4>
      </div>
    </div>
  );
};
