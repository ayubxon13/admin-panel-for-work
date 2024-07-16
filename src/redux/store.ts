import {configureStore} from "@reduxjs/toolkit";
import userSlice from "./user/index";
import toggleSlice from "./toggle";
export const store = () => {
  return configureStore({
    reducer: {
      userSlice,
      toggleSlice,
    },
  });
};

export type AppStore = ReturnType<typeof store>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
