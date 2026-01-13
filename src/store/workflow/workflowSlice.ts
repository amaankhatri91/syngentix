import {
  apiCreateWorkflow,
  apiEditWorkflow,
  apiDeleteWorkflow,
  apiUpdateWorkflowStatus,
  apiDuplicateWorkflow,
  apiUpdateWorkflowSettings,
} from "@/services/WorkflowService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/store";

const SLICE_NAME = "workflow";

export type WorkflowState = {
  workflowDialog: boolean;
  workflowRow: any;
  deleteDialog: boolean;
  deleteWorkflowRow: any;
  duplicateWorkflowDialog: boolean;
  duplicateWorkflowRow: any;
  isDeleting: boolean;
  isUpdatingStatus: boolean;
  updatingWorkflowId: string | null;
  search: string;
  status: boolean | undefined;
  sort_by: string;
  sort_order: "ASC" | "DESC";
  limit: number;
  page: number;
};

const initialState: WorkflowState = {
  workflowDialog: false,
  workflowRow: {},
  deleteDialog: false,
  deleteWorkflowRow: {},
  duplicateWorkflowDialog: false,
  duplicateWorkflowRow: {},
  isDeleting: false,
  isUpdatingStatus: false,
  updatingWorkflowId: null,
  search: "",
  status: undefined,
  sort_by: "updated_at",
  sort_order: "DESC",
  limit: 10,
  page: 1,
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
  async (
    data: { id: string; title: string; description: string },
    { rejectWithValue, getState }
  ) => {
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

export const updateWorkflowStatus = createAsyncThunk(
  `${SLICE_NAME}/updateWorkflowStatus`,
  async (
    data: { workflowId: string; status: boolean },
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState() as RootState;
      const workspaceId = state.auth.workspace?.id;

      if (!workspaceId) {
        return rejectWithValue({ message: "Workspace ID is required" });
      }

      const response = await apiUpdateWorkflowStatus(
        data.workflowId,
        data.status,
        workspaceId
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data || { message: "Unknown error" }
      );
    }
  }
);

export const duplicateWorkflow = createAsyncThunk(
  `${SLICE_NAME}/duplicateWorkflow`,
  async (
    data: {
      sourceAgentId: string;
      workflowId: string;
      targetAgentId: string;
      workflowTitle: string;
    },
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState() as RootState;
      const workspaceId = state.auth.workspace?.id;

      if (!workspaceId) {
        return rejectWithValue({ message: "Workspace ID is required" });
      }

      const response = await apiDuplicateWorkflow(
        data.sourceAgentId,
        data.workflowId,
        data.targetAgentId,
        data.workflowTitle,
        workspaceId
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data || { message: "Unknown error" }
      );
    }
  }
);

export const updateWorkflowSettings = createAsyncThunk(
  `${SLICE_NAME}/updateWorkflowSettings`,
  async (
    data: {
      workflowId: string;
      title: string;
      description: string;
      execution_timeout: number;
      retry_attempts: number;
      concurrency_limit: boolean;
    },
    { rejectWithValue, getState }
  ) => {
    try {
      const state = getState() as RootState;
      const workspaceId = state.auth.workspace?.id;
      if (!workspaceId) {
        return rejectWithValue({ message: "Workspace ID is required" });
      }
      const response = await apiUpdateWorkflowSettings(
        data.workflowId,
        {
          title: data.title,
          description: data.description,
          execution_timeout: data.execution_timeout,
          retry_attempts: data.retry_attempts,
          concurrency_limit: data.concurrency_limit,
        },
        workspaceId
      );
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
    setDuplicateWorkflowDialog: (state, action) => {
      const { duplicateWorkflowDialog, duplicateWorkflowRow } = action.payload;
      state.duplicateWorkflowDialog = duplicateWorkflowDialog;
      state.duplicateWorkflowRow = duplicateWorkflowRow || {};
    },
    setWorkflowLimit: (state, action) => {
      state.limit = action.payload;
      state.page = 1; // Reset to page 1 when limit changes
    },
    setWorkflowPage: (state, action) => {
      state.page = action.payload;
    },
    setWorkflowSearch: (state, action) => {
      state.search = action.payload;
      state.page = 1; // Reset to page 1 when search changes
    },
    setWorkflowStatus: (state, action) => {
      state.status = action.payload;
      state.page = 1; // Reset to page 1 when status changes
    },
    setWorkflowSort: (state, action) => {
      state.sort_by = action.payload.sort_by;
      state.sort_order = action.payload.sort_order;
      state.page = 1; // Reset to page 1 when sort changes
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
      })
      .addCase(updateWorkflowStatus.pending, (state, action) => {
        state.isUpdatingStatus = true;
        state.updatingWorkflowId = action.meta.arg.workflowId;
      })
      .addCase(updateWorkflowStatus.fulfilled, (state) => {
        state.isUpdatingStatus = false;
        state.updatingWorkflowId = null;
      })
      .addCase(updateWorkflowStatus.rejected, (state) => {
        state.isUpdatingStatus = false;
        state.updatingWorkflowId = null;
      });
  },
});

export const {
  setWorkflowDialog,
  setDeleteDialog,
  setDuplicateWorkflowDialog,
  setWorkflowSearch,
  setWorkflowStatus,
  setWorkflowSort,
  setWorkflowLimit,
  setWorkflowPage,
} = workflowSlice.actions;
export default workflowSlice.reducer;
