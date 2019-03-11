// @flow
import { REFRESH } from '../actions/board';
import type { Action } from './types';

export default function board(state: string = 'init', action: Action) {
  switch (action.type) {
    case REFRESH:
      return `${state}new`;
    default:
      return state;
  }
}
