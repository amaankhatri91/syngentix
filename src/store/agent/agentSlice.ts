import { apiCreateAgent, apiEditAgent } from "@/services/AgentService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const SLICE_NAME = "agent";

export type AgentState = {
  agentDailog: boolean;
  agentRow: any;
};

const initialState: AgentState = {
  agentDailog: false,
  agentRow: {},
};

export const createAgent = createAsyncThunk(
  `${SLICE_NAME}/createAgent`,
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await apiCreateAgent(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data || { message: "Unknown error" }
      );
    }
  }
);

export const editAgent = createAsyncThunk(
  `${SLICE_NAME}/editAgent`,
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await apiEditAgent(data);
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
  },
});

export const { setAgentDailog } = agentSlice.actions;
export default agentSlice.reducer;
