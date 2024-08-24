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
    additionalDetails : string
}

export const columns: ColumnDef<SalesInfoType>[] = [
    {
        accessorKey: "name",
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
        accessorKey: "propieder",
        header: "Propieder",
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
        accessorKey: "totalAmountDue",
        header: "TotalAmountDue",
    },



    {
        id: "actions",
        cell: ({ row }) => {
            const salesInfo = row.original

            return (
                <>

                        <Link href={`/sales/${salesInfo.id}`}>
                            <h1>Details</h1>
                        </Link>
                </>
            )
    },
  },
]
