import { combineReducers } from '@reduxjs/toolkit';
import { posReducer } from '../apps/pos/slice';

export const rootReducer = combineReducers({
  pos: posReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
