"use client"

import * as React from "react"
import type { Table } from "@tanstack/react-table"
import { Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useDataGrid } from "./data-grid-context"

interface DataGridExportProps<TData> {
  table: Table<TData>
}

export function DataGridExport<TData>({ table }: DataGridExportProps<TData>) {
  const { t } = useDataGrid()

  const exportData = React.useCallback(
    (type: "csv" | "json" | "excel") => {
      const data = table.getFilteredRowModel().rows.map((row) => row.original)

      if (type === "csv") {
        const headers = table
          .getAllColumns()
          .filter((column) => column.getIsVisible())
          .map((column) => column.columnDef.header?.toString() || column.id)
          .join(",")

        const values = table
          .getFilteredRowModel()
          .rows.map((row) =>
            table
              .getAllColumns()
              .filter((column) => column.getIsVisible())
              .map((column) => {
                const cell = row.getAllCells().find((cell) => cell.column.id === column.id)
                return cell ? `"${String(cell.getValue()).replace(/"/g, '""')}"` : ""
              })
              .join(","),
          )
          .join("\n")

        const csv = `${headers}\n${values}`
        downloadFile(csv, "data.csv", "text/csv")
      } else if (type === "json") {
        const json = JSON.stringify(data, null, 2)
        downloadFile(json, "data.json", "application/json")
      } else if (type === "excel") {
        // For Excel, we'll use CSV format but with .xlsx extension
        // In a real app, you'd use a library like exceljs or xlsx
        const headers = table
          .getAllColumns()
          .filter((column) => column.getIsVisible())
          .map((column) => column.columnDef.header?.toString() || column.id)
          .join(",")

        const values = table
          .getFilteredRowModel()
          .rows.map((row) =>
            table
              .getAllColumns()
              .filter((column) => column.getIsVisible())
              .map((column) => {
                const cell = row.getAllCells().find((cell) => cell.column.id === column.id)
                return cell ? `"${String(cell.getValue()).replace(/"/g, '""')}"` : ""
              })
              .join(","),
          )
          .join("\n")

        const csv = `${headers}\n${values}`
        downloadFile(csv, "data.xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
      }
    },
    [table],
  )

  const downloadFile = (content: string, fileName: string, contentType: string) => {
    const a = document.createElement("a")
    const file = new Blob([content], { type: contentType })
    a.href = URL.createObjectURL(file)
    a.download = fileName
    a.click()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <Download className="mr-2 h-4 w-4" />
          {t("export")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => exportData("csv")}>{t("exportCSV")}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportData("json")}>{t("exportJSON")}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => exportData("excel")}>{t("exportExcel")}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
