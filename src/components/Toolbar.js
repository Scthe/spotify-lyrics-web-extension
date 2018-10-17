import { h, Component } from 'preact';
/** @jsx h */

// TODO 'go to settings' btn

// NOTE: YT means YouTube
// NOTE: mx means musixmatch

import {SvgIcon, ICON_GOOGLE_G, ICON_YOUTUBE} from './index';

const ToolbarBtn = ({logo, className, active, onClick}) => {
  const classes = [
    'toolbar_btn',
    className,
    active ? 'toolbar_active' : 'toolbar_inactive',
  ].join(' ');

  return (
    <SvgIcon svg={logo} className={classes} onClick={onClick} />
  );
};


export class Toolbar extends Component {

  openTab = url => {
    browser.tabs.create({
      url,
    });
  }

  renderProviderBtn = provider => {
    const {currentProvider, onProviderSwitch} = this.props;
    const isActive = provider.name === currentProvider;

    const onClick = () => {
      if (isActive) {
        this.openTab('www.example.com');
      } else {
        onProviderSwitch(provider.name);
      }
    };

    return (
      <ToolbarBtn
        logo={provider.logo}
        className={`toolbar_${provider.name}`}
        active={isActive}
        onClick={onClick}
      />
    );
  };

  renderYouTubeBtn () {
    const {onClick, isVisible, active} = this.props.ytSettings;

    return isVisible ? (
      <ToolbarBtn
        logo={ICON_YOUTUBE}
        className='toolbar_youtube'
        active={active}
        onClick={onClick}
      />
    ) : null;
  }

  onGoogleClick = () => {
    const {googleUrl} = this.props;
    this.openTab(googleUrl);
  };

  render ({providers}) {
    return (
      <div class="toolbar clearfix">
        <div class="toolbar__left">
          {this.renderYouTubeBtn()}
        </div>
        <div class="toolbar__right">
          <ToolbarBtn
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