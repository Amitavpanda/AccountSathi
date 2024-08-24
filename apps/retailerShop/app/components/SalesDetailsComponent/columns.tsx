"use client"

import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type SalesDetailsType = {
    id : string
    stockName: string,
    stockNameDetails : string,
    date: string,
    quantity: string,
    quantityType : string,
    quantityDetails : string,
    price: number,
    priceDetails : string,
    amount : string,
    totalAmountDue : string,
    amountPaid : string,
    amountPaidDescription : string,
    dateDescription : string
    salesInfoId : string
    hotelName : string,
    additionalDetails1 : string,
    additionalDetails2 : string,
    supplierName : string
}

export const columns: ColumnDef<SalesDetailsType>[] = [
    {
        accessorKey: "stockName",
        header: "Stock Name",
    },
    {
        accessorKey: "stockNameDetails",
        header: "Stock Name Details",
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
        accessorKey: "quantityType",
        header: "Quantity Type",
    },
    {
        accessorKey: "quantityDetails",
        header: "Quantity Details",
    },
    {
        accessorKey: "price",
        header: "Price",
    },
    {
        accessorKey: "priceDetails",
        header: "Price Details",
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
    {
        accessorKey : "hotelName",
        header : "hotelName"
    },
    {
        accessorKey : "supplierName",
        header : "Supplier"
    },
    {
        accessorKey: "additionalDetails1",
        header: "Additional Details 1",
    },
    {
        accessorKey: "additionalDetails2",
        header: "Additional Details 2",
    },


]
