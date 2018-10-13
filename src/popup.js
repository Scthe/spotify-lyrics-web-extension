import { h, render, Component } from 'preact';
/** @jsx h */

import SongHeader from './SongHeader';
import Toolbar from './Toolbar';

import {withSpotify} from 'spotify/withSpotify';
import {searchGenius} from './lyricsProvider';
import {getYoutubeTitle} from './youtube';

// TODO better handle both async
// TODO finalize spotify
// TODO musixmatch

// TODO design
//        - layout
//        - font
//        - themes
//        - logos
//        - indicate YT mode

// TODO create @withEnv that has browser object and debug flag
// TODO hide secrets + keys
// TODO song progress on left
// TODO show errors (error handling)


@withSpotify
class Popup extends Component {

  state = {
    error: undefined,
    isYouTubeMode: false,
    youtubeSong: {
      title: undefined, // no need for more info
    },
    spotifySong: {
      artist: 'Salvatore ganacci',
      title: 'talk',
      albumArt: 'https://i.scdn.co/image/d49268a8fc0768084f4750cf1647709e89a27172',
      lyrics: undefined,
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
    
    this.updateYoutube();

    const lyrics = await searchGenius(this.state.spotifySong);
    this.setState(state => ({
      spotifySong: {
        ...state.spotifySong,
        lyrics,
      }
    }));
  }

  updateYoutube = async () => {
    const videoTitle = await getYoutubeTitle(browser);
    console.log(`Youtube song: '${videoTitle}'`);
    this.setState({ 
      youtubeSong: { title: videoTitle }, 
    });

    if (videoTitle) {
      const lyrics = await searchGenius({
        artist: '',
        title: videoTitle,
      });
      this.setState(
        this.updateLyrics('youtubeSong', lyrics)
      );
    }
  }

  updateLyrics = (stateKey, lyrics) => state => ({
    [stateKey]: {
      ...state[stateKey],
      lyrics,
    }
  });

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
    
    const lyrics = isYouTubeMode ? youtubeSong.lyrics : spotifySong.lyrics;
    // console.log(`render ${isYouTubeMode ? 'YT' : 'Spot'}`, this.state);

    if (!lyrics || lyrics.length === 0) {
      return "Loading";
    }
    return (
      <div class="lyrics-container">
        {lyrics.map(line => (
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
