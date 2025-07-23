"use client"
import type { Row } from "@tanstack/react-table"
import { Copy, Edit, MoreHorizontal, Trash, ChevronDown } from "lucide-react"
import React from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDataGrid } from "./data-grid-context"

interface DataGridRowActionsProps<TData> {
  row: Row<TData>
  enableEditing?: boolean
  enableDetailPanel?: boolean
  onEdit?: () => void
  onDelete?: () => void
  onViewDetails?: () => void
}

export function DataGridRowActions<TData>({
  row,
  enableEditing = false,
  enableDetailPanel = false,
  onEdit,
  onDelete,
  onViewDetails,
}: DataGridRowActionsProps<TData>) {
  const { t } = useDataGrid()

  // Use useCallback for event handlers to prevent recreation on each render
  const handleCopy = React.useCallback(() => {
    navigator.clipboard.writeText(JSON.stringify(row.original, null, 2))
  }, [row.original])

  const handleEdit = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onEdit?.()
    },
    [onEdit],
  )

  const handleDelete = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onDelete?.()
    },
    [onDelete],
  )

  const handleViewDetails = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onViewDetails?.()
    },
    [onViewDetails],
  )

  return (
    <div className="flex items-center justify-end">
      {enableDetailPanel && (
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleViewDetails}>
          <ChevronDown className="h-4 w-4" />
          <span className="sr-only">{t("viewDetails")}</span>
        </Button>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => e.stopPropagation()}>
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">{t("openMenu")}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleCopy}>
            <Copy className="mr-2 h-4 w-4" />
            {t("copy")}
          </DropdownMenuItem>

          {enableEditing && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" />
                {t("edit")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete}>
                <Trash className="mr-2 h-4 w-4" />
                {t("delete")}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
