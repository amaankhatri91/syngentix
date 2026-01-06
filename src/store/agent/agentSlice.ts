import { apiCreateAgent, apiEditAgent, apiDeleteAgent } from "@/services/AgentService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/store";

const SLICE_NAME = "agent";

export type AgentState = {
  agentDailog: boolean;
  agentRow: any;
  activeTab: string | number;
  deleteDialog: boolean;
  deleteAgentRow: any;
  isDeleting: boolean;
};

const initialState: AgentState = {
  agentDailog: false,
  agentRow: {},
  activeTab: "workflows", // Default to workflows tab
  deleteDialog: false,
  deleteAgentRow: {},
  isDeleting: false,
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

export const deleteAgent = createAsyncThunk(
  `${SLICE_NAME}/deleteAgent`,
  async (agentId: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const workspaceId = state.auth.workspace?.id;
      
      if (!workspaceId) {
        return rejectWithValue({ message: "Workspace ID is required" });
      }
      
      const response = await apiDeleteAgent(agentId, workspaceId);
      return response;
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
    setDeleteDialog: (state, action) => {
      const { deleteDialog, deleteAgentRow } = action.payload;
      state.deleteDialog = deleteDialog;
      state.deleteAgentRow = deleteAgentRow || {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteAgent.pending, (state) => {
        state.isDeleting = true;
      })
      .addCase(deleteAgent.fulfilled, (state) => {
        state.isDeleting = false;
        state.deleteDialog = false;
        state.deleteAgentRow = {};
      })
      .addCase(deleteAgent.rejected, (state) => {
        state.isDeleting = false;
      });
  },
});

export const { setAgentDailog, setActiveTab, setDeleteDialog } = agentSlice.actions;
export default agentSlice.reducer;
