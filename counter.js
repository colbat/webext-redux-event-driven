import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  value: 0,
};

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    countIncremented(state) {
      state.value += 1;
    },
    countDecremented(state, action) {
      state.value -= 1;
    },
  },
});

export const { countIncremented, countDecremented } = counterSlice.actions;
export default counterSlice.reducer;
