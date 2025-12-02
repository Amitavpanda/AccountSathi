"use client"

import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type SalesInfoType = {
    id : string
    name: string,
    phoneNumber: string,
    address: string,
    propieder : string,
    totalAmountDue: number,
    accountDetails : string,
    additionalDetails : string,
    city: string | null
}

// Function to create columns with edit capability
export function createColumns(onEdit?: (salesInfo: SalesInfoType) => void): ColumnDef<SalesInfoType>[] {
    return getColumnsWithEdit(onEdit);
}

function getColumnsWithEdit(onEdit?: (salesInfo: SalesInfoType) => void): ColumnDef<SalesInfoType>[] {
    return [
        {
            accessorKey: "name",
            header: "Hotel Name",
            cell: ({ row }) => (
                <div className="font-semibold text-sm sm:text-base text-gray-900 leading-tight">
                    {row.getValue("name")}
                </div>
            ),
        },
        {
            accessorKey: "phoneNumber",
            header: "Phone",
            cell: ({ row }) => (
                <div className="text-sm text-gray-600 font-mono">
                    {row.getValue("phoneNumber")}
                </div>
            ),
        },
        {
            accessorKey: "address",
            header: "Address",
            cell: ({ row }) => (
                <div className="text-sm text-gray-600 max-w-32 sm:max-w-none truncate leading-tight">
                    {row.getValue("address")}
                </div>
            ),
        },
        {
            accessorKey: "propieder",
            header: "Owner",
            cell: ({ row }) => (
                <div className="text-sm text-gray-700 font-medium">
                    {row.getValue("propieder")}
                </div>
            ),
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
            accessorKey: "totalAmountDue",
            header: "Amount Due",
            cell: ({ row }) => {
                const amount = parseFloat(row.getValue("totalAmountDue"))
                return (
                    <div className="font-bold text-green-600 text-base sm:text-lg">
                        ₹{amount.toLocaleString('en-IN')}
                    </div>
                )
            },
        },
        {
            accessorKey: "accountDetails",
            header: "Account",
            cell: ({ row }) => (
                <div className="text-sm text-gray-600 max-w-24 sm:max-w-none truncate font-mono">
                    {row.getValue("accountDetails")}
                </div>
            ),
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const salesInfo = row.original

                return (
                    <div className="flex gap-2">
                        {onEdit && (
                            <button 
                                onClick={() => onEdit(salesInfo)}
                                className="px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 min-h-[44px] mobile-button touch-target bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white border-0"
                            >
                                Edit
                            </button>
                        )}
                        <Link href={`/sales/${salesInfo.id}`}>
                            <button className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 min-h-[44px] min-w-[100px] mobile-button touch-target bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0">
                                View Details
                            </button>
                        </Link>
                    </div>
                )
            },
        },
    ];
}

// Default columns for backwards compatibility (without edit)
export const columns: ColumnDef<SalesInfoType>[] = createColumns();

