import { classes } from '../utils';
import { Loader } from './index';
import { LyricsLine, SongDetectState } from '../types';

interface Props {
  error: SongDetectState['error'];
  lyricLines: Array<LyricsLine> | undefined | null;
}

export const LyricsViewer = ({ error, lyricLines }: Props) => {
  if (error) {
    return (
      <div className="lyrics-viewer--err">
        <span className="lyrics-viewer--err-msg">
          {error || 'Something went wrong'}
        </span>
      </div>
    );
  }

  if (lyricLines == null) {
    return (
      <div className="lyrics-viewer--loading">
        <Loader />
      </div>
    );
  }

  return (
    <div className="lyrics-viewer">
      {lyricLines.map((line) => (
        <LyricLine line={line} />
      ))}
    </div>
  );
};

const LyricLine = ({ line = '' }: { line: LyricsLine }) => {
  const clazz = classes(
    'lyrics-line',
    isMetaLine(line) ? 'lyrics-line-meta' : ''
  );
  return <span className={clazz}>{line}</span>;
};

// TODO enforce new line before
/** e.g. "[Verse 1]" on genius.com. Musixmatch sometimes has "(...)", but probably community contributed */
const isMetaLine = (line = '') => {
  if (line == null || typeof line !== 'string') {
    return false;
  }
  return line.startsWith('[') && line.endsWith(']');
};
