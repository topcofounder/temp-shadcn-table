"use client"
import { type Header, type SortDirection, type Table, flexRender } from "@tanstack/react-table"
import { ChevronsUpDown, EyeOff, SortAsc, SortDesc } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDataGrid } from "./data-grid-context"

interface DataGridColumnHeaderProps<TData, TValue> {
  header: Header<TData, TValue>
  table: Table<TData>
}

export function DataGridColumnHeader<TData, TValue>({ header, table }: DataGridColumnHeaderProps<TData, TValue>) {
  const { enableSorting, enableFiltering, enableColumnVisibility, enableColumnPinning, t } = useDataGrid()
  const column = header.column
  const isResizing = column.getIsResizing()

  const sortIcon = {
    asc: <SortAsc className="ml-2 h-4 w-4" />,
    desc: <SortDesc className="ml-2 h-4 w-4" />,
    false: <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />,
  }

  return (
    <div className={cn("flex items-center space-x-2", isResizing && "select-none")}>
      {header.isPlaceholder ? null : enableSorting && column.getCanSort() ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="-ml-3 h-8 data-[state=open]:bg-accent">
              <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
              {column.getIsSorted() ? sortIcon[column.getIsSorted() as SortDirection] : sortIcon["false"]}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
              <SortAsc className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
              {t("sortAscending")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
              <SortDesc className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
              {t("sortDescending")}
            </DropdownMenuItem>
            {enableColumnVisibility && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
                  <EyeOff className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
                  {t("hideColumn")}
                </DropdownMenuItem>
              </>
            )}
            {enableColumnPinning && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => column.pin("left")}>{t("pinToLeft")}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => column.pin("right")}>{t("pinToRight")}</DropdownMenuItem>
                {column.getIsPinned() && (
                  <DropdownMenuItem onClick={() => column.pin(false)}>{t("unpin")}</DropdownMenuItem>
                )}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="font-medium">{flexRender(header.column.columnDef.header, header.getContext())}</div>
      )}
    </div>
  )
}
