import { combineReducers, configureStore } from "@reduxjs/toolkit";

import boardSlice from "./boardSlice";

const combinedReducer = combineReducers({
    boards: boardSlice.reducer,
});

// can be used to set global actions
const rootReducer = (state: any, action: any) => {
  if (action.type === "RESET") {
    state = {};
  }
  return combinedReducer(state, action);
};

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export default store;