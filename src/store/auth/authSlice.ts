import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const SLICE_NAME = "auth";

export type UserState = {
  avatar?: string;
  userName?: string;
  email?: string;
  username?: string;
  authority?: string[];
  token: string | null;
  persist: boolean;
  theme?: string;
  sidebarOpen?: boolean;
};

const initialState: UserState = {
  avatar: "",
  userName: "",
  username: "",
  email: "",
  authority: [],
  token: null,
  persist: false,
  theme: "dark",
  sidebarOpen: true,
};

const userSlice = createSlice({
  name: `${SLICE_NAME}`,
  initialState,
  reducers: {
    signInSuccess(state, action: any) {
      state.token = action?.payload?.accessToken;
      state.userName = action?.payload?.firstName;
      state.avatar = action?.payload?.image;
      state.email = action?.payload?.email;
    },
    signOutSuccess(state, action) {
      const { avatar, userName, email, token } = action.payload;
      state.userName = userName;
      state.avatar = avatar;
      state.email = email;
      state.token = token;
    },
    setPersist: (state, action) => {
      state.persist = action.payload;
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
  },
});

export const {
  setPersist,
  signInSuccess,
  signOutSuccess,
  setTheme,
  setSidebarOpen,
} = userSlice.actions;
export default userSlice.reducer;
