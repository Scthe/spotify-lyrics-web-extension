import { h, render, Component } from 'preact';
/** @jsx h */

import SongHeader from './SongHeader';
import Toolbar from './Toolbar';

import {withSpotify} from 'spotify/withSpotify';
import {withLyrics} from './lyricsProvider';
import {getYoutubeTitle} from './youtube';

// TODO finalize spotify

// TODO design
//        - layout
//        - font
//        - themes
//        - logos
//        - indicate YT mode
//        - refresh btn

// TODO create @withEnv that has browser object and debug flag
// TODO song progress on left
// TODO show errors (error handling)
// TODO verify all names - package.json, manifest etc.


@withSpotify
@withLyrics
class Popup extends Component {

  state = {
    // error: undefined,
    loading: false,
    isYouTubeMode: false,

    youtubeSong: {
      title: undefined, // no need for more info
      lyrics: [],
      loading: true,
    },
    spotifySong: {
      artist: 'Salvatore ganacci',
      title: 'talk',
      albumArt: 'https://i.scdn.co/image/d49268a8fc0768084f4750cf1647709e89a27172',
      lyrics: [],
      loading: true,
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

  refreshLyrics (stateKey, song) {
    const {getLyrics} = this.props;

    this.setState({
      [stateKey]: {
        ...song,
        loading: true,
      }
    });

    getLyrics(song, lyrics => {
      this.setState(state => ({
        [stateKey]: {
          ...state[stateKey],
          lyrics,
          loading: false,
        }
      }));
    });
  }

  /*refreshToken = () => {
    const refreshToken = "...";
    const resp = await getAccessToken(refreshToken, authOpts);
    console.log('Resp:', resp);
    const respData = await resp.json()
    console.log('respText: ', respData);
  }*/

  switchYouTubeMode = () => {
    // console.log('switchYouTubeMode, now: ', this.state.isYouTubeMode)
    this.setState(state => ({
      isYouTubeMode: !state.isYouTubeMode,
    }));
  }

  renderLyrics () {
    const {isYouTubeMode, spotifySong, youtubeSong} = this.state;

    const lyricResults = isYouTubeMode ? youtubeSong.lyrics : spotifySong.lyrics;
    if (lyricResults === null) {
      return "No lyrics found";
    }

    console.log(`render lyrics ${isYouTubeMode ? 'YT' : 'Spotify'}`, lyricResults);
    const lyrics = (lyricResults || []).find(e => e.isOk);

    if (lyrics === undefined) {
      return "Loading";
    }

    return (
      <div class="lyrics-container">
        {lyrics.lines.map(line => (
          <span class="lyrics-line">{line}</span>)
        )}
      </div>
    );
  }

  render() {
    const {spotifySong, youtubeSong} = this.state;
    const testUrl = "https://genius.com/Salvatore-ganacci-talk-lyrics";

    return (
      <div>
        <Toolbar
          canYT={!!youtubeSong.title}
          onYT={this.switchYouTubeMode}
          geniusUrl={testUrl}
          mxUrl={testUrl}
          googleUrl={testUrl}
        />
        <SongHeader {...spotifySong} />
        {this.renderLyrics()}
      </div>
    );
  }
}

render(<Popup/>, document.getElementById('app'));
