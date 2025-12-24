import { createSlice } from "@reduxjs/toolkit";

const SLICE_NAME = "agent";

export type AgentState = {
  agentDailog: boolean;
};

const initialState: AgentState = {
  agentDailog: false,
};

const agentSlice = createSlice({
  name: `${SLICE_NAME}`,
  initialState,
  reducers: {
    setAgentDailog: (state, action) => {
      state.agentDailog = action.payload;
    },
  },
});

export const { setAgentDailog } = agentSlice.actions;
export default agentSlice.reducer;
