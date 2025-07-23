"use client"
import type { Table } from "@tanstack/react-table"
import { Group } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDataGrid } from "./data-grid-context"

interface DataGridGroupingProps<TData> {
  table: Table<TData>
}

export function DataGridGrouping<TData>({ table }: DataGridGroupingProps<TData>) {
  const { t } = useDataGrid()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <Group className="mr-2 h-4 w-4" />
          {t("groupBy")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t("groupByColumn")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanGroup())
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsGrouped()}
                onCheckedChange={(value) => column.toggleGrouping(!!value)}
              >
                {column.columnDef.header?.toString() || column.id}
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
