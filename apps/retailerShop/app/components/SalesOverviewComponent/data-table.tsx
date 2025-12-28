"use client"

import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    SortingState,
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@repo/ui/select"
import { Checkbox } from "@repo/ui/checkbox"
import { useState, useMemo } from "react"
import { SalesOverviewType } from "./columns"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    hiddenRows?: Set<string>
    selectedRows?: Set<string>
    onToggleSelect?: (id: string) => void
    cityFilter: string[]
    setCityFilter: (value: string[]) => void
    statusFilter: string
    setStatusFilter: (value: string) => void
    hotelExpiryFilter: string[]
    setHotelExpiryFilter: (value: string[]) => void
}

export function DataTable<TData extends SalesOverviewType, TValue>({
    columns,
    data,
    hiddenRows,
    selectedRows,
    onToggleSelect,
    cityFilter,
    setCityFilter,
    hotelExpiryFilter,
    setHotelExpiryFilter,
    statusFilter,
    setStatusFilter,
}: DataTableProps<TData, TValue>) {

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [sorting, setSorting] = useState<SortingState>([])

    // Get unique cities from data
    const uniqueCities = useMemo(() => {
        const cities = data
            .map(item => item.city)
            .filter((city): city is string => city !== null && city !== "")
        return [...new Set(cities)].sort()
    }, [data])

    // Get unique statuses from data
    const uniqueStatuses = useMemo(() => {
        const statuses = data
            .map(item => (item as any).status)
            .filter((s): s is string => s !== null && s !== "")
        return [...new Set(statuses)].sort()
    }, [data])

    // Filter data based on dropdown filters
    const filteredData = useMemo(() => {
        return data.filter(item => {
            const matchesCity = cityFilter.length === 0 || cityFilter.includes(item.city || "")
            const matchesHotelExpiry = hotelExpiryFilter.length === 0 || hotelExpiryFilter.includes(item.hotelExpiry || "")
            let matchesStatus = true
            if (statusFilter === "all") {
                matchesStatus = true
            } else if (statusFilter === "no-status") {
                matchesStatus = !(item as any).status || (item as any).status === ""
            } else {
                matchesStatus = (item as any).status === statusFilter
            }
            return matchesCity && matchesHotelExpiry && matchesStatus
        })
    }, [data, cityFilter, hotelExpiryFilter, statusFilter])

    const table = useReactTable({
        data: filteredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        state: {
            columnFilters,
            sorting,
        },
    })

    return (
        <div className="w-full bg-white rounded-lg shadow-sm border overflow-hidden">
            {/* Search and Filter Section */}
            <div className="p-3 sm:p-4 border-b">
                <div className="flex flex-col sm:flex-row gap-3 mb-3">
                    <Input
                        placeholder="Search by hotel name..."
                        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("name")?.setFilterValue(event.target.value)
                        }
                        className="flex-1 rounded-lg text-base h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 sm:max-w-[200px]">
                        <div className="flex flex-wrap items-center gap-2 h-12 px-3 border border-gray-300 rounded-lg bg-white overflow-auto max-h-40">
                            <span className="text-sm text-gray-500 mr-1">Cities:</span>
                            {uniqueCities.map(city => (
                                <label key={city} className="flex items-center gap-1.5 cursor-pointer">
                                    <Checkbox
                                        checked={cityFilter.includes(city)}
                                        onCheckedChange={(checked) => {
                                            if (checked) {
                                                setCityFilter([...cityFilter, city])
                                            } else {
                                                setCityFilter(cityFilter.filter(v => v !== city))
                                            }
                                        }}
                                    />
                                    <span className="text-sm text-gray-700">{city}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 sm:max-w-[200px]">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="h-12 border-gray-300">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent className="bg-white rounded-xl border z-[50]">
                                <SelectItem className="text-gray-900 focus:bg-blue-50 focus:rounded-lg" value="all">All Statuses</SelectItem>
                                <SelectItem className="text-gray-900 focus:bg-blue-50 focus:rounded-lg" value="no-status">No Status</SelectItem>
                                {uniqueStatuses.map(status => (
                                    <SelectItem key={status} className="text-gray-900 focus:bg-blue-50 focus:rounded-lg" value={status}>
                                        {status}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex-1 sm:max-w-[350px]">
                        <div className="flex flex-wrap items-center gap-3 h-12 px-3 border border-gray-300 rounded-lg bg-white">
                            <span className="text-sm text-gray-500 mr-1">Status:</span>
                            {[
                                { value: "continue", label: "Continue" },
                                { value: "uncontinue", label: "Uncontinue" },
                                { value: "not_to_give", label: "Not to Give" },
                            ].map(option => (
                                <label key={option.value} className="flex items-center gap-1.5 cursor-pointer">
                                    <Checkbox
                                        checked={hotelExpiryFilter.includes(option.value)}
                                        onCheckedChange={(checked) => {
                                            if (checked) {
                                                setHotelExpiryFilter([...hotelExpiryFilter, option.value])
                                            } else {
                                                setHotelExpiryFilter(hotelExpiryFilter.filter(v => v !== option.value))
                                            }
                                        }}
                                    />
                                    <span className="text-sm text-gray-700">{option.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    {(cityFilter.length > 0 || hotelExpiryFilter.length > 0) && (
                        <Button
                            variant="outline"
                            onClick={() => {
                                setCityFilter([])
                                setHotelExpiryFilter([])
                            }}
                            className="h-12 px-4 border-gray-300 text-gray-600 hover:bg-gray-100"
                        >
                            Clear Filters
                        </Button>
                    )}
                </div>
                
                {/* Bulk Selection Controls */}
                {selectedRows !== undefined && onToggleSelect && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-3 pt-3 border-t">
                        <div className="text-sm text-gray-600">
                            <span className="font-medium">{selectedRows.size}</span> of <span className="font-medium">{filteredData.length}</span> rows selected
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    filteredData.forEach(item => {
                                        if (!selectedRows.has(item.id)) {
                                            onToggleSelect(item.id);
                                        }
                                    });
                                }}
                                className="h-9 px-3 border-blue-500 text-blue-600 hover:bg-blue-50"
                            >
                                Select All Visible
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    filteredData.forEach(item => {
                                        if (selectedRows.has(item.id)) {
                                            onToggleSelect(item.id);
                                        }
                                    });
                                }}
                                className="h-9 px-3 border-gray-300 text-gray-600 hover:bg-gray-100"
                            >
                                Deselect All Visible
                            </Button>
                        </div>
                    </div>
                )}
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
                            table.getRowModel().rows.map((row) => {
                                const isHidden = hiddenRows?.has(row.original.id) || false
                                const isSelected = selectedRows?.has(row.original.id) || false
                                return (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                        className={
                                            isHidden 
                                                ? "opacity-50 bg-gray-50" 
                                                : isSelected 
                                                    ? "bg-blue-50 hover:bg-blue-100" 
                                                    : ""
                                        }
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className={`text-xs sm:text-sm px-3 sm:px-4 py-3 sm:py-4 align-middle mobile-text ${isHidden ? "line-through" : ""}`}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                )
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-32 text-center text-gray-500 text-base">
                                    <div className="flex flex-col items-center justify-center space-y-2">
                                        <div className="text-4xl">📊</div>
                                        <div>No results found</div>
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
