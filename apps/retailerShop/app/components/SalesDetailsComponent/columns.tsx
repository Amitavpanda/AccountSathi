"use client"

import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { formatAmount } from "../../utils/formatters"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type SalesDetailsType = {
    id: string
    stockName: string,
    stockNameDetails: string,
    date: string,
    quantity: string,
    quantityType: string,
    quantityDetails: string,
    price: number,
    priceDetails: string,
    amount: string,
    totalAmountDue: string,
    amountPaid: string,
    amountPaidDescription: string,
    dateDescription: string
    salesInfoId: string
    hotelName: string,
    additionalDetails1: string,
    additionalDetails2: string,
    supplierName: string,
    isPaymentDone: string
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
        cell: ({ row }) => formatAmount(row.getValue("price")),
    },
    {
        accessorKey: "priceDetails",
        header: "Price Details",
    },
    {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => formatAmount(row.getValue("amount")),
    },

    {
        accessorKey: "totalAmountDue",
        header: "Total Amount Due",
        cell: ({ row }) => formatAmount(row.getValue("totalAmountDue")),
    },

    {
        accessorKey: "amountPaid",
        header: "Amount Paid",
        cell: ({ row }) => formatAmount(row.getValue("amountPaid")),
    },

    {
        accessorKey: "amountPaidDescription",
        header: "Amount Paid Description",
    },
    {
        accessorKey: "hotelName",
        header: "hotelName"
    },
    {
        accessorKey: "supplierName",
        header: "Supplier"
    },
    {
        accessorKey: "extraAmount",
        header: "Extra Amount",
        cell: ({ row }) => formatAmount(row.getValue("extraAmount")),
    },
    {
        accessorKey: "extraAmountDescription",
        header: "Extra Amount Description"
    },
    {
        accessorKey: "additionalDetails1",
        header: "Additional Details 1",
    },
    {
        accessorKey: "additionalDetails2",
        header: "Additional Details 2",
    },

    {
        accessorKey: "isPaymentDone",
        header: "Is Payment Done",
    },


]
