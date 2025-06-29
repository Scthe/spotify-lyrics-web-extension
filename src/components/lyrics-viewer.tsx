import { classes } from '../utils';
import { Loader } from './index';
import {
  getLyricsLineText,
  isMetaLine,
  LyricsLine,
  SongDetectState,
} from '../types';

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

  if (lyricLines.length === 0) {
    return (
      <div className="lyrics-viewer">
        <LyricLine line="(Empty)" />
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
  return <span className={clazz}>{getLyricsLineText(line)}</span>;
};
