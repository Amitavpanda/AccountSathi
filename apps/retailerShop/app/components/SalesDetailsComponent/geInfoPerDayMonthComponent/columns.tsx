"use client"

import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type GetInfoPerDayMonthType = {
    name: string,
    quantity: string,
    price: number,
    amount : string,
    supplier : string
}

export const columns: ColumnDef<GetInfoPerDayMonthType>[] = [
    {
        accessorKey: "name",
        header: "Stock Name",
    },

    {
        accessorKey: "quantity",
        header: "Quantity",
    },

    {
        accessorKey: "price",
        header: "Price",
    },

    {
        accessorKey: "amount",
        header: "Amount",
    },

  
    {
        accessorKey : "supplier",
        header : "Supplier"
    }

]
