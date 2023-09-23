import { h, Component } from 'preact';
/** @jsx h */
import { classes } from '../utils';
import { Loader } from './index';

export const LyricsViewer = ({ error, lyricLines }) => {
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
      {lyricLines.map((line) => (
        <LyricLine line={line} />
      ))}
    </div>
  );
};

const LyricLine = ({ line = '' }) => {
  const clazz = classes(
    'lyrics-line',
    isMetaLine(line) ? 'lyrics-line-meta' : ''
  );
  return <span class={clazz}>{line}</span>;
};

/** e.g. "[Verse 1]" on genius.com. Musixmatch sometimes has "(...)", but probably community contributed */
const isMetaLine = (line = '') => {
  if (line == null || typeof line !== 'string') {
    return false;
  }
  return line.startsWith('[') && line.endsWith(']');
};
