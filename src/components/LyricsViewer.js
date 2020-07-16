import { h, Component } from 'preact';
/** @jsx h */
import {Loader} from './index';


export const LyricsViewer = ({
  error,
  lyricLines,
}) => {
  if (error) {
    return (
      <div class="lyrics-viewer--err">
        <span class="lyrics-viewer--err-msg">{error}</span>
      </div>
    );
  }

  if (lyricLines == null) {
    return (
      <div class="lyrics-viewer--loading">
        <Loader />
      </div>
    );
  }

  return (
    <div class="lyrics-viewer">
      {lyricLines.map(line => (
        <span class="lyrics-line">{line}</span>)
      )}
    </div>
  );
};
