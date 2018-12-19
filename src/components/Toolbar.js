import { h, Component } from 'preact';
/** @jsx h */
const browser = require('webextension-polyfill');

// NOTE: YT means YouTube
// NOTE: mx means musixmatch

import {SvgIcon, ICON_GOOGLE_G, ICON_YOUTUBE} from './index';

const ToolbarBtn = ({logo, className, active, onClick, tooltip}) => {
  const classes = [
    'toolbar_btn',
    className,
    active ? 'toolbar_active' : 'toolbar_inactive',
  ].join(' ');

  return (
    <SvgIcon
      tooltip={tooltip}
      className={classes}
      svg={logo}
      onClick={onClick}
    />
  );
};


export class Toolbar extends Component {

  openTab = url => {
    // console.log(`open-tab '${url}'`);
    browser.tabs.create({
      url,
    });
  }

  renderProviderBtn = provider => {
    const {currentProvider, onProviderSwitch} = this.props;
    const isActive = provider.name === currentProvider;

    const onClick = () => {
      if (isActive) {
        if (provider.url) {
          this.openTab(provider.url);
        }
      } else {
        onProviderSwitch(provider.name);
      }
    };

    return (
      <ToolbarBtn
        tooltip={provider.name}
        logo={provider.logo}
        className={`toolbar_${provider.name}`}
        active={isActive}
        onClick={onClick}
      />
    );
  };

  renderYouTubeBtn () {
    const {onClick, canSwitchToYouTube, active} = this.props.ytSettings;

    return canSwitchToYouTube ? (
      <ToolbarBtn
        tooltip='Toggle YouTube mode'
        logo={ICON_YOUTUBE}
        className='toolbar_youtube'
        active={active}
        onClick={onClick}
      />
    ) : null;
  }

  onGoogleClick = () => {
    const {googleUrl} = this.props;
    if (googleUrl) {
      this.openTab(googleUrl);
    }
  };

  render ({providers}) {
    return (
      <div class="toolbar clearfix">
        <div class="toolbar__left">
          {this.renderYouTubeBtn()}
        </div>
        <div class="toolbar__right">
          <ToolbarBtn
            tooltip='Search Google for lyrics'
            logo={ICON_GOOGLE_G}
            className='toolbar_google'
            active={true}
            onClick={this.onGoogleClick}
          />
          {providers.map(this.renderProviderBtn)}
        </div>
      </div>
    );
  }

}