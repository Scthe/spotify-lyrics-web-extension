import { h, Component } from 'preact';
/** @jsx h */
import {Loader} from './index';


export class LyricsViewer extends Component {

  render ({lyrics}) {
    if (!lyrics) {
      return (
        <div class="lyrics-viewer--loading">
          <Loader />
        </div>
      );
    }

    if (lyrics.error) {
      const err = lyrics.error || 'Unexpected error';
      return (
        <div class="lyrics-viewer--err">
          <span class="lyrics-viewer--err-msg">{err}</span>
        </div>
      );
    }

    return (
      <div class="lyrics-viewer">
        {lyrics.lines.map(line => (
          <span class="lyrics-line">{line}</span>)
        )}
      </div>
    );
  }

}