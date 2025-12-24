import { createSlice } from "@reduxjs/toolkit";

const SLICE_NAME = "agent";

export type AgentState = {
  agentDailog: boolean;
  agentRow: any;
};

const initialState: AgentState = {
  agentDailog: false,
  agentRow: {},
};

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
