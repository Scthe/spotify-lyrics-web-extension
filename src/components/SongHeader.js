import { h, Component } from 'preact';
/** @jsx h */
import {SvgIcon, ICON_YOUTUBE, Loader} from './index';
import {classes, get} from '../utils';

const AlbumArt = ({imageUrl, isYouTubeMode}) => {
  // don't need imageUrl for this
  if (isYouTubeMode) {
    return (
      <SvgIcon
        svg={ICON_YOUTUBE}
        className='songHeader__albumArt songHeader__albumArt_youTube'
      />
    );
  }

  if (!imageUrl) {
    return (
      <div class="songHeader__albumArt songHeader__loader">
        <Loader />
      </div>
    );
  }

  return (
    <img class='songHeader__albumArt' src={imageUrl} />
   );
};


export const SongHeader = ({
  song,
  isYouTubeMode,
}) => {
  const className = classes(
    'songHeader',
    'clearfix',
    isYouTubeMode ? 'songHeader-yt' : 'songHeader-spotify',
  );

  console.log('<SongHeader>', {
    isYouTubeMode,
    title: get(song.data, 'title', ''),
    artist: get(song.data, 'artist', ''),
  });

  return (
    <div class={className}>
      <AlbumArt
        imageUrl={get(song.data, 'albumArt')}
        isYouTubeMode={isYouTubeMode}
      />
      <div class="songHeader__Text">
        <h2 class="songHeader__Title ellipsis">{get(song.data, 'title', '')}</h2>
        <h4 class="songHeader__Artist ellipsis">{get(song.data, 'artist', '')}</h4>
      </div>
    </div>
  );
};
