# DataTable Component

A reusable, theme-aware data table component built with TanStack Table (React Table v8).

## Features

- ✅ **Theme Support**: Automatically adapts to dark/light theme
- ✅ **Row Selection**: Built-in checkbox selection with select all functionality
- ✅ **Sorting**: Sortable columns with visual indicators
- ✅ **Pagination**: Optional pagination support
- ✅ **Customizable**: Flexible column definitions with custom cell renderers
- ✅ **Status Badges**: Pre-built status badge component
- ✅ **Action Buttons**: Reusable action button component
- ✅ **TypeScript**: Fully typed with TypeScript

## Installation

The component uses `@tanstack/react-table` which is already installed in the project.

## Basic Usage

```tsx
import { DataTable, StatusBadge, ActionButtons, DataTableColumn } from "@/components/DataTable";
import { HiSignal, HiPaperClip, HiTrash } from "react-icons/hi";

interface MyData {
  id: string;
  name: string;
  status: "active" | "offline";
}

const MyComponent = () => {
  const data: MyData[] = [
    { id: "1", name: "Item 1", status: "active" },
    { id: "2", name: "Item 2", status: "offline" },
  ];

  const columns: DataTableColumn<MyData>[] = [
    {
      id: "select",
      header: "",
      accessorKey: "id",
      enableSorting: false,
      size: 50,
    },
    {
      id: "name",
      header: "Name",
      accessorKey: "name",
      enableSorting: true,
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      cell: (value, row) => (
        <StatusBadge
          status={{
            label: row.status === "active" ? "Active" : "Offline",
            variant: row.status === "active" ? "active" : "offline",
          }}
        />
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: (value, row) => (
        <ActionButtons
          actions={[
            {
              icon: <HiSignal className="w-4 h-4" />,
              label: "Connect",
              onClick: (row) => console.log("Connect", row),
              variant: "primary",
            },
            {
              icon: <HiTrash className="w-4 h-4" />,
              label: "Delete",
              onClick: (row) => console.log("Delete", row),
              variant: "danger",
            },
          ]}
          row={row}
        />
      ),
    },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      enableRowSelection={true}
      enableSorting={true}
      getRowId={(row) => row.id}
      onRowSelectionChange={(selectedRows) => {
        console.log("Selected:", selectedRows);
      }}
    />
  );
};
```

## Props

### DataTable Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `T[]` | Required | Array of data objects |
| `columns` | `DataTableColumn<T>[]` | Required | Column definitions |
| `enableRowSelection` | `boolean` | `false` | Enable row selection with checkboxes |
| `enableSorting` | `boolean` | `true` | Enable column sorting |
| `enablePagination` | `boolean` | `false` | Enable pagination |
| `pageSize` | `number` | `10` | Number of rows per page (when pagination enabled) |
| `onRowSelectionChange` | `(rows: T[]) => void` | - | Callback when selection changes |
| `onSortingChange` | `(sorting: SortingState) => void` | - | Callback when sorting changes |
| `getRowId` | `(row: T) => string` | - | Function to get unique row ID |
| `className` | `string` | `""` | Additional CSS classes |
| `emptyMessage` | `string` | `"No data available"` | Message shown when table is empty |
| `loading` | `boolean` | `false` | Show loading state |

### Column Definition

```tsx
interface DataTableColumn<T> {
  id: string;                    // Unique column ID
  header: string;                // Column header text
  accessorKey?: keyof T;         // Key to access data from row
  cell?: (value: any, row: T) => ReactNode;  // Custom cell renderer
  enableSorting?: boolean;       // Enable sorting (default: true)
  size?: number;                 // Column width
  minSize?: number;              // Minimum column width
  maxSize?: number;              // Maximum column width
}
```

## Components

### StatusBadge

Pre-built status badge component with theme support.

```tsx
<StatusBadge
  status={{
    label: "Active",
    variant: "active" | "offline" | "custom",
    color?: string,  // For custom variant
  }}
/>
```

### ActionButtons

Reusable action button component.

```tsx
<ActionButtons
  actions={[
    {
      icon: <Icon />,
      label: "Action Name",
      onClick: (row) => {},
      variant?: "primary" | "secondary" | "danger",
    },
  ]}
  row={rowData}
/>
```

### CheckboxCell

Checkbox component for row selection (used internally, but can be used standalone).

```tsx
<CheckboxCell
  checked={boolean}
  onChange={(checked) => {}}
  row={rowData}
/>
```

## Theme Support

The component automatically detects the theme from Redux store (`state.auth.theme`) and applies appropriate styles for:
- Dark theme: Dark backgrounds, light text
- Light theme: Light backgrounds, dark text

All colors and borders adapt automatically based on the current theme.

## Examples

See `src/views/Agents/Agents.tsx` for a complete example implementation.






