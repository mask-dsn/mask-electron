// @flow
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import board from './board';

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    board
  });
}
