"use client"

import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type PurchaseInfoType = {
    id : string
    nameOfTheSupplier: string,
    phoneNumber: string,
    address: string,
    totalAmountDue: number,
    listOfItems: string
    accountDetails : string,
    additionalDetails : string
}

export const columns: ColumnDef<PurchaseInfoType>[] = [
    {
        accessorKey: "nameOfTheSupplier",
        header: "Supplier Name",
        cell: ({ row }) => (
            <div className="font-semibold text-sm sm:text-base text-gray-900 leading-tight">
                {row.getValue("nameOfTheSupplier")}
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
        accessorKey: "totalAmountDue",
        header: "Amount Due",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("totalAmountDue"))
            return (
                <div className="font-bold text-red-600 text-base sm:text-lg">
                    ₹{amount.toLocaleString('en-IN')}
                </div>
            )
        },
    },
    {
        accessorKey: "listOfItems",
        header: "Items",
        cell: ({ row }) => (
            <div className="text-sm text-gray-600 max-w-24 sm:max-w-none truncate leading-tight">
                {row.getValue("listOfItems")}
            </div>
        ),
    },
    {
        accessorKey: "accountDetails",
        header: "Account",
        cell: ({ row }) => (
            <div className="text-sm text-gray-600 max-w-24 sm:max-w-none truncate font-mono leading-tight">
                {row.getValue("accountDetails")}
            </div>
        ),
    },
    {
        accessorKey: "additionalDetails",
        header: "Notes",
        cell: ({ row }) => (
            <div className="text-sm text-gray-600 max-w-24 sm:max-w-none truncate leading-tight">
                {row.getValue("additionalDetails")}
            </div>
        ),
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const purchaseInfo = row.original

            return (
                <Link href={`/purchase/${purchaseInfo.id}`}>
                    <button className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 min-h-[44px] min-w-[100px] mobile-button touch-target bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white border-0">
                        View Details
                    </button>
                </Link>
            )
        },
    },
]
