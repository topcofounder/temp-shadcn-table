"use client"
import { AlignJustify } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDataGrid } from "./data-grid-context"

export function DataGridDensityToggle() {
  const { density, setDensity, t } = useDataGrid()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <AlignJustify className="mr-2 h-4 w-4" />
          {t("density")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup value={density} onValueChange={(value) => setDensity(value as any)}>
          <DropdownMenuRadioItem value="compact">{t("compact")}</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="normal">{t("normal")}</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="spacious">{t("spacious")}</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
