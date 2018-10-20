import { h, Component } from 'preact';
/** @jsx h */
import {Loader} from './index';


export class LyricsViewer extends Component {

  doneDownloading (lyrics) {
    if (!lyrics) { return false; }

    return lyrics.isOk !== undefined;
  }

  lyricsDownloadedOk (lyrics) {
    return lyrics.isOk === true && !lyrics.error && lyrics.lines;
  }

  render ({lyrics}) {
    if (!this.doneDownloading(lyrics)) {
      return (
        <div class="lyrics-viewer--loading">
          <Loader />
        </div>
      );
    }

    if (!this.lyricsDownloadedOk(lyrics)) {
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