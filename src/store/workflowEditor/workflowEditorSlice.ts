import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Node, Edge, ReactFlowInstance } from "reactflow";
import { CustomNodeData } from "@/views/WorkflowEditor/dymmyData";

const SLICE_NAME = "workflowEditor";

export type WorkflowEditorState = {
  openNodeList: boolean;
  searchQuery: string;
  expandedCategories: string[];
  nodes: Node<CustomNodeData>[];
  edges: Edge[];
  isLocked: boolean;
};

const initialState: WorkflowEditorState = {
  openNodeList: false,
  searchQuery: "",
  expandedCategories: [],
  nodes: [],
  edges: [],
  isLocked: false,
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
    setNodes: (state, action: PayloadAction<Node<CustomNodeData>[]>) => {
      state.nodes = action.payload;
    },
    addNode: (state, action: PayloadAction<Node<CustomNodeData>>) => {
      const nodeExists = state.nodes.some((node) => node.id === action.payload.id);
      if (nodeExists) {
        // Update existing node
        state.nodes = state.nodes.map((node) =>
          node.id === action.payload.id ? action.payload : node
        );
      } else {
        // Add new node
        state.nodes.push(action.payload);
      }
    },
    updateNodes: (state, action: PayloadAction<Node<CustomNodeData>[]>) => {
      state.nodes = action.payload;
    },
    setEdges: (state, action: PayloadAction<Edge[]>) => {
      state.edges = action.payload;
    },
    toggleLock: (state) => {
      state.isLocked = !state.isLocked;
    },
  },
});

export const {
  setOpenNodeList,
  setSearchQuery,
  setExpandedCategories,
  toggleCategory,
  setNodes,
  addNode,
  updateNodes,
  setEdges,
  toggleLock,
} = workflowEditorSlice.actions;

export default workflowEditorSlice.reducer;
