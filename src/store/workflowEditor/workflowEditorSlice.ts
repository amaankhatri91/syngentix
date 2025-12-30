import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Node, Edge, ReactFlowInstance } from "reactflow";
import { CustomNodeData } from "@/views/WorkflowEditor/dymmyData";

const SLICE_NAME = "workflowEditor";

export type WorkflowEditorState = {
  openNodeList: boolean;
};

const initialState: WorkflowEditorState = {
  openNodeList: false,
};

const workflowEditorSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    setOpenNodeList: (state, action) => {
      state.openNodeList = action.payload;
    },
  },
});

export const {} = workflowEditorSlice.actions;

export default workflowEditorSlice.reducer;

