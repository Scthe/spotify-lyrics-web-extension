import { h, Component } from 'preact';
/** @jsx h */
import {Loader} from './index';


export class LyricsViewer extends Component {

  renderError (error) {
    return (
      <div class="lyrics-viewer--err">
        <span class="lyrics-viewer--err-msg">{error}</span>
      </div>
    );
  }

  render ({lyrics, error}) {
    if (error) {
      return this.renderError(error || 'Unexpected error');
    }

    if (!lyrics) {
      return (
        <div class="lyrics-viewer--loading">
          <Loader />
        </div>
      );
    }

    if (lyrics.error) {
      return this.renderError(lyrics.error || 'Unexpected error');
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