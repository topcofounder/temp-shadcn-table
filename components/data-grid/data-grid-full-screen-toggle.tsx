"use client"
import { Maximize2, Minimize2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useDataGrid } from "./data-grid-context"

export function DataGridFullScreenToggle() {
  const { fullScreen, setFullScreen, t } = useDataGrid()

  return (
    <Button variant="outline" size="sm" className="h-8" onClick={() => setFullScreen(!fullScreen)}>
      {fullScreen ? (
        <>
          <Minimize2 className="mr-2 h-4 w-4" />
          {t("exitFullScreen")}
        </>
      ) : (
        <>
          <Maximize2 className="mr-2 h-4 w-4" />
          {t("fullScreen")}
        </>
      )}
    </Button>
  )
}
