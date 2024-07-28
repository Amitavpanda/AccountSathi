"use client"

import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type PurchaseDetailsType = {
    id : string
    stockName: string,
    date: string,
    quantity: string,
    price: number,
    amount : string,
    totalAmountDue : string,
    amountPaid : string,
    amountPaidDescription : string,
    dateDescription : string
    supplierPurchaseId : string
}

export const columns: ColumnDef<PurchaseDetailsType>[] = [
    {
        accessorKey: "stockName",
        header: "Stock Name",
    },
    {
        accessorKey: "date",
        header: "Date",
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
        accessorKey: "totalAmountDue",
        header: "Total Amount Due",
    },

    {
        accessorKey: "amountPaid",
        header: "Amount Paid",
    },

    {
        accessorKey: "amountPaidDescription",
        header: "Amount Paid Description",
    },

]
