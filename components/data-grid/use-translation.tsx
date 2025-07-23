"use client"

import * as React from "react"

// Default translations
const defaultTranslations = {
  search: "Search...",
  noDataAvailable: "No data available",
  noDataDescription: "There are no records to display",
  noResultsFound: "No results found",
  rowsSelected: "{count} row(s) selected",
  rowsPerPage: "Rows per page",
  pageXOfY: "Page {current} of {total}",
  firstPage: "First page",
  previousPage: "Previous page",
  nextPage: "Next page",
  lastPage: "Last page",
  view: "View",
  toggleColumns: "Toggle columns",
  filtersSelected: "{count} selected",
  resetFilters: "Reset filters",
  removeFilter: "Remove filter",
  selectAll: "Select all",
  selectRow: "Select row",
  sortAscending: "Sort ascending",
  sortDescending: "Sort descending",
  hideColumn: "Hide column",
  pinToLeft: "Pin to left",
  pinToRight: "Pin to right",
  unpin: "Unpin",
  density: "Density",
  compact: "Compact",
  normal: "Normal",
  spacious: "Spacious",
  fullScreen: "Full screen",
  exitFullScreen: "Exit full screen",
  pinColumns: "Pin columns",
  groupBy: "Group by",
  groupByColumn: "Group by column",
  export: "Export",
  exportCSV: "Export as CSV",
  exportJSON: "Export as JSON",
  exportExcel: "Export as Excel",
  copy: "Copy",
  edit: "Edit",
  delete: "Delete",
  viewDetails: "View details",
  openMenu: "Open menu",
}

export function useTranslation(customTranslations: Record<string, string> = {}) {
  // Merge default translations with custom translations
  const translations = React.useMemo(() => {
    return { ...defaultTranslations, ...customTranslations }
  }, [customTranslations])

  // Translation function
  const t = React.useCallback(
    (key: string, params?: Record<string, any>) => {
      let text = translations[key] || key

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          text = text.replace(`{${key}}`, value)
        })
      }

      return text
    },
    [translations],
  )

  return { t }
}
