"use client"

import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    getFilteredRowModel,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@repo/ui/table"
import { Button } from "@repo/ui/button"
import { Input } from "@repo/ui/input"
import { useState } from "react"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}

export function DataTable<TData, TValue>({
    columns,
    data,
}: DataTableProps<TData, TValue>) {

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
        []
    )

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),

        state: {
            columnFilters,
        },

    })

    return (
        <div className="w-full bg-white rounded-lg shadow-sm border overflow-hidden">
            {/* Search Section */}
            <div className="p-3 sm:p-4 border-b">
                <Input
                    placeholder="Search by supplier name..."
                    value={(table.getColumn("nameOfTheSupplier")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("nameOfTheSupplier")?.setFilterValue(event.target.value)
                    }
                    className="w-full max-w-full rounded-lg text-base h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
            </div>

            {/* Table Section */}
            <div className="table-mobile-scroll mobile-scroll">
                <Table className="w-full min-w-[800px]">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} className="text-xs sm:text-sm font-semibold text-gray-700 px-3 sm:px-4 py-3 sm:py-4 whitespace-nowrap mobile-text">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="transition-colors"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="text-xs sm:text-sm px-3 sm:px-4 py-3 sm:py-4 align-top mobile-text">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-32 text-center text-gray-500 text-base">
                                    <div className="flex flex-col items-center justify-center space-y-2">
                                        <div className="text-4xl">📦</div>
                                        <div>No suppliers found</div>
                                        <div className="text-sm text-gray-400">Try adjusting your search</div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Section */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 sm:p-4 border-t">
                <div className="text-sm text-gray-600 order-2 sm:order-1">
                    Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)} of {table.getFilteredRowModel().rows.length} entries
                </div>
                <div className="flex gap-2 order-1 sm:order-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="h-10 px-4 text-sm font-medium border-gray-300 disabled:opacity-50"
                    >
                        ← Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="h-10 px-4 text-sm font-medium border-gray-300 disabled:opacity-50"
                    >
                        Next →
                    </Button>
                </div>
            </div>
        </div>
    )
}
