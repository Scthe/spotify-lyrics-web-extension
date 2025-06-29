import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { readdirSync, readFileSync } from 'fs';
import {
  getLyricsLineText,
  isMetaLine,
  LyricsLine,
  LyricsProvider,
} from '../types';
import { removeDuplicatedEmptyLines } from './_utils';
import { expect } from 'vitest';

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

const SNAPSHOT_DIR = '__snapshots__';
const SNAPSHOT_EXT = '.txt';
const VALID_PROVIDERS = ['genius', 'musixmatch'] as const;
export type ProviderName = ArrayElement<typeof VALID_PROVIDERS>;

// @ts-ignore
const __dirname = dirname(fileURLToPath(import.meta.url));
const snapshotsDir = join(__dirname, SNAPSHOT_DIR);

export const listAllLyricsSnapshots = (providerName: ProviderName) => {
  const snapshots = readdirSync(snapshotsDir);
  return snapshots.filter((filename) => {
    const filenameLC = filename.toLowerCase();
    if (!filenameLC.endsWith(SNAPSHOT_EXT)) return false;

    const isFileValid = VALID_PROVIDERS.some((providerName) =>
      filenameLC.includes(providerName)
    );
    if (!isFileValid) {
      throw new Error(`Invalid snapshot filename '${filename}'`);
    }

    return filenameLC.includes(providerName);
  });
};

interface SnapshotFile {
  url: string;
  lines: string[];
}

const tryParseUrlFromComment = (line: string) => {
  let lineLC = line.toLowerCase();
  const matchRes = Array.from(lineLC.matchAll(/^url\s*=(.+?)$/g), (e) => e[1]);
  return matchRes.length > 0 ? matchRes[0].trim() : undefined;
};

export const readSnapshotFile = (
  filename: string,
  providerName: ProviderName
): SnapshotFile => {
  const filepath = join(snapshotsDir, filename);
  const fileContent = readFileSync(filepath, 'utf-8');

  const rawLines = fileContent.split('\n');
  let lines: string[] = [];
  let url = '';

  rawLines.forEach((line) => {
    line = line.trim();
    let lineLC = line.toLowerCase();
    if (lineLC.startsWith('#')) {
      // comment
      lineLC = lineLC.substring(1).trim();
      url = tryParseUrlFromComment(lineLC) ?? url;
    } else {
      lines.push(line);
    }
  });
  lines = removeDuplicatedEmptyLines(lines);

  if (url.length === 0) throw new Error(`Snapshot '${filename}' has no url`);
  if (!url.toLowerCase().includes(providerName))
    throw new Error(
      `Snapshot '${filename}' url's '${url}' does not contain '${providerName}'`
    );
  if (lines.length === 0) throw new Error(`Snapshot '${filename}' has lines`);
  return { url, lines };
};

export const expectLyricsMatchSnapshot = (
  lines: LyricsLine[],
  snapshot: SnapshotFile
) => {
  let iteratorResult = 0;
  let iteratorSnapshot = 0;
  // console.log(lines);

  while (iteratorResult < lines.length) {
    const line = lines[iteratorResult];
    const snapshotLine = snapshot.lines[iteratorSnapshot];

    const _line = isMetaLine(line) ? `META::${getLyricsLineText(line)}` : line;
    expect(
      _line,
      `Snapshot mismatch on snapshot line ${iteratorSnapshot}. See ${snapshot.url}`
    ).toBe(snapshotLine);

    ++iteratorResult;
    ++iteratorSnapshot;
  }

  // length check here, cause worse error message than just line compare
  expect(lines.length).toBe(snapshot.lines.length);
};

/**
 * Read local .html file, so we do not hammer external APIs with requests.
 *
 * USE ONLY DURING LOCAL DEVELOPMENT!
 */
export const __readLocalFileInsteadOfFetch = (
  filename: string,
  parser: (s: string) => LyricsLine[]
): Awaited<ReturnType<LyricsProvider['searchFn']>> => {
  const filepath = join(snapshotsDir, filename);
  const fileContent = readFileSync(filepath, 'utf-8');
  const lines = parser(fileContent);
  return { url: `local-file '${filename}'`, lines };
};
