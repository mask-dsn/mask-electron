// @flow
import { REFRESH } from '../actions/board';
import type { Action } from './types';
import { Block, blockchain } from '../utils/blockchain'

export default function board(state: Block[] = [], action: Action) {
  switch (action.type) {
    case REFRESH:
      state = blockchain
      return state;
    default:
      return blockchain;
  }
}
