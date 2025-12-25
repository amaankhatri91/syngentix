import { apiCreateWorkflow, apiEditWorkflow } from "@/services/WorkflowService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const SLICE_NAME = "workflow";

export type WorkflowState = {
  workflowDialog: boolean;
  workflowRow: any;
};

const initialState: WorkflowState = {
  workflowDialog: false,
  workflowRow: {},
};

export const createWorkflow = createAsyncThunk(
  `${SLICE_NAME}/createWorkflow`,
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await apiCreateWorkflow(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data || { message: "Unknown error" }
      );
    }
  }
);

export const editWorkflow = createAsyncThunk(
  `${SLICE_NAME}/editWorkflow`,
  async (data: { id: string; title: string; description: string }, { rejectWithValue }) => {
    try {
      const response = await apiEditWorkflow(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data || { message: "Unknown error" }
      );
    }
  }
);

const workflowSlice = createSlice({
  name: `${SLICE_NAME}`,
  initialState,
  reducers: {
    setWorkflowDialog: (state, action) => {
      const { workflowDialog, workflowRow } = action.payload;
      state.workflowDialog = workflowDialog;
      state.workflowRow = workflowRow;
    },
  },
});

export const { setWorkflowDialog } = workflowSlice.actions;
export default workflowSlice.reducer;

