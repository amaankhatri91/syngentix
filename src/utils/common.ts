import React from "react";
import { TabItem } from "@/components/Tabs";
import appConfig from "@/configs/app.config";
import { NodeCategory } from "@/views/WorkflowEditor/type";
import { io, Socket } from "socket.io-client";
import { Node, Edge } from "reactflow";
import { CustomNodeData } from "@/views/WorkflowEditor/type";
import { StylesConfig, GroupBase } from "react-select";

let socket: Socket | null = null;

export const getActiveTabLabel = (
  tabs: TabItem[],
  activeTab: string | number,
  fallback = "Workflows"
): string => {
  return (
    tabs.find((tab) => String(tab.value) === String(activeTab))?.label ??
    fallback
  );
};

export const getSocket = () => {
  if (!socket) {
    socket = io(appConfig.socketBaseUrl, {
      transports: ["websocket"],
      autoConnect: true,
    });
  }
  return socket;
};

/**
 * Get icon color based on theme
 * @param isDark - Whether the theme is dark
 * @returns Icon color hex code
 */
export const getIconColor = (isDark: boolean): string => {
  return isDark ? "#FFFFFF" : "#162230";
};

/**
 * Get button base styles for workflow editor header
 * @param isDark - Whether the theme is dark
 * @returns Base button styles string
 */
export const getButtonBaseStyles = (isDark: boolean): string => {
  return `flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${
    isDark ? "border bg-[#0C1116] border-[#394757]" : " border border-[#E3E6EB]"
  }`;
};

/**
 * Get regular button styles for workflow editor header
 * @param isDark - Whether the theme is dark
 * @returns Regular button styles string
 */
export const getButtonStyles = (isDark: boolean): string => {
  const baseStyles = getButtonBaseStyles(isDark);
  return `font-normal ${baseStyles} ${
    isDark
      ? "text-white hover:bg-[#1E293B] bg-[#0C1116]"
      : "text-[#162230] hover:bg-[#F5F7FA] bg-[#F5F7FA]"
  }`;
};

/**
 * Get grouped button styles for workflow editor header
 * @param isDark - Whether the theme is dark
 * @returns Grouped button styles string
 */
export const getGroupedButtonStyles = (isDark: boolean): string => {
  const baseStyles = getButtonBaseStyles(isDark);
  return `font-normal ${baseStyles} ${
    isDark
      ? "text-white bg-[#0C1116] hover:bg-[#1E293B] border-l border-[#2B3643]"
      : "text-[#162230] hover:bg-[#EEF1F6]  bg-[#F5F7FA] border-l border-[#E6E6E6]"
  }`;
};

export const getCategoryColor = (category: string, isDark: boolean) => {
  switch (category.toLowerCase()) {
    case "trigger":
      return `${
        isDark ? "bg-[#CE93D833] text-[#CE93D8]" : "bg-[#714AE3] text-white"
      }`;
    case "core":
      return `${
        isDark ? "bg-[#4ADE8033] text-[#4ADE80]" : "bg-[#009D39] text-white"
      }`;
    case "logic":
      return `${
        isDark ? "bg-[#A78BFA33] text-[#A78BFA]" : "bg-[#714AE3] text-white"
      }`;
    case "integration":
      return `${
        isDark ? "bg-[#FFA50033] text-[#FFA500]" : "bg-[#D78D06] text-white"
      }`;
    default:
      return `${
        isDark ? "bg-[#A78BFA33] text-[#A78BFA]" : "bg-[#714AE3] text-white"
      }`;
  }
};

/**
 * Get workflow canvas background color based on theme
 * @param isDark - Whether the theme is dark
 * @returns Background color
 */
export const getWorkflowCanvasBg = (isDark: boolean): string => {
  return isDark ? "#0F1724" : "#FFFFFF";
};

/**
 * Get workflow canvas border color based on theme
 * @param isDark - Whether the theme is dark
 * @returns Border color
 */
export const getWorkflowCanvasBorderColor = (isDark: boolean): string => {
  return isDark ? "#2B3643" : "#EEF4FF";
};

/**
 * Get workflow canvas shadow style based on theme
 * @param isDark - Whether the theme is dark
 * @returns Shadow style string
 */
export const getWorkflowCanvasShadow = (isDark: boolean): string => {
  if (isDark) {
    // Inner shadow: X: 7, Y: -6, Blur: 30, Spread: 0, Color: #000000 with 32% opacity
    return "inset 7px -6px 30px 0px rgba(0, 0, 0, 0.32)";
  } else {
    // Table shadow: X: 1, Y: 4, Blur: 6, Spread: 0, Color: #2154EE with 10% opacity
    return "1px 4px 6px 0px rgba(33, 84, 238, 0.1)";
  }
};

/**
 * Get workflow canvas grid pattern color based on theme
 * @param isDark - Whether the theme is dark
 * @returns Grid color
 */
export const getWorkflowGridColor = (isDark: boolean): string => {
  return isDark ? "#2B3946" : "#E3E6EB"; // Gray for light mode
};

/**
 * Get node border gradient colors (default/inactive)
 * @returns Object with gradient start and end colors
 */
export const getNodeBorderGradient = () => {
  return {
    start: "#9133EA", // Purple
    end: "#2962EB", // Blue
  };
};

/**
 * Get active/selected node border gradient colors
 * @returns Object with gradient start and end colors
 */
export const getActiveNodeBorderGradient = () => {
  return {
    start: "#48D8D1", // Cyan
    end: "#096DBF", // Darker blue
  };
};

/**
 * Get node drop shadow style
 * @returns Shadow style string
 */
export const getNodeDropShadow = (): string => {
  // Drop shadow: X: 0, Y: 2, Blur: 20, Spread: 0, Color: #6946EB with 18% opacity
  return "0px 2px 20px 0px rgba(105, 70, 235, 0.18)";
};

/**
 * Get node background color based on theme
 * @param isDark - Whether the theme is dark
 * @returns Background color class
 */
export const getNodeBgColor = (isDark: boolean): string => {
  return isDark ? "bg-[#0C1116]" : "bg-white";
};

/**
 * Get node text color based on theme
 * @param isDark - Whether the theme is dark
 * @returns Text color class
 */
export const getNodeTextColor = (isDark: boolean): string => {
  return isDark ? "text-white" : "text-[#162230]";
};

/**
 * Get port (handle) color based on theme
 * @param isDark - Whether the theme is dark
 * @returns Port color class
 */
export const getPortColor = (isDark: boolean): string => {
  return isDark ? "bg-[#34C759]" : "bg-[#34C759]";
};

/**
 * Get handle color for specific handles
 * @param handleName - Name of the handle
 * @param isDark - Whether the theme is dark (for default color)
 * @param isInput - Whether the handle is an input (true) or output (false)
 * @returns Hex color code for the handle
 */
export const getHandleColor = (
  handleName: string,
  isDark: boolean,
  isInput: boolean = false
): string => {
  // Next and STDOUT pins always get green color regardless of input/output
  if (handleName === "Next" || handleName === "Start") {
    return "#34C759";
  }
  // Input pins get purple color
  if (isInput) {
    return "#AF52DE";
  }
  // Output pins get pink color
  return "#FF69B4";
};

/**
 * Get node gradient border style based on selection state and theme
 * @param selected - Whether the node is selected
 * @param isDark - Whether the theme is dark
 * @returns CSS properties object for the gradient border
 */
export const getNodeGradientBorderStyle = (
  selected: boolean,
  isDark: boolean
): React.CSSProperties => {
  const gradient = getNodeBorderGradient();
  const dropShadow = getNodeDropShadow();
  const bgColorValue = isDark ? "#0C1116" : "#FFFFFF";

  // Active/Selected node styles
  const activeBorderWidth = "2px";
  const activeGradient = getActiveNodeBorderGradient();
  const activeDropShadow = "0px 2px 20px 0px rgba(105, 70, 235, 0.18)";

  // Default styles
  const defaultBorderWidth = "1.5px";

  const borderWidth = selected ? activeBorderWidth : defaultBorderWidth;
  const borderGradientStart = selected ? activeGradient.start : gradient.start;
  const borderGradientEnd = selected ? activeGradient.end : gradient.end;
  const shadow = selected ? activeDropShadow : dropShadow;

  return {
    background: `
      linear-gradient(${bgColorValue}, ${bgColorValue}) padding-box,
      linear-gradient(90deg, ${borderGradientStart}, ${borderGradientEnd}) border-box
    `,
    border: `${borderWidth} solid transparent`,
    borderRadius: "0.5rem",
    boxShadow: shadow,
  };
};

/**
 * Calculate estimated node width based on labels
 * @param data - Node data containing label, inputs, and outputs
 * @returns Estimated width in pixels
 */
export const calculateNodeEstimatedWidth = (data: {
  label?: string;
  inputs?: string[];
  outputs?: string[];
}): number => {
  const allLabels = [
    data.label,
    ...(data.inputs || []),
    ...(data.outputs || []),
  ].filter((label): label is string => Boolean(label));

  const longestLabel = allLabels.reduce(
    (longest, label) => (label.length > longest.length ? label : longest),
    ""
  );
  // Estimate width: ~8px per character + padding
  return Math.max(200, longestLabel.length * 8 + 80);
};

/**
 * Calculate estimated node height based on inputs and outputs count
 * @param data - Node data containing inputs and outputs
 * @returns Estimated height in pixels
 */
export const calculateNodeEstimatedHeight = (data: {
  inputs?: string[];
  outputs?: string[];
}): number => {
  const inputCount = data.inputs?.length || 0;
  const outputCount = data.outputs?.length || 0;
  const maxCount = Math.max(inputCount, outputCount);
  // Base height: label (40px) + spacing + (maxCount * 32px per item) + padding
  return Math.max(140, 40 + maxCount * 32 + 40);
};

/**
 * Sort outputs to display "Next" first, then others in original order
 * @param outputs - Array of output handle names
 * @returns Sorted array with "Next" first
 */
export const sortOutputsWithNextFirst = (
  outputs: string[] | undefined
): string[] => {
  if (!outputs || outputs.length === 0) {
    return [];
  }
  return [...outputs].sort((a, b) => {
    if (a === "Next") return -1;
    if (b === "Next") return 1;
    return 0;
  });
};

/**
 * Get context menu item class based on theme
 * @param isDark - Whether the theme is dark
 * @returns Context menu item class string
 */
export const getContextMenuItemClass = (isDark: boolean): string => {
  return `
    flex items-center justify-between w-full px-4 py-3 text-sm font-medium
    transition-colors duration-150 cursor-pointer
    ${
      isDark
        ? "text-white hover:bg-[#1E293B]"
        : "text-[#162230] hover:bg-[#F5F7FA]"
    }
    first:rounded-t-2xl last:rounded-b-2xl
  `;
};

/**
 * Get context menu separator class based on theme
 * @param isDark - Whether the theme is dark
 * @returns Context menu separator class string
 */
export const getContextMenuSeparatorClass = (isDark: boolean): string => {
  return `
    ${isDark ? "border-[#2B3643]" : "border-[#E3E6EB]"}
    border-t
  `;
};

/**
 * Get react-select custom styles
 * @param isDark - Whether the theme is dark
 * @param hasError - Whether the select has an error
 * @returns React-select styles object
 */
export const getReactSelectStyles = (
  isDark: boolean,
  hasError: boolean = false
) => {
  return {
    control: (base: any, state: any) => {
      const isLightModeNoError = !isDark && !hasError;

      return {
        ...base,
        backgroundColor: "#FFFFFF",
        borderColor: hasError ? "#EF4444" : "#D1D5DB",
        borderTopColor: isLightModeNoError
          ? "#EAEAEA"
          : hasError
          ? "#EF4444"
          : "#D1D5DB",
        borderBottomColor: isLightModeNoError
          ? "transparent"
          : hasError
          ? "#EF4444"
          : "#D1D5DB",
        borderLeftColor: isLightModeNoError
          ? "transparent"
          : hasError
          ? "#EF4444"
          : "#D1D5DB",
        borderRightColor: isLightModeNoError
          ? "transparent"
          : hasError
          ? "#EF4444"
          : "#D1D5DB",
        borderTopWidth: "1px",
        borderBottomWidth: isLightModeNoError ? "0px" : "1px",
        borderLeftWidth: isLightModeNoError ? "0px" : "1px",
        borderRightWidth: isLightModeNoError ? "0px" : "1px",
        borderRadius: "12px",
        minHeight: "42px",
        maxHeight: "42px",
        boxShadow: isLightModeNoError ? "0 4px 8px 0 rgba(1,5,17,0.1)" : "none",
        "&:hover": {
          borderColor: hasError ? "#EF4444" : "#9CA3AF",
          borderTopColor: isLightModeNoError
            ? "#EAEAEA"
            : hasError
            ? "#EF4444"
            : "#9CA3AF",
          borderBottomColor: isLightModeNoError
            ? "transparent"
            : hasError
            ? "#EF4444"
            : "#9CA3AF",
          borderLeftColor: isLightModeNoError
            ? "transparent"
            : hasError
            ? "#EF4444"
            : "#9CA3AF",
          borderRightColor: isLightModeNoError
            ? "transparent"
            : hasError
            ? "#EF4444"
            : "#9CA3AF",
        },
        ...(state.isFocused && {
          borderColor: hasError ? "#EF4444" : "#9CA3AF",
          borderTopColor: isLightModeNoError
            ? "#EAEAEA"
            : hasError
            ? "#EF4444"
            : "#9CA3AF",
          borderBottomColor: isLightModeNoError
            ? "transparent"
            : hasError
            ? "#EF4444"
            : "#9CA3AF",
          borderLeftColor: isLightModeNoError
            ? "transparent"
            : hasError
            ? "#EF4444"
            : "#9CA3AF",
          borderRightColor: isLightModeNoError
            ? "transparent"
            : hasError
            ? "#EF4444"
            : "#9CA3AF",
          boxShadow: isLightModeNoError
            ? "0 4px 8px 0 rgba(1,5,17,0.1)"
            : "none",
        }),
      };
    },
    placeholder: (base: any) => ({
      ...base,
      color: "#737373",
      fontSize: "14px",
    }),
    singleValue: (base: any) => ({
      ...base,
      color: "#162230",
      fontSize: "14px",
    }),
    input: (base: any) => ({
      ...base,
      color: "#162230",
      fontSize: "14px",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    dropdownIndicator: (base: any) => ({
      ...base,
      color: "#0C1116",
      padding: "8px",
      "&:hover": {
        color: "#0C1116",
      },
    }),
    menu: (base: any) => ({
      ...base,
      borderRadius: "12px",
      boxShadow:
        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      marginTop: "4px",
      zIndex: 9999,
    }),
    menuList: (base: any) => ({
      ...base,
      padding: "4px",
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#F3F4F6"
        : state.isFocused
        ? "#F9FAFB"
        : "#FFFFFF",
      color: "#111827",
      fontSize: "14px",
      padding: "10px 12px",
      borderRadius: "8px",
      cursor: "pointer",
      "&:active": {
        backgroundColor: "#F3F4F6",
      },
    }),
  };
};

/**
 * Filters categories based on search query
 * @param categories - Array of node categories
 * @param searchQuery - Search query string
 * @returns Filtered array of categories with matching nodes
 */
export const filterCategoriesBySearch = (
  categories: NodeCategory[],
  searchQuery: string
): NodeCategory[] => {
  if (!searchQuery.trim()) return categories;

  const query = searchQuery.toLowerCase();
  return categories
    .map((category) => {
      const filteredNodes = category.nodes.filter(
        (node) =>
          node.name?.toLowerCase().includes(query) ||
          node.description?.toLowerCase().includes(query) ||
          category.name?.toLowerCase().includes(query) ||
          category.category?.toLowerCase().includes(query)
      );
      return {
        ...category,
        nodes: filteredNodes,
      };
    })
    .filter((category) => category.nodes.length > 0);
};

/**
 * Gets all category names from categories data
 * @param categories - Array of node categories
 * @returns Array of category names
 */
export const getAllCategoryNames = (categories: NodeCategory[]): string[] => {
  return categories.map((cat) => cat.name);
};

/**
 * Toggles a category in the expanded categories array
 * @param expandedCategories - Current array of expanded category names
 * @param categoryName - Category name to toggle
 * @returns New array with toggled category
 */
export const toggleCategoryInArray = (
  expandedCategories: string[],
  categoryName: string
): string[] => {
  const categorySet = new Set(expandedCategories);
  if (categorySet.has(categoryName)) {
    categorySet.delete(categoryName);
  } else {
    categorySet.add(categoryName);
  }
  return Array.from(categorySet);
};

/**
 * Checks if a category is expanded
 * @param expandedCategories - Array of expanded category names
 * @param categoryName - Category name to check
 * @returns True if category is expanded
 */
export const isCategoryExpanded = (
  expandedCategories: string[],
  categoryName: string
): boolean => {
  return expandedCategories.includes(categoryName);
};

/**
 * Get dot color based on node category
 * @param category - Node category string
 * @returns Hex color code for the dot
 */
export const getDotColorByCategory = (category: string): string => {
  const colorMap: Record<string, string> = {
    visualization: "#22D3EE", // Light blue
    logic: "#EC4899", // Pink
    api: "#10B981", // Green
    llm: "#8B5CF6", // Purple
    text: "#F59E0B", // Amber
    default: "#94A3B8", // Gray
  };
  return colorMap[category] || colorMap.default;
};

/**
 * Get border gradient color based on node category
 * @param category - Node category string
 * @returns Tailwind gradient class string
 */
export const getBorderColorByCategory = (category: string): string => {
  const borderMap: Record<string, string> = {
    visualization: "from-blue-500 to-purple-500",
    logic: "from-purple-500 to-blue-500",
    api: "from-green-500 to-blue-500",
    llm: "from-purple-500 to-pink-500",
    text: "from-amber-500 to-orange-500",
    default: "from-gray-500 to-gray-600",
  };
  return borderMap[category] || borderMap.default;
};

/**
 * Map node category to CustomNodeData nodeType
 * @param category - Node category string
 * @returns CustomNodeData nodeType
 */
export const mapNodeType = (category: string): CustomNodeData["nodeType"] => {
  const typeMap: Record<string, CustomNodeData["nodeType"]> = {
    visualization: "text",
    logic: "switch",
    api: "api",
    llm: "text",
    text: "text",
    default: "text",
  };
  return typeMap[category] || "text";
};

/**
 * Transform server node format to ReactFlow Node format
 * @param serverNode - Node data from server
 * @returns ReactFlow Node with CustomNodeData
 */
export const transformServerNodeToReactFlowNode = (
  serverNode: any
): Node<CustomNodeData> => {
  const nodeData = serverNode.data || {};

  // Extract pin names for inputs and outputs
  const inputs = nodeData.inputs?.map((pin: any) => pin.name) || [];
  const outputs = nodeData.outputs?.map((pin: any) => pin.name) || [];
  const triggerPins = nodeData.trigger_pins?.map((pin: any) => pin.name) || [];
  const nextPins = nodeData.next_pins?.map((pin: any) => pin.name) || [];

  // Combine all outputs (trigger_pins and next_pins are also outputs)
  const allOutputs = [...outputs, ...nextPins];
  const allInputs = [...triggerPins, ...inputs];

  // Determine node type and colors based on category or type
  const category = nodeData.category || "default";
  const dotColor = getDotColorByCategory(category);
  const borderColor = getBorderColorByCategory(category);

  return {
    id: serverNode.id,
    type: "custom", // Use "custom" type for ReactFlow
    position: serverNode.position || { x: 0, y: 0 },
    data: {
      label: nodeData.name || serverNode.type || "Node",
      nodeType: mapNodeType(category),
      dotColor,
      borderColor,
      inputs: allInputs,
      outputs: allOutputs,
    } as CustomNodeData,
  };
};

/**
 * Transform array of server nodes to ReactFlow nodes
 * @param serverNodes - Array of node data from server
 * @returns Array of ReactFlow Nodes with CustomNodeData
 */
export const transformServerNodesToReactFlowNodes = (
  serverNodes: any[]
): Node<CustomNodeData>[] => {
  return serverNodes.map(transformServerNodeToReactFlowNode);
};

/**
 * Transform server connection format to ReactFlow Edge format
 * @param serverConnection - Connection data from server
 * @returns ReactFlow Edge
 */
export const transformServerConnectionToReactFlowEdge = (
  serverConnection: any
): Edge => {
  return {
    id: serverConnection.id,
    source: serverConnection.source,
    target: serverConnection.target,
    sourceHandle: serverConnection.sourceHandle || undefined,
    targetHandle: serverConnection.targetHandle || undefined,
    type: "default",
  };
};

/**
 * Transform array of server connections to ReactFlow edges
 * @param serverConnections - Array of connection data from server
 * @returns Array of ReactFlow Edges
 */
export const transformServerConnectionsToReactFlowEdges = (
  serverConnections: any[]
): Edge[] => {
  return serverConnections.map(transformServerConnectionToReactFlowEdge);
};

/**
 * Get note node style based on editing and selection state
 * Note nodes have no border, no border radius, and a fixed background color
 * @param isEditing - Whether the note is currently being edited
 * @param selected - Whether the note is currently selected
 * @returns CSS properties object for the note node
 */
export const getNoteNodeStyle = (
  isEditing: boolean,
  selected: boolean
): React.CSSProperties => {
  return {
    backgroundColor: isEditing ? "#94D29E" : "#B3EFBD",
    border: "none",
    borderRadius: 0,
    boxShadow: selected ? "0px 2px 20px 0px rgba(105, 70, 235, 0.18)" : "none",
  };
};

/**
 * Get total pages from pagination data
 * @param data - Response data object with optional pagination property
 * @param defaultPages - Default value if pagination is not available (default: 1)
 * @returns Total number of pages
 */
export const getTotalPages = (
  data?: { pagination?: { totalPages?: number } } | null,
  defaultPages: number = 1
): number => {
  return data?.pagination?.totalPages || defaultPages;
};

/**
 * Extract pagination values from response data
 * @param data - Response data object with optional pagination property
 * @returns Object with totalPages and total, defaults to 0 if not available
 */
export const getPaginationValues = (
  data?: { pagination?: { totalPages?: number; total?: number } } | null
): { totalPages: number; total: number } => {
  const pagination = data?.pagination;
  return {
    totalPages: pagination?.totalPages || 0,
    total: pagination?.total || 0,
  };
};

/**
 * Format date helper
 * Formats a date string to "Month Day, Hour:Minute AM/PM" format
 * @param dateString - ISO date string or date string
 * @returns Formatted date string or "-" if invalid
 */
export const formatDate = (dateString?: string): string => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, "0");
    return `${month} ${day}, ${displayHours}:${displayMinutes} ${ampm}`;
  } catch {
    return "-";
  }
};

/**
 * Format relative time helper
 * Formats a date string to relative time (e.g., "2 min ago", "1 hour ago")
 * @param dateString - ISO date string or date string
 * @returns Formatted relative time string or "-" if invalid
 */
export const formatRelativeTime = (dateString?: string): string => {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} sec ago`;
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hour ago`;
    return `${Math.floor(diffInSeconds / 86400)} day ago`;
  } catch {
    return "-";
  }
};

/**
 * Get workflow select styles for react-select component
 * Provides dark/light theme support with custom styling
 * @param isDark - Whether the theme is dark
 * @returns StylesConfig object for react-select
 */
export const getWorkflowSelectStyles = <T,>(
  isDark: boolean
): StylesConfig<T, false, GroupBase<T>> => {
  return {
    control: (base: any, state: any) => ({
      ...base,
      backgroundColor: isDark ? "#0C1116" : "#FFFFFF",
      borderColor: isDark ? "#2B3643" : "#D1D5DB",
      borderRadius: "8px",
      minHeight: "48px",
      maxHeight: "48px",
      paddingLeft: "16px",
      paddingRight: "16px",
      boxShadow: "none",
      "&:hover": {
        borderColor: isDark ? "#2B3643" : "#9CA3AF",
      },
      ...(state.isFocused && {
        borderColor: isDark ? "#2B3643" : "#9CA3AF",
        boxShadow: "none",
      }),
    }),
    valueContainer: (base: any) => ({
      ...base,
      padding: 0,
    }),
    placeholder: (base: any) => ({
      ...base,
      color: isDark ? "#9CA3AF" : "#737373",
      fontSize: "14px",
    }),
    singleValue: (base: any) => ({
      ...base,
      color: isDark ? "#FFFFFF" : "#162230",
      fontSize: "14px",
    }),
    input: (base: any) => ({
      ...base,
      color: isDark ? "#FFFFFF" : "#162230",
      fontSize: "14px",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    dropdownIndicator: (base: any) => ({
      ...base,
      color: isDark ? "#FFFFFF" : "#0C1116",
      padding: "8px",
      "&:hover": {
        color: isDark ? "#FFFFFF" : "#0C1116",
      },
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: isDark ? "#1C2643" : "#FFFFFF",
      borderRadius: "8px",
      boxShadow: isDark
        ? "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)"
        : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      marginTop: "4px",
      zIndex: 9999,
    }),
    menuList: (base: any) => ({
      ...base,
      padding: "4px",
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected
        ? isDark
          ? "#0C1116"
          : "#F3F4F6"
        : state.isFocused
        ? isDark
          ? "#0F1724"
          : "#F9FAFB"
        : isDark
        ? "#1C2643"
        : "#FFFFFF",
      color: isDark ? "#FFFFFF" : "#111827",
      fontSize: "14px",
      padding: "10px 12px",
      borderRadius: "8px",
      cursor: "pointer",
      "&:active": {
        backgroundColor: isDark ? "#0C1116" : "#F3F4F6",
      },
    }),
  };
};


