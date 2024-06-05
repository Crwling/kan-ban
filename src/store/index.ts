import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";

import boardSlice from "./boardSlice";

const persistConfig = {
  key: "root",
  storage,
}

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

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
});


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store;