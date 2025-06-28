import { WithClassName } from '../types';

export const Loader = (p: WithClassName) => (
  <div className={`loader ${p.className || ''}`}>
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
  </div>
);
