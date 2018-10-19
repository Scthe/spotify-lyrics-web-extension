import { h, render, Component } from 'preact';
/** @jsx h */

import {SongHeader, Toolbar, LyricsViewer} from './components';

import {withSpotify} from 'spotify/withSpotify';
import {withLyrics} from './lyricsProvider';
import {createGoogleSearchUrl} from './lyricsProvider/_utils';
import {getYoutubeTitle} from './youtube';


// TODO finalize spotify
// TODO create @withEnv that has browser object and debug flag (or use polyfill)
// TODO verify all names - package.json, manifest etc.

// TODO ? song progress on left


const updateConditionaly = (baseObj, cond, extObj) => {
  extObj = cond ? cond : {};
  return { ...baseObj, ...extObj };
};

@withSpotify
@withLyrics
class Popup extends Component {

  state = {
    isYouTubeMode: false,
    currentProvider: 'genius', // current lyrics provider
    youtubeSong: {
      artist: '', // will never change
      title: undefined, // no need for more info
      albumArt: null, // show youtube logo instead
      lyricsResults: [],
    },
    spotifySong: {
      artist: 'Salvatore ganacci',
      title: 'talk',
      albumArt: 'https://i.scdn.co/image/d49268a8fc0768084f4750cf1647709e89a27172',
      lyricsResults: [],
    }
  };

  async componentDidMount() {
    /*
    const {spotify} = this.props;
    const song = await spotify.getCurrentSong();
    // console.log(song);
    const title = song.item.name;
    const author = song.item.artists[0].name;
    console.log(`${author}:${title}`);
    */


    const {spotifySong} = this.state;
    this.refreshLyrics('spotifySong', spotifySong);

    this.updateYoutube();
  }

  updateYoutube = async () => {
    const videoTitle = await getYoutubeTitle(browser);
    console.log(`Youtube song: '${videoTitle}'`);

    if (videoTitle) {
      this.refreshLyrics('youtubeSong', {
        artist: '',
        title: videoTitle,
      });
    }
  }

  static createLyricsState = songBase => provider => ({
    name: provider.name,
    url: provider.createSearchUrl(songBase),
    lines: undefined,
    error: undefined,
  });

  refreshLyrics (stateKey, songBase) {
    const {getLyrics, lyricsProviders} = this.props;

    this.setState({
      [stateKey]: {
        ...songBase,
        lyricsResults: lyricsProviders.map(Popup.createLyricsState(songBase)),
      }
    });

    const cb = this.onLyricsDownloaded(stateKey);
    getLyrics(songBase, cb);
  }

  onLyricsDownloaded = stateKey => (providerName, result) => {
    const updateState = state => {
      const prevSong = state[stateKey];
      const finishedAsFirst = prevSong.lyricsResults.length === 0;

      const newSong = {
        ...prevSong,
        lyricsResults: prevSong.lyricsResults.map(p =>
          updateConditionaly(p, p.name === providerName, result)
        ),
      };
      // console.log(`new song for [${providerName}]`, newSong);

      return {
        currentProvider: finishedAsFirst ? providerName : state.currentProvider,
        [stateKey]: newSong,
      };
    };
    this.setState(updateState);
  };

  /*refreshToken = () => {
    const refreshToken = "...";
    const resp = await getAccessToken(refreshToken, authOpts);
    console.log('Resp:', resp);
    const respData = await resp.json()
    console.log('respText: ', respData);
  }*/

  onSwitchYouTubeMode = () => {
    this.setState(state => ({
      isYouTubeMode: !state.isYouTubeMode,
    }));
  }

  onProviderSwitch = provider => {
    this.setState({
      currentProvider: provider,
    });
  }

  getCurrentSong () {
    const {isYouTubeMode, spotifySong, youtubeSong} = this.state;
    return isYouTubeMode ? youtubeSong : spotifySong;
  }

  getCurrentLyrics (providerName) {
    const song = this.getCurrentSong();
    return song.lyricsResults.find(e => e.name === providerName);
  }

  createToolbarProps () {
    const {isYouTubeMode, youtubeSong, currentProvider} = this.state;
    const {lyricsProviders} = this.props;
    const song = this.getCurrentSong();

    const mergeSongState = provider => ({
      ...provider,
      ...this.getCurrentLyrics(provider.name),
    });

    return {
      googleUrl: createGoogleSearchUrl([
        song.artist, song.title, 'lyrics'
      ]),
      ytSettings: {
        onClick: this.onSwitchYouTubeMode,
        isVisible: !!youtubeSong.title,
        active: isYouTubeMode,
      },
      currentProvider,
      onProviderSwitch: this.onProviderSwitch,
      providers: lyricsProviders.map(mergeSongState),
    };
  }

  render() {
    const {currentProvider, isYouTubeMode} = this.state;
    const song = this.getCurrentSong();

    return (
      <div>
        <Toolbar {...this.createToolbarProps()} />
        <SongHeader
          artist={song.artist}
          title={song.title}
          albumArt={song.albumArt}
          hasAnyResults={song.lyricsResults.length > 0}
          isYouTubeMode={isYouTubeMode}
        />
        <LyricsViewer lyrics={this.getCurrentLyrics(currentProvider)} />
      </div>
    );
  }
}

render(<Popup/>, document.getElementById('app'));
