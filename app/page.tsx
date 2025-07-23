"use client"

import * as React from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DataGrid } from "@/components/data-grid/data-grid"
import { Badge } from "@/components/ui/badge"

// Define the data type
type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
  name: string
  createdAt: string
  category: string
  priority: "low" | "medium" | "high"
}

// Sample data
const data: Payment[] = [
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
    name: "Michael Scott",
    createdAt: "2023-01-01T12:00:00",
    category: "Subscription",
    priority: "low",
  },
  {
    id: "489e1d42",
    amount: 125,
    status: "processing",
    email: "j@example.com",
    name: "Jim Halpert",
    createdAt: "2023-01-02T12:00:00",
    category: "One-time",
    priority: "medium",
  },
  {
    id: "6a37dd12",
    amount: 300,
    status: "success",
    email: "p@example.com",
    name: "Pam Beesly",
    createdAt: "2023-01-03T12:00:00",
    category: "Subscription",
    priority: "high",
  },
  {
    id: "9b5c1b2a",
    amount: 75,
    status: "failed",
    email: "d@example.com",
    name: "Dwight Schrute",
    createdAt: "2023-01-04T12:00:00",
    category: "One-time",
    priority: "low",
  },
  {
    id: "4c8f7d33",
    amount: 250,
    status: "success",
    email: "a@example.com",
    name: "Angela Martin",
    createdAt: "2023-01-05T12:00:00",
    category: "Subscription",
    priority: "medium",
  },
  {
    id: "7e2f5b19",
    amount: 175,
    status: "pending",
    email: "k@example.com",
    name: "Kevin Malone",
    createdAt: "2023-01-06T12:00:00",
    category: "One-time",
    priority: "high",
  },
  {
    id: "1a9e4c87",
    amount: 225,
    status: "processing",
    email: "o@example.com",
    name: "Oscar Martinez",
    createdAt: "2023-01-07T12:00:00",
    category: "Subscription",
    priority: "low",
  },
  {
    id: "5d3b2e8f",
    amount: 150,
    status: "success",
    email: "s@example.com",
    name: "Stanley Hudson",
    createdAt: "2023-01-08T12:00:00",
    category: "One-time",
    priority: "medium",
  },
  {
    id: "2c7d9f4e",
    amount: 350,
    status: "failed",
    email: "r@example.com",
    name: "Ryan Howard",
    createdAt: "2023-01-09T12:00:00",
    category: "Subscription",
    priority: "high",
  },
  {
    id: "8b6a3f1d",
    amount: 125,
    status: "pending",
    email: "c@example.com",
    name: "Creed Bratton",
    createdAt: "2023-01-10T12:00:00",
    category: "One-time",
    priority: "low",
  },
  {
    id: "3e5c8a2b",
    amount: 275,
    status: "processing",
    email: "m@example.com",
    name: "Meredith Palmer",
    createdAt: "2023-01-11T12:00:00",
    category: "Subscription",
    priority: "medium",
  },
  {
    id: "9f4d1e7c",
    amount: 200,
    status: "success",
    email: "t@example.com",
    name: "Toby Flenderson",
    createdAt: "2023-01-12T12:00:00",
    category: "One-time",
    priority: "high",
  },
]

// Define columns
const columns: ColumnDef<Payment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="font-mono">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string

      return (
        <div className="flex items-center">
          <Badge
            variant={
              status === "success"
                ? "success"
                : status === "pending"
                  ? "warning"
                  : status === "processing"
                    ? "default"
                    : "destructive"
            }
            className="capitalize"
          >
            {status}
          </Badge>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)

      return <div className="font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const priority = row.getValue("priority") as string

      return (
        <div className="flex items-center">
          <Badge
            variant={priority === "high" ? "destructive" : priority === "medium" ? "default" : "outline"}
            className="capitalize"
          >
            {priority}
          </Badge>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
      return <div>{date.toLocaleDateString()}</div>
    },
  },
]

export default function Page() {
  // Use useMemo for the detail panel renderer to avoid recreating it on each render
  const renderDetailPanel = React.useMemo(() => {
    return (row: any) => {
      const payment = row.original as Payment

      return (
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">Payment Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Customer</p>
              <p>{payment.name}</p>
              <p>{payment.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Payment Info</p>
              <p>Amount: ${payment.amount}</p>
              <p>Status: {payment.status}</p>
              <p>Category: {payment.category}</p>
              <p>Priority: {payment.priority}</p>
            </div>
          </div>
        </div>
      )
    }
  }, [])

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Advanced DataGrid</CardTitle>
          <CardDescription>A comprehensive data grid component with all the features you need.</CardDescription>
        </CardHeader>
        <CardContent>
          <DataGrid
            columns={columns}
            data={data}
            enableRowSelection
            enableColumnResizing
            enableSorting
            enableFiltering
            enableColumnVisibility
            enablePagination
            enableGrouping
            enableExpanding
            enableColumnPinning
            enableDetailPanel
            enableFullScreen
            enableDensityToggle
            enableGlobalFilter
            enableCopy
            enableExport
            renderDetailPanel={renderDetailPanel}
            stickyHeader
            height={600}
          />
        </CardContent>
      </Card>
    </div>
  )
}
