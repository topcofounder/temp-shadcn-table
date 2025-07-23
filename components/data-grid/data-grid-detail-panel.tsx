"use client"

import type * as React from "react"
import { cn } from "@/lib/utils"

interface DataGridDetailPanelProps {
  children: React.ReactNode
  className?: string
}

export function DataGridDetailPanel({ children, className }: DataGridDetailPanelProps) {
  return <div className={cn("p-4 bg-muted/50", className)}>{children}</div>
}
