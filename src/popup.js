import { h, render, Component } from 'preact';
/** @jsx h */

import {SongHeader, Toolbar, LyricsViewer} from './components';

import {withSpotify} from 'spotify/withSpotify';
import {withLyrics} from './lyricsProvider';
import {createGoogleSearchUrl} from './lyricsProvider/_utils';
import {getYoutubeTitle} from './youtube';

// TODO finalize spotify

// TODO design
//        | layout
//        | font
//        | logos
//        | icon
//        - indicate YT mode - change album art
//        - refresh button
//        - small titles as tooltips
//        - per-provider urls

// TODO create @withEnv that has browser object and debug flag
// TODO song progress on left
// TODO show errors (error handling)
// TODO verify all names - package.json, manifest etc.


@withSpotify
@withLyrics
class Popup extends Component {

  state = {
    isYouTubeMode: false,
    currentProvider: 'genius', // current lyrics provider
    youtubeSong: {
      title: undefined, // no need for more info
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


    /*
    const {spotifySong} = this.state;
    this.refreshLyrics('spotifySong', spotifySong);

    this.updateYoutube();
    */
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

  refreshLyrics (stateKey, song) {
    const {getLyrics} = this.props;

    this.setState({
      [stateKey]: {
        ...song,
        // loading: true,
      }
    });

    const cb = this.onLyricsDownloaded(stateKey);
    getLyrics(song, cb);
  }

  onLyricsDownloaded = stateKey => (provider, result) => {
    this.setState(state => {
      const prevState = state[stateKey];
      const newLyrics = [
        ...prevState.lyricsResults,
        { name: provider, ...result },
      ];
      const finishedAsFirst = prevState.lyricsResults.length === 0;

      return {
        currentProvider: finishedAsFirst ? provider : state.currentProvider,
        [stateKey]: {
          ...prevState,
          // loading: false,
          lyricsResults: newLyrics,
        }
      };
    });
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
    const {isYouTubeMode, currentProvider} = this.state;
    const {lyricsProviders} = this.props;
    const song = this.getCurrentSong();

    const mergeSongState = provider => ({
      ...provider,
      perSong: this.getCurrentLyrics(provider),
    });

    return {
      googleUrl: createGoogleSearchUrl([
        song.artist, song.title, 'lyrics'
      ]),
      ytSettings: {
        onClick: this.onSwitchYouTubeMode,
        isVisible: true, // !!youtubeSong.title}
        active: isYouTubeMode,
      },
      currentProvider,
      onProviderSwitch: this.onProviderSwitch,
      providers: lyricsProviders.map(mergeSongState),
    };
  }

  render() {
    const {spotifySong, youtubeSong, currentProvider} = this.state;


    return (
      <div>
        <Toolbar {...this.createToolbarProps()} />
        <SongHeader {...spotifySong} />
        <LyricsViewer lyrics={this.getCurrentLyrics(currentProvider)} />
      </div>
    );
  }
}

render(<Popup/>, document.getElementById('app'));
