import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserType } from "../utils/type";

const initialState: InitialStateType = {
  user: undefined
};

const URL = 'http://ec2-13-201-7-91.ap-south-1.compute.amazonaws.com:8000/api'

export const asyncLogin = createAsyncThunk(
  "auth/asyncLogin",
  async () => {
    const res = await fetch(`${URL}/auth/success`, {credentials: 'include'});
    const data = await res.json();
    if (res.ok) {
      return data;
    }
  }
);

export const asyncLogout = createAsyncThunk(
  "auth/asyncLogout",
  async () => {
    const res = await fetch(`${URL}/auth/logout`, {credentials: 'include'});
    const data = await res.json();
    return undefined
  }
);

export const AuthSlice = createSlice({
  name: 'auth',
  initialState, // your initial state object
  reducers: {
    setUser: (state: InitialStateType, action: PayloadAction<UserType>) => {
      // Update state based on action.payload (user data)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(asyncLogin.fulfilled, (state, action) => {
        state.user = action.payload; // Update user state with payload from fulfilled asyncLogin
      })
      .addCase(asyncLogout.fulfilled, (state, action) => {
        state.user = action.payload; // Update user state with payload from fulfilled asyncLogout (likely null or undefined)
      });
  },
});

export const { setUser } = AuthSlice.actions;

export default AuthSlice.reducer;

interface InitialStateType {
    user: UserType | undefined
}