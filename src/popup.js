import { h, render, Component } from 'preact';
/** @jsx h */

import {SongHeader, Toolbar, LyricsViewer} from './components';

import {withSpotify} from 'spotify/withSpotify';
import {withLyrics} from './lyricsProvider';
import {createGoogleSearchUrl} from './lyricsProvider/_utils';
import {getYoutubeTitle} from './youtube';


// TODO create @withEnv that has browser object and debug flag
//      OR use polyfill (https://github.com/mozilla/webextension-polyfill)
// TODO verify all names - package.json, manifest etc.

const SONG_SOURCE = {
  SPOTIFY: 0,
  YOUTUBE: 1,
};
const oppositeSource = songSource =>
  songSource === SONG_SOURCE.SPOTIFY ? SONG_SOURCE.YOUTUBE : SONG_SOURCE.SPOTIFY;


const createSongOk = (source, {title, artist, albumArt}) => ({
  source, title, artist, albumArt,
});
const createSongErr = (source, error) => ({source, error});

const createLyricsOk = (source, {lines, url, providerName}) => ({
  source, lines, url, providerName,
});
const createLyricsErr = (source, error) => ({source, error});



@withSpotify
@withLyrics
class Popup extends Component {

  state = {
    songSource: SONG_SOURCE.SPOTIFY,
    currentProvider: 'genius', // current lyrics provider
    songs: [],
    lyrics: [],
  };

  async componentDidMount() {
    this.updateSpotify();
    this.updateYoutube();
  }

  addSong (song) {
    this.setState(state => ({
      songs: [...state.songs, song],
    }));
  }

  updateSpotify = async () => {
    const {spotify} = this.props;
    const {result, error} = await spotify.getCurrentSong();
    console.log('[spotify] song:', {result, error});

    if (error) {
      this.addSong(createSongErr(SONG_SOURCE.SPOTIFY, error));

    } else {
      const {name, artists, album} = result.item;
      const song = createSongOk(SONG_SOURCE.SPOTIFY, {
        title: name,
        artist: artists[0].name,
        albumArt: album.images[album.images.length - 1].url,
      });
      this.addSong(song);
      this.refreshLyrics(song);
    }
  }

  updateYoutube = async () => {
    const videoTitle = await getYoutubeTitle(browser);
    if (!videoTitle) {
      console.log(`[youtube] not youtube tab, skip!`);
      return;
    }

    console.log(`[youtube] song: '${videoTitle}'`);
    const song = createSongOk(SONG_SOURCE.YOUTUBE, {
      title: videoTitle,
      artist: '',
      albumArt: null,
    });
    this.addSong(song);
    this.refreshLyrics(song);
  }

  refreshLyrics (song) {
    const {getLyrics} = this.props;

    getLyrics(song, (providerName, lyricsResult) => {
      console.log(`[${providerName}] lyrics downloaded: `, lyricsResult);
      const {error, result} = lyricsResult;

      let lyrics;
      if (error) {
        lyrics = createLyricsErr(song.source, error);
      } else {
        lyrics = createLyricsOk(song.source, {...result, providerName});
      }

      this.setState(state => ({
        lyrics: [...state.lyrics, lyrics],
      }));
    });
  }

  isYouTubeMode () {
    const {songSource} = this.state;
    return songSource === SONG_SOURCE.YOUTUBE;
  }

  isBrowserOnYouTubePage () {
    const {songs} = this.state;
    return songs.find(s => s.source === SONG_SOURCE.YOUTUBE);
  }

  onSwitchYouTubeMode = () => {
    this.setState(state => ({
      songSource: oppositeSource(state.songSource),
    }));
  }

  onProviderSwitch = provider => {
    this.setState({
      currentProvider: provider,
    });
  }

  getCurrentSong () {
    const {songSource, songs} = this.state;
    return songs.find(s => s.source === songSource);
  }

  getCurrentLyrics (provider = this.state.currentProvider) {
    const {songSource, lyrics} = this.state;
    return lyrics.find(l => l.source === songSource && l.providerName === provider);
  }

  getProviderUrl (provider) {
    const lyrics = this.getCurrentLyrics(provider.name);
    return lyrics ? lyrics.url : null;
  }

  createToolbarProps () {
    const {currentProvider} = this.state;
    const {lyricsProviders} = this.props;
    const song = this.getCurrentSong();

    return {
      googleUrl: song ? createGoogleSearchUrl([
        song.artist, song.title, 'lyrics'
      ]) : null,
      ytSettings: {
        onClick: this.onSwitchYouTubeMode,
        canSwitchToYouTube: this.isBrowserOnYouTubePage(),
        active: this.isYouTubeMode(),
      },
      currentProvider,
      onProviderSwitch: this.onProviderSwitch,
      providers: lyricsProviders.map(lp => ({
        ...lp, url: this.getProviderUrl(lp),
      })),
    };
  }

  render() {
    const song = this.getCurrentSong();
    const lyrics = this.getCurrentLyrics();

    return (
      <div>
        <Toolbar {...this.createToolbarProps()} />
        <SongHeader
          song={song}
          isYouTubeMode={this.isYouTubeMode()}
        />
        <LyricsViewer lyrics={lyrics} />
      </div>
    );
  }
}

render(<Popup/>, document.getElementById('app'));
