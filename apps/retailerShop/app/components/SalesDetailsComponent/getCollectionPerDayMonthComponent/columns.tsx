"use client"

import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type GetCollectionPerDayMonthType = {
   amountPaid : string,
   amountPaidDescription : string,
   additionalDetails : string | null
}

export const columnsCollection: ColumnDef<GetCollectionPerDayMonthType>[] = [
    {
        accessorKey: "amountPaid",
        header: "Amount Paid",
    },

    {
        accessorKey: "amountPaidDescription",
        header: "Amount Paid Description",
    },

    {
        accessorKey: "additionalDetails",
        header: "Additional Details",
    }

]
