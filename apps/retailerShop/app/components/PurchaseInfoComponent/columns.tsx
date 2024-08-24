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
        header: "Name",
    },
    {
        accessorKey: "phoneNumber",
        header: "Phone Number",
    },
    {
        accessorKey: "address",
        header: "Address",
    },

    {
        accessorKey: "totalAmountDue",
        header: "TotalAmountDue",
    },

    {
        accessorKey: "listOfItems",
        header: "ListOfItems",
    },
    {
        accessorKey: "accountDetails",
        header: "Account Details",
    },
    {
        accessorKey: "additionalDetails",
        header: "Additional Details",
    },

    {
        id: "actions",
        cell: ({ row }) => {
            const purchaseInfo = row.original

            return (
                <>

                        <Link href={`/purchase/${purchaseInfo.id}`}>
                            <h1>Details</h1>
                        </Link>
                </>
            )
    },
  },
]
