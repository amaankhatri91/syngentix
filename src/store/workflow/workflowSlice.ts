import { apiCreateWorkflow, apiEditWorkflow, apiDeleteWorkflow } from "@/services/WorkflowService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/store";

const SLICE_NAME = "workflow";

export type WorkflowState = {
  workflowDialog: boolean;
  workflowRow: any;
  deleteDialog: boolean;
  deleteWorkflowRow: any;
  isDeleting: boolean;
};

const initialState: WorkflowState = {
  workflowDialog: false,
  workflowRow: {},
  deleteDialog: false,
  deleteWorkflowRow: {},
  isDeleting: false,
};

export const createWorkflow = createAsyncThunk(
  `${SLICE_NAME}/createWorkflow`,
  async (data: any, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const workspaceId = state.auth.workspace?.id;
      
      if (!workspaceId) {
        return rejectWithValue({ message: "Workspace ID is required" });
      }
      
      const response = await apiCreateWorkflow(data, workspaceId);
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
  async (data: { id: string; title: string; description: string }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const workspaceId = state.auth.workspace?.id;
      
      if (!workspaceId) {
        return rejectWithValue({ message: "Workspace ID is required" });
      }
      
      const response = await apiEditWorkflow(data, workspaceId);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data || { message: "Unknown error" }
      );
    }
  }
);

export const deleteWorkflow = createAsyncThunk(
  `${SLICE_NAME}/deleteWorkflow`,
  async (workflowId: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const workspaceId = state.auth.workspace?.id;
      
      if (!workspaceId) {
        return rejectWithValue({ message: "Workspace ID is required" });
      }
      
      const response = await apiDeleteWorkflow(workflowId, workspaceId);
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
    setDeleteDialog: (state, action) => {
      const { deleteDialog, deleteWorkflowRow } = action.payload;
      state.deleteDialog = deleteDialog;
      state.deleteWorkflowRow = deleteWorkflowRow || {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteWorkflow.pending, (state) => {
        state.isDeleting = true;
      })
      .addCase(deleteWorkflow.fulfilled, (state) => {
        state.isDeleting = false;
        state.deleteDialog = false;
        state.deleteWorkflowRow = {};
      })
      .addCase(deleteWorkflow.rejected, (state) => {
        state.isDeleting = false;
      });
  },
});

export const { setWorkflowDialog, setDeleteDialog } = workflowSlice.actions;
export default workflowSlice.reducer;

