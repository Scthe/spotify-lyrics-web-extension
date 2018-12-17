import { h, Component } from 'preact';
/** @jsx h */
import {SvgIcon, ICON_YOUTUBE, Loader} from './index';

// only shallow, but we won't need more
const get = (obj, prop, default_) => (obj && obj[prop]) || default_;

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

export class SongHeader extends Component {

  getClasses () {
    const {isYouTubeMode} = this.props;
    return [
      'songHeader',
      'clearfix',
      isYouTubeMode ? 'songHeader-yt' : 'songHeader-spotify',
    ].join(' ');
  }

  render ({song, isYouTubeMode}) {
    return (
      <div class={this.getClasses()}>
        <AlbumArt
          imageUrl={get(song, 'albumArt')}
          isYouTubeMode={isYouTubeMode}
        />
        <div class="songHeader__Text">
          <h2 class="songHeader__Title ellipsis">{get(song, 'title', '')}</h2>
          <h4 class="songHeader__Artist ellipsis">{get(song, 'artist', '')}</h4>
        </div>
      </div>
    );
  }

}