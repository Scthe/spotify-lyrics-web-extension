import { describe, expect, test, vi } from 'vitest';
import genius, { parseGeniusPage } from './genius';
import { Song } from '../types';
import {
  __readLocalFileInsteadOfFetch,
  expectLyricsMatchSnapshot,
  listAllLyricsSnapshots,
  ProviderName,
  readSnapshotFile,
} from './_test_utils';
import { getUrlFromSearchResults } from './_utils';

vi.mock(import('./_utils'), async (importOriginal) => {
  const mod = await importOriginal(); // type is inferred
  return {
    ...mod,
    searchGoogle: vi.fn(),
    getUrlFromSearchResults: vi.fn(),
  };
});

const PROVIDER_NAME: ProviderName = 'genius';
const MOCK_SONG: Song = { title: 'mock-title', artist: 'mock-artist' };
const SNAPSHOTS = listAllLyricsSnapshots(PROVIDER_NAME);

describe(`lyricsProvider/${PROVIDER_NAME}`, () => {
  test('has snapshots', () => {
    expect(SNAPSHOTS.length).toBeGreaterThan(0);
  });

  test.each(SNAPSHOTS)('%s', async (snapshotFilename) => {
    const snapshot = readSnapshotFile(snapshotFilename, PROVIDER_NAME);

    vi.mocked(getUrlFromSearchResults).mockReturnValue(snapshot.url);
    const result = await genius.searchFn(MOCK_SONG);

    // console.log(result.lines);
    expectLyricsMatchSnapshot(result.lines, snapshot);
  });

  test.skip('local HTML file test', () => {
    const snapshot = readSnapshotFile(
      'Square Enix - Dragonsong.genius.txt',
      PROVIDER_NAME
    );
    const result = __readLocalFileInsteadOfFetch(
      '_test.genius.html',
      parseGeniusPage
    );

    expectLyricsMatchSnapshot(result.lines, snapshot);
  });
});
