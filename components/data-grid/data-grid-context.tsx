"use client"

import * as React from "react"

interface DataGridContextValue {
  density: "compact" | "normal" | "spacious"
  setDensity: React.Dispatch<React.SetStateAction<"compact" | "normal" | "spacious">>
  fullScreen: boolean
  setFullScreen: React.Dispatch<React.SetStateAction<boolean>>
  enableColumnResizing: boolean
  enableSorting: boolean
  enableFiltering: boolean
  enableColumnVisibility: boolean
  enablePagination: boolean
  enableGrouping: boolean
  enableColumnPinning: boolean
  enableRowSelection: boolean
  enableGlobalFilter: boolean
  enableCopy: boolean
  enableExport: boolean
  enableDensityToggle: boolean
  enableFullScreen: boolean
  t: (key: string) => string
}

export const DataGridContext = React.createContext<DataGridContextValue>({
  density: "normal",
  setDensity: () => {},
  fullScreen: false,
  setFullScreen: () => {},
  enableColumnResizing: false,
  enableSorting: true,
  enableFiltering: true,
  enableColumnVisibility: true,
  enablePagination: true,
  enableGrouping: false,
  enableColumnPinning: false,
  enableRowSelection: false,
  enableGlobalFilter: true,
  enableCopy: true,
  enableExport: true,
  enableDensityToggle: true,
  enableFullScreen: true,
  t: (key: string) => key,
})

export const useDataGrid = () => React.useContext(DataGridContext)
