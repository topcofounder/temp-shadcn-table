"use client"
import type { Table } from "@tanstack/react-table"
import { Pin } from "lucide-react"

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

interface DataGridColumnPinningProps<TData> {
  table: Table<TData>
}

export function DataGridColumnPinning<TData>({ table }: DataGridColumnPinningProps<TData>) {
  const { t } = useDataGrid()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <Pin className="mr-2 h-4 w-4" />
          {t("pinColumns")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t("pinToLeft")}</DropdownMenuLabel>
        {table
          .getAllColumns()
          .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanPin())
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={`left-${column.id}`}
                className="capitalize"
                checked={column.getIsPinned() === "left"}
                onCheckedChange={(value) => column.pin(value ? "left" : false)}
              >
                {column.columnDef.header?.toString() || column.id}
              </DropdownMenuCheckboxItem>
            )
          })}
        <DropdownMenuSeparator />
        <DropdownMenuLabel>{t("pinToRight")}</DropdownMenuLabel>
        {table
          .getAllColumns()
          .filter((column) => typeof column.accessorFn !== "undefined" && column.getCanPin())
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={`right-${column.id}`}
                className="capitalize"
                checked={column.getIsPinned() === "right"}
                onCheckedChange={(value) => column.pin(value ? "right" : false)}
              >
                {column.columnDef.header?.toString() || column.id}
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
