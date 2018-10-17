import { h, Component } from 'preact';
/** @jsx h */

const lyricsMock = {
  lines: [
   "No sleep, no sleep, no sleep",
   "Tryna do my thing but you always got me in too deep",
   "Can't breathe, can't breathe, can't breathe",
   "You keep making faces that I don't wanna see",
   "",
   "I don't like the way you talk to me",
   "Saying you can talk to me however you like",
   "I know that ain't right",
   "I don't like the way you talk to me",
   "Saying you can talk to me however you like",
   "I know that ain't right",
  ],
};

export class LyricsViewer extends Component {

  render () {
    /*
    const { lyrics} = this.props;
    if (lyrics === undefined) {
      return "Loading";
    }

    if (!lyrics.isOk || !!lyrics.error) {
      const err = lyrics.error || 'Unexpected error';
      return err;
    }
    */

    return (
      <div class="lyrics-viewer">
        {lyricsMock.lines.map(line => (
          <span class="lyrics-line">{line}</span>)
        )}
      </div>
    );
  }

}