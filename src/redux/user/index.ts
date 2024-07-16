import {createSlice} from "@reduxjs/toolkit";
import {UserData} from "../../interface";

export const userSlice = createSlice({
  name: "userData",
  initialState: {
    userData: null as null | UserData,
  },
  reducers: {},
});

export const {} = userSlice.actions;
export default userSlice.reducer;
