import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const SLICE_NAME = "auth";

export type WorkspaceSettings = {
  input_guardrails: boolean;
  output_guardrails: boolean;
};

export type Workspace = {
  id: string;
  name: string;
  owner_id: string;
  settings: WorkspaceSettings;
  is_private: boolean;
  created_at: string;
  type: string;
  role: string;
};

export type UserState = {
  avatar?: string;
  userName?: string;
  email?: string;
  userId?: string;
  userType?: string;
  googleId?: string;
  agents?: string[];
  defaultWorkspaceId?: string | null;
  workspace?: Workspace;
  workspaces?: Workspace[];
  token: string | null;
  refreshToken?: string | null;
  persist: boolean;
  theme?: string;
  sidebarOpen?: boolean;
};

const initialState: UserState = {
  avatar: "",
  userName: "",
  email: "",
  userId: "",
  userType: "",
  googleId: "",
  agents: [],
  defaultWorkspaceId: null,
  workspace: undefined,
  workspaces: [],
  token: null,
  refreshToken: null,
  persist: false,
  theme: "dark",
  sidebarOpen: true,
};

const userSlice = createSlice({
  name: `${SLICE_NAME}`,
  initialState,
  reducers: {
    signInSuccess(
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken?: string;
        userName: string;
        email: string;
        avatar?: string;
        userId?: string;
        userType?: string;
        googleId?: string;
        agents?: string[];
        defaultWorkspaceId?: string | null;
        workspace?: Workspace;
        workspaces?: Workspace[];
      }>
    ) {
      state.token = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken ?? null;
      state.userName = action.payload.userName;
      state.email = action.payload.email;
      state.avatar = action.payload.avatar;
      state.userId = action.payload.userId;
      state.userType = action.payload.userType;
      state.googleId = action.payload.googleId;
      state.agents = action.payload.agents ?? [];
      state.defaultWorkspaceId = action.payload.defaultWorkspaceId ?? null;
      state.workspace = action.payload.workspace;
      state.workspaces = action.payload.workspaces ?? [];
    },
    signOutSuccess(state, action) {
      const { avatar, userName, email, token } = action.payload;
      state.userName = userName;
      state.avatar = avatar;
      state.email = email;
      state.token = token;
      state.refreshToken = null;
      state.userId = "";
      state.userType = "";
      state.googleId = "";
      state.agents = [];
      state.defaultWorkspaceId = null;
      state.workspace = undefined;
      state.workspaces = [];
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
