import { h, Component } from 'preact';
/** @jsx h */
import {SvgIcon, ICON_YOUTUBE, Loader} from './index';


const AlbumArt = ({hasAnyResults, imageUrl, isYouTubeMode}) => {
  if (!hasAnyResults) {
    return (
      <div class="songHeader__albumArt songHeader__loader">
        <Loader />
      </div>
    );
  }

  if (isYouTubeMode) {
    return (
      <SvgIcon
        svg={ICON_YOUTUBE}
        className='songHeader__albumArt songHeader__albumArt_youTube'
      />
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

  render ({artist, title, albumArt, hasAnyResults, isYouTubeMode}) {
    return (
      <div class={this.getClasses()}>
        <AlbumArt
          imageUrl={albumArt}
          hasAnyResults={hasAnyResults}
          isYouTubeMode={isYouTubeMode}
        />
        <div class="songHeader__Text">
          <h2 class="songHeader__Title ellipsis">{title}</h2>
          <h4 class="songHeader__Artist ellipsis">{artist}</h4>
        </div>
      </div>
    );
  }

}