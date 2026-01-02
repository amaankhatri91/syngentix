import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Node, Edge, ReactFlowInstance } from "reactflow";
import { CustomNodeData } from "@/views/WorkflowEditor/dymmyData";

const SLICE_NAME = "workflowEditor";

export type WorkflowEditorState = {
  openNodeList: boolean;
  searchQuery: string;
  expandedCategories: string[];
};

const initialState: WorkflowEditorState = {
  openNodeList: false,
  searchQuery: "",
  expandedCategories: [],
};

const workflowEditorSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    setOpenNodeList: (state, action) => {
      state.openNodeList = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setExpandedCategories: (state, action: PayloadAction<string[]>) => {
      state.expandedCategories = action.payload;
    },
    toggleCategory: (state, action: PayloadAction<string>) => {
      const categoryName = action.payload;
      const index = state.expandedCategories.indexOf(categoryName);
      if (index > -1) {
        state.expandedCategories.splice(index, 1);
      } else {
        state.expandedCategories.push(categoryName);
      }
    },
  },
});

export const {
  setOpenNodeList,
  setSearchQuery,
  setExpandedCategories,
  toggleCategory,
} = workflowEditorSlice.actions;

export default workflowEditorSlice.reducer;
