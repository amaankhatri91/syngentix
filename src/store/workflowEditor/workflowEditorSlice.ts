import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Node, Edge, ReactFlowInstance } from "reactflow";
import { CustomNodeData } from "@/views/WorkflowEditor/type";

const SLICE_NAME = "workflowEditor";

/**
 * History action types for undo/redo system
 * Each action type corresponds to a socket event
 */
export type HistoryActionType =
  | "NODE_CREATE"
  | "NODE_UPDATE"
  | "NODE_DELETE"
  | "NODE_DELETE_BULK"
  | "NOTE_CREATE"
  | "NOTE_UPDATE"
  | "NOTE_DELETE"
  | "PIN_ADD"
  | "PIN_UPDATE"
  | "PIN_DELETE"
  | "CONNECTION_CREATE"
  | "CONNECTION_DELETE";

/**
 * History entry structure using Command Pattern
 * Stores atomic actions with inverse operations for undo/redo
 */
export interface HistoryEntry {
  actionType: HistoryActionType;
  payload: any; // Data needed to redo the action
  inversePayload: any; // Data needed to undo the action
}

export interface ClipboardData {
  nodes: Node<CustomNodeData>[];
  edges: Edge[];
  copyType: "copy" | "cut";
  includeConnections: boolean;
}

export type WorkflowEditorState = {
  openNodeList: boolean;
  openSettings: boolean;
  searchQuery: string;
  expandedCategories: string[];
  nodes: Node<CustomNodeData>[];
  edges: Edge[];
  isLocked: boolean;
  edgeThickness: number;
  editingNotes: Record<string, boolean>; // Map of node ID to editing state
  resizingNotes: Record<string, boolean>; // Map of node ID to resizing state
  databaseDialogOpen: boolean;
  selectedNode: any | null; // Store the filtered node object
  selectedNodeId?: string;
  nodeList?: null | any;
  minimapVisible: boolean;
  undoStack: HistoryEntry[]; // Stack of actions that can be undone
  redoStack: HistoryEntry[]; // Stack of actions that can be redone
  clipboard: ClipboardData | null; // Clipboard data for copy/cut/paste
  isPasteMode: boolean; // Whether paste mode is active (showing "Click on canvas to paste")
  notesVisible: boolean; // Whether sticky notes are visible on canvas
};

const initialState: WorkflowEditorState = {
  openNodeList: false,
  openSettings: false,
  searchQuery: "",
  expandedCategories: [],
  nodes: [],
  edges: [],
  isLocked: false,
  edgeThickness: 0.3, // Default to Minimal (0.3px)
  editingNotes: {}, // Map of node ID to editing state
  resizingNotes: {}, // Map of node ID to resizing state
  databaseDialogOpen: false,
  selectedNode: null,
  selectedNodeId: "",
  nodeList: [],
  minimapVisible: true, // Default to visible
  undoStack: [],
  redoStack: [],
  clipboard: null,
  isPasteMode: false,
  notesVisible: true, // Default to visible
};

const workflowEditorSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    setOpenNodeList: (state, action) => {
      state.openNodeList = action.payload;
    },
    setOpenSettings: (state, action: PayloadAction<boolean>) => {
      state.openSettings = action.payload;
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
    setNodeList: (state, action) => {
      state.nodeList = action.payload;
    },
    addNode: (state, action: PayloadAction<Node<CustomNodeData>>) => {
      const nodeExists = state.nodes.some(
        (node) => node.id === action.payload.id
      );
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
    setEdgeThickness: (state, action: PayloadAction<number>) => {
      state.edgeThickness = action.payload;
    },
    setNoteEditing: (
      state,
      action: PayloadAction<{ nodeId: string; isEditing: boolean }>
    ) => {
      const { nodeId, isEditing } = action.payload;
      if (isEditing) {
        state.editingNotes[nodeId] = true;
      } else {
        delete state.editingNotes[nodeId];
      }
    },
    clearEditingNotes: (state) => {
      state.editingNotes = {};
    },
    setNoteResizing: (
      state,
      action: PayloadAction<{ nodeId: string; isResizing: boolean }>
    ) => {
      const { nodeId, isResizing } = action.payload;
      if (isResizing) {
        state.resizingNotes[nodeId] = true;
      } else {
        delete state.resizingNotes[nodeId];
      }
    },
    clearResizingNotes: (state) => {
      state.resizingNotes = {};
    },
    setDatabaseDialogOpen: (state, action: PayloadAction<boolean>) => {
      state.databaseDialogOpen = action.payload;
    },
    setSelectedNode: (state, action: PayloadAction<any | null>) => {
      state.selectedNode = action.payload;
    },
    setSelectedNodeId: (state, action) => {
      state.selectedNodeId = action.payload;
    },
    toggleMinimap: (state) => {
      state.minimapVisible = !state.minimapVisible;
    },
    setMinimapVisible: (state, action: PayloadAction<boolean>) => {
      state.minimapVisible = action.payload;
    },
    /**
     * Push a new history entry to the undo stack
     * This is called ONLY when a socket event confirms a user action
     * Clears redoStack when a new user action is recorded
     */
    pushHistoryAction: (state, action: PayloadAction<HistoryEntry>) => {
      console.log("📝 [HISTORY] pushHistoryAction called:", {
        actionType: action.payload.actionType,
        payload: action.payload.payload,
        inversePayload: action.payload.inversePayload,
        currentUndoStackLength: state.undoStack.length,
        currentRedoStackLength: state.redoStack.length,
      });
      state.undoStack.push(action.payload);
      // Clear redo stack when a new user action is recorded
      state.redoStack = [];
      console.log("📝 [HISTORY] After pushHistoryAction:", {
        newUndoStackLength: state.undoStack.length,
        newRedoStackLength: state.redoStack.length,
        canUndo: state.undoStack.length > 0,
      });
    },
    /**
     * Undo: Pop from undoStack and push to redoStack
     * State updates IMMEDIATELY and SYNCHRONOUSLY
     */
    undo: (state) => {
      console.log("↩️ [UNDO] undo called:", {
        undoStackLength: state.undoStack.length,
        redoStackLength: state.redoStack.length,
      });
      if (state.undoStack.length === 0) {
        console.warn("⚠️ [UNDO] Cannot undo: undoStack is empty");
        return;
      }
      const lastAction = state.undoStack.pop()!;
      state.redoStack.push(lastAction);
      console.log("↩️ [UNDO] After undo:", {
        actionType: lastAction.actionType,
        newUndoStackLength: state.undoStack.length,
        newRedoStackLength: state.redoStack.length,
        canUndo: state.undoStack.length > 0,
        canRedo: state.redoStack.length > 0,
      });
    },
    /**
     * Redo: Pop from redoStack and push to undoStack
     * State updates IMMEDIATELY and SYNCHRONOUSLY
     */
    redo: (state) => {
      console.log("↪️ [REDO] redo called:", {
        undoStackLength: state.undoStack.length,
        redoStackLength: state.redoStack.length,
      });
      if (state.redoStack.length === 0) {
        console.warn("⚠️ [REDO] Cannot redo: redoStack is empty");
        return;
      }
      const lastAction = state.redoStack.pop()!;
      state.undoStack.push(lastAction);
      console.log("↪️ [REDO] After redo:", {
        actionType: lastAction.actionType,
        newUndoStackLength: state.undoStack.length,
        newRedoStackLength: state.redoStack.length,
        canUndo: state.undoStack.length > 0,
        canRedo: state.redoStack.length > 0,
      });
    },
    /**
     * Clear redo stack (called when a new user action is recorded)
     */
    clearRedoStack: (state) => {
      state.redoStack = [];
    },
    /**
     * Update the last entry in redoStack (used when connection ID changes after undo)
     */
    updateLastRedoStackEntry: (state, action: PayloadAction<Partial<HistoryEntry>>) => {
      if (state.redoStack.length > 0) {
        const lastEntry = state.redoStack[state.redoStack.length - 1];
        state.redoStack[state.redoStack.length - 1] = {
          ...lastEntry,
          ...action.payload,
          payload: action.payload.payload ? { ...lastEntry.payload, ...action.payload.payload } : lastEntry.payload,
        };
      }
    },
    /**
     * Clear all history (useful for workflow:data initial load)
     */
    clearHistory: (state) => {
      console.log("🗑️ [HISTORY] clearHistory called:", {
        undoStackLength: state.undoStack.length,
        redoStackLength: state.redoStack.length,
      });
      state.undoStack = [];
      state.redoStack = [];
      console.log("🗑️ [HISTORY] History cleared");
    },
    /**
     * Set clipboard data for copy/cut operations
     * Note: This does NOT enable paste mode - user must click Paste button first
     */
    setClipboard: (state, action: PayloadAction<ClipboardData | null>) => {
      state.clipboard = action.payload;
      // Don't automatically enable paste mode - user must click Paste button
      // state.isPasteMode = action.payload !== null;
    },
    /**
     * Clear clipboard and exit paste mode
     */
    clearClipboard: (state) => {
      state.clipboard = null;
      state.isPasteMode = false;
    },
    /**
     * Set paste mode (show "Click on canvas to paste" button)
     */
    setPasteMode: (state, action: PayloadAction<boolean>) => {
      state.isPasteMode = action.payload;
    },
    toggleNotesVisibility: (state) => {
      state.notesVisible = !state.notesVisible;
    },
    setNotesVisibility: (state, action: PayloadAction<boolean>) => {
      state.notesVisible = action.payload;
    },
  },
});

export const {
  setOpenNodeList,
  setOpenSettings,
  setSearchQuery,
  setExpandedCategories,
  toggleCategory,
  setNodes,
  addNode,
  updateNodes,
  setEdges,
  toggleLock,
  setEdgeThickness,
  setNoteEditing,
  clearEditingNotes,
  setNoteResizing,
  clearResizingNotes,
  setDatabaseDialogOpen,
  setSelectedNode,
  setSelectedNodeId,
  setNodeList,
  toggleMinimap,
  setMinimapVisible,
  pushHistoryAction,
  undo,
  redo,
  clearRedoStack,
  clearHistory,
  updateLastRedoStackEntry,
  setClipboard,
  clearClipboard,
  setPasteMode,
  toggleNotesVisibility,
  setNotesVisibility,
} = workflowEditorSlice.actions;

/**
 * Selectors for undo/redo availability
 * These are used to enable/disable undo/redo buttons
 */
export const selectCanUndo = (state: { workflowEditor: WorkflowEditorState }) => {
  const canUndo = state.workflowEditor.undoStack.length > 0;
  // Log selector calls occasionally to avoid spam
  if (Math.random() < 0.1) {
    console.log("🔍 [SELECTOR] selectCanUndo:", {
      undoStackLength: state.workflowEditor.undoStack.length,
      canUndo,
    });
  }
  return canUndo;
};

export const selectCanRedo = (state: { workflowEditor: WorkflowEditorState }) => {
  const canRedo = state.workflowEditor.redoStack.length > 0;
  // Log selector calls occasionally to avoid spam
  if (Math.random() < 0.1) {
    console.log("🔍 [SELECTOR] selectCanRedo:", {
      redoStackLength: state.workflowEditor.redoStack.length,
      canRedo,
    });
  }
  return canRedo;
};

export const selectUndoStack = (state: { workflowEditor: WorkflowEditorState }) =>
  state.workflowEditor.undoStack;

export const selectRedoStack = (state: { workflowEditor: WorkflowEditorState }) =>
  state.workflowEditor.redoStack;

export default workflowEditorSlice.reducer;
