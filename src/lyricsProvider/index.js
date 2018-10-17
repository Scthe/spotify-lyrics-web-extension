// I could use APIs like a normal human being.
 //
 // ...
 //
 // ...
 //
 // Or, I can make use of the fact that browser extensions can bypass CORS.
 //
 // ...
 //
 // thonk..


import { h, Component } from 'preact';
/** @jsx h */
import genius from './genius';
import musixmatch from './musixmatch';


// NOTE: interface Song { title: string; artist: string};


export const withLyrics = ComposedComponent => {

  return class WithLyricsDecoratorWrapper extends Component {

    constructor (props) {
      super(props);

      this.providers = [
        genius,
        musixmatch,
      ];
    }

    getLyrics = (song, cb) => {
      this.providers.map(async provider => {
        const res = await this.executeLyricsProvider(provider, song);
        cb(provider.name, res);
      });
    };

    executeLyricsProvider = async (provider, song) => {
      const result = { isOk: false, };
      try {
        result.lines = await provider.searchFn(song);
        result.isOk = true;
      } catch (err) {
        result.error = err;
        result.isOk = false;
      }

      return result;
    }

    render() {
      return (
        <ComposedComponent
          getLyrics={this.getLyrics}
          lyricsProviders={this.providers}
          {...this.props}
        />
      );
    }
  }

};
