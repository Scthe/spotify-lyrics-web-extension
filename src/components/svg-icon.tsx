import { Component } from 'preact';
import { WithClassName } from '../types';

export const ICON_YOUTUBE = require('../assets/youtube.svg');
export const ICON_MUSIXMATCH = require('../assets/musixmatch.svg');
export const ICON_GENIUS = require('../assets/genius.svg');
export const ICON_GOOGLE_G = require('../assets/google-g.svg');

interface Props extends WithClassName {
  svg: string;
  tooltip?: string;
  onClick?: preact.JSX.MouseEventHandler<HTMLDivElement>;
}

export class SvgIcon extends Component<Props> {
  componentDidMount() {
    // this.base is to a reference to the root DOM element of your current Component
    if (this.base && 'innerHTML' in this.base) {
      this.base.innerHTML = this.props.svg;
    } else {
      console.error('Could not inject icon SVG into element');
    }
  }

  render() {
    const { className, onClick, tooltip } = this.props;
    return (
      <div
        className={`SvgIcon ${className || ''}`}
        onClick={onClick}
        title={tooltip}
      />
    );
  }
}
