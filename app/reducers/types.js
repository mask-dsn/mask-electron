import type { Dispatch as ReduxDispatch, Store as ReduxStore } from 'redux';

export type boardStateType = {
  +chain: string
};

export type Action = {
  +type: string
};

export type GetState = () => boardStateType;

export type Dispatch = ReduxDispatch<Action>;

export type Store = ReduxStore<GetState, Action>;
