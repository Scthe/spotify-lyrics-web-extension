import { h, Component } from 'preact';
/** @jsx h */

export const ICON_YOUTUBE    = require('images/brands/youtube.svg');
export const ICON_MUSIXMATCH = require('images/brands/musixmatch.svg');
export const ICON_GENIUS     = require('images/brands/genius.svg');
export const ICON_GOOGLE_G   = require('images/brands/google-g.svg');

export class SvgIcon extends Component {

  componentDidMount() {
    this.base.innerHTML = this.props.svg;
  }

  render ({className, onClick}) {
    return (
      <div
        class={`SvgIcon ${className || ''}`}
        onClick={onClick}
      />
    );
  }

}