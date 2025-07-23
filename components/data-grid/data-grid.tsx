"use client"

import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type Row,
  type RowData,
  type ColumnPinningState,
  type RowSelectionState,
  type ExpandedState,
  type GroupingState,
  getExpandedRowModel,
  getGroupedRowModel,
} from "@tanstack/react-table"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

import { DataGridContext } from "./data-grid-context"
import { DataGridToolbar } from "./data-grid-toolbar"
import { DataGridPagination } from "./data-grid-pagination"
import { DataGridColumnHeader } from "./data-grid-column-header"
import { DataGridRowActions } from "./data-grid-row-actions"
import { DataGridDetailPanel } from "./data-grid-detail-panel"
import { cn } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { useVirtualizer } from "@tanstack/react-virtual"
import { useTranslation } from "./use-translation"

// Extend RowData to support sub-rows for tree structure
declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void
    addRow: (data: TData) => void
    deleteRow: (rowIndex: number) => void
    localization: Record<string, string>
  }
}

export interface DataGridProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  enableRowSelection?: boolean
  enableColumnResizing?: boolean
  enableSorting?: boolean
  enableFiltering?: boolean
  enableColumnVisibility?: boolean
  enablePagination?: boolean
  enableVirtualization?: boolean
  enableGrouping?: boolean
  enableExpanding?: boolean
  enableColumnPinning?: boolean
  enableRowPinning?: boolean
  enableRowDragging?: boolean
  enableColumnDragging?: boolean
  enableEditing?: boolean
  enableDetailPanel?: boolean
  enableFullScreen?: boolean
  enableDensityToggle?: boolean
  enableGlobalFilter?: boolean
  enableCopy?: boolean
  enableExport?: boolean
  enableRowNumbers?: boolean
  onRowClick?: (row: Row<TData>) => void
  renderDetailPanel?: (row: Row<TData>) => React.ReactNode
  renderRowSubComponent?: (row: Row<TData>) => React.ReactNode
  renderToolbar?: (table: ReturnType<typeof useReactTable>) => React.ReactNode
  renderEmptyState?: () => React.ReactNode
  renderLoadingState?: () => React.ReactNode
  isLoading?: boolean
  localization?: Record<string, string>
  className?: string
  rowClassName?: (row: Row<TData>) => string
  cellClassName?: (row: Row<TData>, columnId: string) => string
  headerClassName?: (columnId: string) => string
  stickyHeader?: boolean
  stickyFooter?: boolean
  height?: string | number
  width?: string | number
  onStateChange?: (state: any) => void
  initialState?: {
    sorting?: SortingState
    columnFilters?: ColumnFiltersState
    columnVisibility?: VisibilityState
    rowSelection?: RowSelectionState
    pagination?: {
      pageIndex: number
      pageSize: number
    }
    columnPinning?: ColumnPinningState
    expanded?: ExpandedState
    grouping?: GroupingState
  }
}

export function DataGrid<TData, TValue>({
  columns,
  data,
  enableRowSelection = false,
  enableColumnResizing = false,
  enableSorting = true,
  enableFiltering = true,
  enableColumnVisibility = true,
  enablePagination = true,
  enableVirtualization = false,
  enableGrouping = false,
  enableExpanding = false,
  enableColumnPinning = false,
  enableRowPinning = false,
  enableRowDragging = false,
  enableColumnDragging = false,
  enableEditing = false,
  enableDetailPanel = false,
  enableFullScreen = true,
  enableDensityToggle = true,
  enableGlobalFilter = true,
  enableCopy = true,
  enableExport = true,
  enableRowNumbers = false,
  onRowClick,
  renderDetailPanel,
  renderRowSubComponent,
  renderToolbar,
  renderEmptyState,
  renderLoadingState,
  isLoading = false,
  localization = {},
  className,
  rowClassName,
  cellClassName,
  headerClassName,
  stickyHeader = false,
  stickyFooter = false,
  height = "auto",
  width = "100%",
  onStateChange,
  initialState,
}: DataGridProps<TData, TValue>) {
  // Get translations
  const { t } = useTranslation(localization)

  // State management
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
  const [columnPinning, setColumnPinning] = React.useState<ColumnPinningState>({})
  const [expanded, setExpanded] = React.useState<ExpandedState>({})
  const [grouping, setGrouping] = React.useState<GroupingState>([])
  const [density, setDensity] = React.useState<"compact" | "normal" | "spacious">("normal")
  const [fullScreen, setFullScreen] = React.useState(false)
  const [globalFilter, setGlobalFilter] = React.useState("")

  // Initialize state from props in an effect
  React.useEffect(() => {
    if (initialState) {
      if (initialState.sorting) setSorting(initialState.sorting)
      if (initialState.columnFilters) setColumnFilters(initialState.columnFilters)
      if (initialState.columnVisibility) setColumnVisibility(initialState.columnVisibility)
      if (initialState.rowSelection) setRowSelection(initialState.rowSelection)
      if (initialState.columnPinning) setColumnPinning(initialState.columnPinning)
      if (initialState.expanded) setExpanded(initialState.expanded)
      if (initialState.grouping) setGrouping(initialState.grouping)
    }
  }, [initialState])

  // Refs
  const tableContainerRef = React.useRef<HTMLDivElement>(null)

  // Add row numbers if enabled
  const columnsWithRowNumbers = React.useMemo(() => {
    if (!enableRowNumbers) return columns

    return [
      {
        id: "row-number",
        header: "#",
        cell: ({ row }) => row.index + 1,
        size: 50,
        enableSorting: false,
        enableResizing: false,
        enableHiding: false,
      },
      ...columns,
    ] as ColumnDef<TData, TValue>[]
  }, [columns, enableRowNumbers])

  // Add selection column if enabled
  const columnsWithSelection = React.useMemo(() => {
    if (!enableRowSelection) return columnsWithRowNumbers

    return [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label={t("selectAll")}
            className="translate-y-[2px]"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label={t("selectRow")}
            className="translate-y-[2px]"
          />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 40,
      },
      ...columnsWithRowNumbers,
    ] as ColumnDef<TData, TValue>[]
  }, [columnsWithRowNumbers, enableRowSelection, t])

  // Add actions column if needed
  const columnsWithActions = React.useMemo(() => {
    // Only add actions column if we have detail panel, editing, or row actions
    if (!enableDetailPanel && !enableEditing) return columnsWithSelection

    return [
      ...columnsWithSelection,
      {
        id: "actions",
        cell: ({ row }) => (
          <DataGridRowActions
            row={row}
            enableEditing={enableEditing}
            enableDetailPanel={enableDetailPanel}
            onEdit={() => console.log("Edit row", row.index)}
            onDelete={() => console.log("Delete row", row.index)}
            onViewDetails={() => row.toggleExpanded()}
          />
        ),
        size: 40,
        enableSorting: false,
        enableHiding: false,
      },
    ] as ColumnDef<TData, TValue>[]
  }, [columnsWithSelection, enableDetailPanel, enableEditing])

  // Set up virtualization if enabled
  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => (density === "compact" ? 40 : density === "normal" ? 48 : 56),
    overscan: 10,
    enabled: enableVirtualization,
  })

  // Create table instance
  const table = useReactTable({
    data,
    columns: columnsWithActions,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      columnPinning,
      expanded,
      grouping,
      globalFilter,
      pagination: {
        pageIndex: initialState?.pagination?.pageIndex || 0,
        pageSize: initialState?.pagination?.pageSize || 10,
      },
    },
    enableRowSelection,
    enableColumnResizing,
    enableMultiRowSelection: enableRowSelection,
    columnResizeMode: "onChange",
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onColumnPinningChange: setColumnPinning,
    onExpandedChange: setExpanded,
    onGroupingChange: setGrouping,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
    getExpandedRowModel: enableExpanding ? getExpandedRowModel() : undefined,
    getGroupedRowModel: enableGrouping ? getGroupedRowModel() : undefined,
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    meta: {
      updateData: (rowIndex: number, columnId: string, value: unknown) => {
        // Handle data updates for editing
        console.log("Update data", rowIndex, columnId, value)
      },
      addRow: (newData: TData) => {
        // Handle adding a new row
        console.log("Add row", newData)
      },
      deleteRow: (rowIndex: number) => {
        // Handle deleting a row
        console.log("Delete row", rowIndex)
      },
      localization,
    },
    debugTable: false,
  })

  const { rows } = table.getRowModel()

  // Notify parent of state changes
  React.useEffect(() => {
    if (onStateChange) {
      onStateChange({
        sorting,
        columnFilters,
        columnVisibility,
        rowSelection,
        columnPinning,
        expanded,
        grouping,
        globalFilter,
        pagination: table.getState().pagination,
      })
    }
  }, [
    sorting,
    columnFilters,
    columnVisibility,
    rowSelection,
    columnPinning,
    expanded,
    grouping,
    globalFilter,
    table,
    onStateChange,
  ])

  // Handle full screen toggle
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && fullScreen) {
        setFullScreen(false)
      }
    }

    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [fullScreen])

  // Determine row and cell styles based on density
  const getRowHeight = () => {
    switch (density) {
      case "compact":
        return "h-10"
      case "spacious":
        return "h-14"
      default:
        return "h-12"
    }
  }

  // Render loading state
  if (isLoading) {
    return renderLoadingState ? (
      renderLoadingState()
    ) : (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Render empty state
  if (data.length === 0) {
    return renderEmptyState ? (
      renderEmptyState()
    ) : (
      <div className="flex flex-col items-center justify-center h-96 text-center p-4">
        <h3 className="text-lg font-medium">{t("noDataAvailable")}</h3>
        <p className="text-muted-foreground mt-2">{t("noDataDescription")}</p>
      </div>
    )
  }

  return (
    <DataGridContext.Provider
      value={{
        density,
        setDensity,
        fullScreen,
        setFullScreen,
        enableColumnResizing,
        enableSorting,
        enableFiltering,
        enableColumnVisibility,
        enablePagination,
        enableGrouping,
        enableColumnPinning,
        enableRowSelection,
        enableGlobalFilter,
        enableCopy,
        enableExport,
        enableDensityToggle,
        enableFullScreen,
        t,
      }}
    >
      <DndProvider backend={HTML5Backend}>
        <div
          className={cn("rounded-md border", fullScreen && "fixed inset-0 z-50 bg-background", className)}
          style={{
            height: fullScreen ? "100vh" : height,
            width: fullScreen ? "100vw" : width,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Toolbar */}
          {renderToolbar ? renderToolbar(table) : <DataGridToolbar table={table} />}

          {/* Table Container */}
          <div
            ref={tableContainerRef}
            className="relative overflow-auto flex-grow"
            style={{
              height: enablePagination ? "calc(100% - 40px)" : "100%",
            }}
          >
            <Table>
              <TableHeader className={cn(stickyHeader && "sticky top-0 z-10 bg-background")}>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          key={header.id}
                          colSpan={header.colSpan}
                          style={{
                            width: header.getSize(),
                            position: header.column.getIsPinned() ? "sticky" : undefined,
                            left: header.column.getIsPinned() === "left" ? `${header.getStart("left")}px` : undefined,
                            right:
                              header.column.getIsPinned() === "right" ? `${header.getStart("right")}px` : undefined,
                            background: header.column.getIsPinned() ? "var(--background)" : undefined,
                            zIndex: header.column.getIsPinned() ? 1 : undefined,
                          }}
                          className={cn("transition-colors", headerClassName?.(header.id))}
                        >
                          {header.isPlaceholder ? null : <DataGridColumnHeader header={header} table={table} />}
                          {enableColumnResizing && header.column.getCanResize() && (
                            <div
                              onMouseDown={header.getResizeHandler()}
                              onTouchStart={header.getResizeHandler()}
                              className={cn(
                                "absolute right-0 top-0 h-full w-1 cursor-col-resize select-none touch-none",
                                header.column.getIsResizing() ? "bg-primary" : "bg-transparent",
                              )}
                            />
                          )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {rowVirtualizer.enabled
                  ? rowVirtualizer.getVirtualItems().map((virtualRow) => {
                      const row = rows[virtualRow.index]
                      return (
                        <React.Fragment key={row.id}>
                          <TableRow
                            data-state={row.getIsSelected() ? "selected" : undefined}
                            className={cn(getRowHeight(), rowClassName?.(row), onRowClick && "cursor-pointer")}
                            style={{
                              height: virtualRow.size,
                              transform: `translateY(${virtualRow.start}px)`,
                              position: "absolute",
                              top: 0,
                              left: 0,
                              width: "100%",
                            }}
                            onClick={() => onRowClick?.(row)}
                          >
                            {row.getVisibleCells().map((cell) => {
                              return (
                                <TableCell
                                  key={cell.id}
                                  style={{
                                    width: cell.column.getSize(),
                                    position: cell.column.getIsPinned() ? "sticky" : undefined,
                                    left:
                                      cell.column.getIsPinned() === "left"
                                        ? `${cell.column.getStart("left")}px`
                                        : undefined,
                                    right:
                                      cell.column.getIsPinned() === "right"
                                        ? `${cell.column.getStart("right")}px`
                                        : undefined,
                                    background: cell.column.getIsPinned() ? "var(--background)" : undefined,
                                    zIndex: cell.column.getIsPinned() ? 1 : undefined,
                                  }}
                                  className={cn(cellClassName?.(row, cell.column.id))}
                                >
                                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                              )
                            })}
                          </TableRow>
                          {/* Detail Panel */}
                          {enableDetailPanel && row.getIsExpanded() && (
                            <TableRow>
                              <TableCell colSpan={row.getVisibleCells().length} className="p-0">
                                <DataGridDetailPanel>
                                  {renderDetailPanel
                                    ? renderDetailPanel(row)
                                    : renderRowSubComponent
                                      ? renderRowSubComponent(row)
                                      : null}
                                </DataGridDetailPanel>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      )
                    })
                  : table.getRowModel().rows.map((row) => (
                      <React.Fragment key={row.id}>
                        <TableRow
                          data-state={row.getIsSelected() ? "selected" : undefined}
                          className={cn(getRowHeight(), rowClassName?.(row), onRowClick && "cursor-pointer")}
                          onClick={() => onRowClick?.(row)}
                        >
                          {row.getVisibleCells().map((cell) => {
                            return (
                              <TableCell
                                key={cell.id}
                                style={{
                                  width: cell.column.getSize(),
                                  position: cell.column.getIsPinned() ? "sticky" : undefined,
                                  left:
                                    cell.column.getIsPinned() === "left"
                                      ? `${cell.column.getStart("left")}px`
                                      : undefined,
                                  right:
                                    cell.column.getIsPinned() === "right"
                                      ? `${cell.column.getStart("right")}px`
                                      : undefined,
                                  background: cell.column.getIsPinned() ? "var(--background)" : undefined,
                                  zIndex: cell.column.getIsPinned() ? 1 : undefined,
                                }}
                                className={cn(cellClassName?.(row, cell.column.id))}
                              >
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </TableCell>
                            )
                          })}
                        </TableRow>
                        {/* Detail Panel */}
                        {enableDetailPanel && row.getIsExpanded() && (
                          <TableRow>
                            <TableCell colSpan={row.getVisibleCells().length} className="p-0">
                              <DataGridDetailPanel>
                                {renderDetailPanel
                                  ? renderDetailPanel(row)
                                  : renderRowSubComponent
                                    ? renderRowSubComponent(row)
                                    : null}
                              </DataGridDetailPanel>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {enablePagination && (
            <DataGridPagination table={table} className={cn(stickyFooter && "sticky bottom-0 z-10 bg-background")} />
          )}
        </div>
      </DndProvider>
    </DataGridContext.Provider>
  )
}
