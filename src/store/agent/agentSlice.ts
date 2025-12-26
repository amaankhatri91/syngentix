import { apiCreateAgent, apiEditAgent } from "@/services/AgentService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/store";

const SLICE_NAME = "agent";

export type AgentState = {
  agentDailog: boolean;
  agentRow: any;
  activeTab: string | number;
};

const initialState: AgentState = {
  agentDailog: false,
  agentRow: {},
  activeTab: "workflows", // Default to workflows tab
};

export const createAgent = createAsyncThunk(
  `${SLICE_NAME}/createAgent`,
  async (data: any, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const workspaceId = state.auth.workspace?.id;
      
      if (!workspaceId) {
        return rejectWithValue({ message: "Workspace ID is required" });
      }
      
      const response = await apiCreateAgent(data, workspaceId);
      return response?.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data || { message: "Unknown error" }
      );
    }
  }
);

export const editAgent = createAsyncThunk(
  `${SLICE_NAME}/editAgent`,
  async (data: any, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const workspaceId = state.auth.workspace?.id;
      
      if (!workspaceId) {
        return rejectWithValue({ message: "Workspace ID is required" });
      }
      
      const response = await apiEditAgent({
        ...data,
        workspaceId,
      });
      return response?.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data || { message: "Unknown error" }
      );
    }
  }
);

const agentSlice = createSlice({
  name: `${SLICE_NAME}`,
  initialState,
  reducers: {
    setAgentDailog: (state, action) => {
      const { agentDailog, agentRow } = action.payload;
      state.agentDailog = agentDailog;
      state.agentRow = agentRow;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
  },
});

export const { setAgentDailog, setActiveTab } = agentSlice.actions;
export default agentSlice.reducer;
