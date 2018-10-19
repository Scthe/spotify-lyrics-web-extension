import { h, Component } from 'preact';
/** @jsx h */

export class Loader extends Component {

  render ({className}) {
    return (
      <div class={`loader ${className || ''}`}>
        <div/><div/><div/>
        <div/><div/><div/>
        <div/><div/><div/>
      </div>
    );
  }

}