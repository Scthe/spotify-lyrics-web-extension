import { h, Component } from 'preact';
/** @jsx h */

export default class SongHeader extends Component {

  render ({artist, title, albumArt}) {
    return (
      <div class="songHeader clearfix">
        <img class="songHeader__albumArt" src={albumArt} />
        <div class="songHeader__Text">
          <h2 class="songHeader__Title ellipsis">{title}</h2>
          <h4 class="songHeader__Artist ellipsis">{artist}</h4>
        </div>
      </div>
    );
  }

}