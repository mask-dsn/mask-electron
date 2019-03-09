// @flow
import type { GetState, Dispatch } from '../reducers/types';

export const REFRESH = 'REFRESH';

export function refresh() {
  return {
    type: REFRESH
  };
}
