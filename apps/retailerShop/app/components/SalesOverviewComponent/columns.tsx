"use client"

import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { format } from "date-fns"
import { Checkbox } from "@repo/ui/checkbox"

export type SalesOverviewType = {
    id: string
    name: string
    totalAmountDue: number
    city: string | null
    hotelExpiry: string | null
    status: string | null
    lastPaymentDate: string | null
    lastRiceSupplyDate: string | null
}

// Helper function to determine payment status based on amount
function getPaymentStatus(amount: number): { label: string; className: string } {
    if (amount === 0) {
        return { label: "Paid", className: "bg-green-100 text-green-800" }
    } else if (amount > 0) {
        return { label: "Pending", className: "bg-yellow-100 text-yellow-800" }
    } else {
        return { label: "Advance", className: "bg-blue-100 text-blue-800" }
    }
}

// Helper function to get hotel expiry display
function getHotelExpiryDisplay(expiry: string | null): { label: string; className: string } {
    switch (expiry) {
        case "continue":
            return { label: "Continue", className: "bg-green-100 text-green-800" }
        case "uncontinue":
            return { label: "Uncontinue", className: "bg-orange-100 text-orange-800" }
        case "not_to_give":
            return { label: "Not to Give", className: "bg-red-100 text-red-800" }
        default:
            return { label: "Not set", className: "bg-gray-100 text-gray-500" }
    }
}

// Helper function to format date
function formatDate(dateString: string | null): string {
    if (!dateString) return "-"
    try {
        return format(new Date(dateString), "dd MMM yyyy")
    } catch {
        return "-"
    }
}

// Function to create columns with edit handler, hide toggle, and select toggle
export function createColumns(
    onEdit?: (item: SalesOverviewType) => void,
    hiddenRows?: Set<string>,
    onToggleHide?: (id: string) => void,
    selectedRows?: Set<string>,
    onToggleSelect?: (id: string) => void
): ColumnDef<SalesOverviewType>[] {
    return [
        {
            id: "hideFromPdf",
            header: "Hide",
            cell: ({ row }) => {
                const isHidden = hiddenRows?.has(row.original.id) || false
                return (
                    <div className="flex items-center justify-center">
                        <Checkbox
                            checked={isHidden}
                            onCheckedChange={() => onToggleHide?.(row.original.id)}
                            aria-label="Hide from PDF"
                        />
                    </div>
                )
            },
        },
        {
            id: "selectForPdf",
            header: "Select",
            cell: ({ row }) => {
                const isSelected = selectedRows?.has(row.original.id) || false
                return (
                    <div className="flex items-center justify-center">
                        <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => onToggleSelect?.(row.original.id)}
                            aria-label="Select for PDF"
                        />
                    </div>
                )
            },
        },
        {
            accessorKey: "name",
            header: "Hotel Name",
            cell: ({ row }) => (
                <Link href={`/sales/${row.original.id}`} className="hover:underline">
                    <div className="font-semibold text-sm sm:text-base text-blue-600 hover:text-blue-800 leading-tight">
                        {row.getValue("name")}
                    </div>
                </Link>
            ),
        },
        {
            accessorKey: "totalAmountDue",
            header: "Amount",
            cell: ({ row }) => {
                const amount = parseFloat(row.getValue("totalAmountDue"))
                return (
                    <div className={`font-bold text-base sm:text-lg ${amount > 0 ? 'text-red-600' : amount < 0 ? 'text-blue-600' : 'text-green-600'}`}>
                        ₹{Math.abs(amount).toLocaleString('en-IN')}
                    </div>
                )
            },
        },
        {
            id: "paymentStatus",
            header: "Payment Status",
            cell: ({ row }) => {
                const amount = parseFloat(row.getValue("totalAmountDue"))
                const status = getPaymentStatus(amount)
                return (
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.className}`}>
                        {status.label}
                    </span>
                )
            },
        },
        {
            accessorKey: "city",
            header: "City",
            cell: ({ row }) => {
                const city = row.getValue("city") as string | null
                return (
                    <div className="text-sm text-gray-700">
                        {city || <span className="text-gray-400 italic">Not set</span>}
                    </div>
                )
            },
        },
        {
            accessorKey: "hotelExpiry",
            header: "Hotel Expiry",
            cell: ({ row }) => {
                const expiry = row.getValue("hotelExpiry") as string | null
                const display = getHotelExpiryDisplay(expiry)
                return (
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${display.className}`}>
                        {display.label}
                    </span>
                )
            },
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("status") as string | null
                return (
                    <div className="text-sm text-gray-700">
                        {status || <span className="text-gray-400 italic">-</span>}
                    </div>
                )
            },
        },
        {
            accessorKey: "lastPaymentDate",
            header: "Last Payment",
            cell: ({ row }) => {
                const date = row.getValue("lastPaymentDate") as string | null
                return (
                    <div className="text-sm text-gray-600">
                        {formatDate(date)}
                    </div>
                )
            },
        },
        {
            accessorKey: "lastRiceSupplyDate",
            header: "Last Rice Supply",
            cell: ({ row }) => {
                const date = row.getValue("lastRiceSupplyDate") as string | null
                return (
                    <div className="text-sm text-gray-600">
                        {formatDate(date)}
                    </div>
                )
            },
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const item = row.original
                return onEdit ? (
                    <button
                        onClick={() => onEdit(item)}
                        className="px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 min-h-[40px] bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white border-0"
                    >
                        Edit
                    </button>
                ) : null
            },
        },
    ]
}

// Default columns for backwards compatibility
export const columns: ColumnDef<SalesOverviewType>[] = createColumns()
