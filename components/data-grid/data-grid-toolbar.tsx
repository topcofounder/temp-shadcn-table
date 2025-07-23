"use client"
import type { Table } from "@tanstack/react-table"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataGridViewOptions } from "./data-grid-view-options"
import { DataGridFacetedFilter } from "./data-grid-faceted-filter"
import { useDataGrid } from "./data-grid-context"
import { DataGridDensityToggle } from "./data-grid-density-toggle"
import { DataGridFullScreenToggle } from "./data-grid-full-screen-toggle"
import { DataGridColumnPinning } from "./data-grid-column-pinning"
import { DataGridGrouping } from "./data-grid-grouping"
import { DataGridExport } from "./data-grid-export"
import { cn } from "@/lib/utils"

interface DataGridToolbarProps<TData> {
  table: Table<TData>
  className?: string
}

export function DataGridToolbar<TData>({ table, className }: DataGridToolbarProps<TData>) {
  const {
    enableGlobalFilter,
    enableColumnVisibility,
    enableFiltering,
    enableGrouping,
    enableColumnPinning,
    enableDensityToggle,
    enableFullScreen,
    enableExport,
    t,
  } = useDataGrid()

  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className={cn("flex flex-wrap items-center justify-between gap-2 p-4", className)}>
      <div className="flex flex-1 flex-wrap items-center gap-2">
        {/* Global filter */}
        {enableGlobalFilter && (
          <div className="flex flex-1 items-center gap-2">
            <Input
              placeholder={t("search")}
              value={(table.getState().globalFilter as string) ?? ""}
              onChange={(event) => table.setGlobalFilter(event.target.value)}
              className="h-8 w-[150px] lg:w-[250px]"
            />
          </div>
        )}

        {/* Column filters */}
        {enableFiltering && table.getState().columnFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-1">
            {table.getState().columnFilters.map((filter) => {
              const column = table.getColumn(filter.id)
              if (!column) return null

              return (
                <div key={filter.id} className="flex items-center rounded-md border px-2 py-1 text-sm">
                  <span className="mr-1 font-medium">{column.columnDef.header?.toString()}:</span>
                  <span>{Array.isArray(filter.value) ? filter.value.join(", ") : filter.value?.toString()}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-1 h-4 w-4"
                    onClick={() => column.setFilterValue(undefined)}
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">{t("removeFilter")}</span>
                  </Button>
                </div>
              )
            })}
            <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={() => table.resetColumnFilters()}>
              {t("resetFilters")}
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Faceted filters */}
        {enableFiltering &&
          table.getAllColumns().map((column) => {
            if (!column.getCanFilter()) return null

            return (
              <DataGridFacetedFilter
                key={column.id}
                column={column}
                title={column.columnDef.header?.toString() || column.id}
              />
            )
          })}

        {/* Grouping */}
        {enableGrouping && <DataGridGrouping table={table} />}

        {/* Column pinning */}
        {enableColumnPinning && <DataGridColumnPinning table={table} />}

        {/* Export */}
        {enableExport && <DataGridExport table={table} />}

        {/* Density toggle */}
        {enableDensityToggle && <DataGridDensityToggle />}

        {/* Full screen toggle */}
        {enableFullScreen && <DataGridFullScreenToggle />}

        {/* Column visibility */}
        {enableColumnVisibility && <DataGridViewOptions table={table} />}
      </div>
    </div>
  )
}
