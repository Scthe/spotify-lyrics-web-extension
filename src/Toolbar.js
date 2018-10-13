import { h, Component } from 'preact';
/** @jsx h */

// TODO go to settings

// NOTE: YT means YouTube
// NOTE: mx means musixmatch

export default class Toolbar extends Component {

  openTab = url => {
    browser.tabs.create({
      url,
    });
  }

  createBtn (text, url, className) {
    return !!url ? (
      <div class={`toolbar_btn ${className}`} onClick={() => this.openTab(url)}>
        {text}
      </div>
    ) : null;
  }

  render ({canYT, onYT, geniusUrl, mxUrl, googleUrl}) {
    return (
      <div class="toolbar clearfix">
        <div class="toolbar__left">
          {canYT && (
            <div class="toolbar_youtube" onClick={onYT}>
              YouTube mode
            </div>
          )}
        </div>
        <div class="toolbar__right">
          {this.createBtn('G', googleUrl, 'toolbar_g')}
          {this.createBtn('Genius', geniusUrl, 'toolbar_genius')}
          {this.createBtn('M', mxUrl, 'toolbar_mx')}
        </div>
      </div>
    );
  }

}