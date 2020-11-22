import { createSlice } from '@reduxjs/toolkit';

export interface PosState {
  dump: string;
}

export const initialState: PosState = {
  dump: 'hello world',
};

const posSlice = createSlice({
  name: 'pos',
  initialState,
  reducers: {},
});

export const posReducer = posSlice.reducer;
