"use client"

import { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import { Input } from "@repo/ui/input";
import { Button } from "@repo/ui/button";
import { Checkbox } from "@repo/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@repo/ui/select";
import Link from "next/link";
import { format } from "date-fns";

type SalesRecord = {
    id: string;
    name: string;
    totalAmountDue: number;
    city: string | null;
    hotelExpiry: string | null;
    status: string | null;
    phoneNumber: string | null;
    isActive: boolean;
    lastPaymentDate: string | null;
    lastRiceSupplyDate: string | null;
};

function formatDate(dateString: string | null): string {
    if (!dateString) return "-";
    try {
        return format(new Date(dateString), "dd MMM yyyy");
    } catch {
        return "-";
    }
}

function getHotelExpiryLabel(expiry: string | null): string {
    switch (expiry) {
        case "continue": return "Continue";
        case "uncontinue": return "Uncontinue";
        case "not_to_give": return "Not to Give";
        default: return "Not set";
    }
}

export default function ActiveSalesPage() {
    const [allSales, setAllSales] = useState<SalesRecord[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [searchName, setSearchName] = useState("");
    const [cityFilter, setCityFilter] = useState<string[]>([]);
    const [hotelExpiryFilter, setHotelExpiryFilter] = useState<string>("all");

    // Fetch
    const fetchSalesOverview = useCallback(async () => {
        const baseUri = process.env.NEXT_PUBLIC_UI_BASE_URI;
        try {
            setLoading(true);
            const response = await axios.get(`${baseUri}/getSalesOverview`);
            if (response.status === 200) {
                setAllSales(response.data.data);
            }
        } catch (err) {
            console.error("Error fetching sales overview:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSalesOverview();
    }, [fetchSalesOverview]);

    // Only active records
    const activeSales = useMemo(() => allSales.filter((s) => s.isActive), [allSales]);

    // Unique cities from active sales
    const uniqueCities = useMemo(() => {
        const cities = activeSales
            .map((s) => s.city)
            .filter((c): c is string => !!c && c.trim() !== "");
        return [...new Set(cities)].sort();
    }, [activeSales]);

    // Apply filters
    const filteredSales = useMemo(() => {
        return activeSales
            .filter((s) => {
                const matchesName = searchName === "" || s.name.toLowerCase().includes(searchName.toLowerCase());
                const matchesCity = cityFilter.length === 0 || cityFilter.includes(s.city || "");
                let matchesExpiry = true;
                if (hotelExpiryFilter !== "all") {
                    matchesExpiry = s.hotelExpiry === hotelExpiryFilter;
                }
                return matchesName && matchesCity && matchesExpiry;
            })
            .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
    }, [activeSales, searchName, cityFilter, hotelExpiryFilter]);

    // Live total of filtered rows
    const filteredTotal = useMemo(
        () => filteredSales.reduce((sum, s) => sum + s.totalAmountDue, 0),
        [filteredSales]
    );

    // PDF download
    const handleDownloadPDF = useCallback(() => {
        if (filteredSales.length === 0) {
            alert("No data to export.");
            return;
        }

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // Title
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text("Active Sales Report", pageWidth / 2, 20, { align: "center" });

        // Date
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        const today = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
        doc.text("Generated on: " + today, pageWidth / 2, 28, { align: "center" });

        // Filter info
        let filterY = 34;
        const filterParts: string[] = [];
        if (searchName) filterParts.push(`Hotel: "${searchName}"`);
        if (cityFilter.length > 0) filterParts.push(`City: ${cityFilter.join(", ")}`);
        if (hotelExpiryFilter !== "all") filterParts.push(`Status: ${getHotelExpiryLabel(hotelExpiryFilter)}`);
        if (filterParts.length > 0) {
            doc.setFontSize(9);
            doc.setTextColor(100, 100, 100);
            doc.text("Filters: " + filterParts.join(" | "), pageWidth / 2, filterY, { align: "center" });
            filterY += 6;
        }

        // Table header
        const startY = filterY + 8;
        const leftMargin = 15;
        const colWidths = { name: 80, city: 35, expiry: 35, amount: 35 };

        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.setFillColor(66, 133, 244);
        doc.rect(leftMargin, startY - 6, colWidths.name + colWidths.city + colWidths.expiry + colWidths.amount, 10, "F");
        doc.setTextColor(255, 255, 255);
        doc.text("Hotel Name", leftMargin + 3, startY);
        doc.text("City", leftMargin + colWidths.name + 3, startY);
        doc.text("Expiry Status", leftMargin + colWidths.name + colWidths.city + 3, startY);
        doc.text("Amount Due", leftMargin + colWidths.name + colWidths.city + colWidths.expiry + 3, startY);

        // Rows
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        let currentY = startY + 12;
        let runningTotal = 0;

        filteredSales.forEach((item, index) => {
            if (currentY > 270) {
                doc.addPage();
                currentY = 20;
            }
            if (index % 2 === 0) {
                doc.setFillColor(245, 247, 250);
                doc.rect(leftMargin, currentY - 6, colWidths.name + colWidths.city + colWidths.expiry + colWidths.amount, 10, "F");
            }
            doc.setFontSize(10);
            const hotelName = item.name.length > 28 ? item.name.substring(0, 28) + "..." : item.name;
            doc.text(hotelName, leftMargin + 3, currentY);
            doc.text(item.city || "-", leftMargin + colWidths.name + 3, currentY);
            doc.text(getHotelExpiryLabel(item.hotelExpiry), leftMargin + colWidths.name + colWidths.city + 3, currentY);

            const amountPrefix = item.totalAmountDue < 0 ? "(Adv) Rs." : item.totalAmountDue === 0 ? "(Paid) Rs." : "Rs.";
            doc.text(amountPrefix + Math.abs(item.totalAmountDue).toLocaleString("en-IN"), leftMargin + colWidths.name + colWidths.city + colWidths.expiry + 3, currentY);

            runningTotal += item.totalAmountDue;
            currentY += 10;
        });

        // Total row
        currentY += 5;
        doc.setFont("helvetica", "bold");
        doc.setFillColor(66, 133, 244);
        doc.rect(leftMargin, currentY - 6, colWidths.name + colWidths.city + colWidths.expiry + colWidths.amount, 10, "F");
        doc.setTextColor(255, 255, 255);
        doc.text("Total", leftMargin + 3, currentY);
        doc.text("Rs." + runningTotal.toLocaleString("en-IN"), leftMargin + colWidths.name + colWidths.city + colWidths.expiry + 3, currentY);

        // Footer
        doc.setTextColor(128, 128, 128);
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text(`Total Active Hotels: ${filteredSales.length}`, leftMargin, currentY + 15);

        const fileName = `active-sales-${today.replace(/\s/g, "-")}.pdf`;
        doc.save(fileName);
    }, [filteredSales, searchName, cityFilter, hotelExpiryFilter]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col p-3 sm:p-4 md:p-6 lg:p-8 xl:p-20 min-h-screen">
            {/* Header */}
            <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-6">
                <div>
                    <h1 className="text-black text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
                        Active Sales
                    </h1>
                    <p className="text-gray-600 text-sm sm:text-base mt-1">
                        Hotels currently marked as active
                    </p>
                </div>
                <Link href="/salesOverview">
                    <button className="text-sm text-blue-600 underline hover:text-blue-800">
                        ← Back to Sales Overview
                    </button>
                </Link>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow-sm border p-4">
                    <h3 className="text-sm font-medium text-gray-500">Total Active Hotels</h3>
                    <p className="text-2xl font-bold text-gray-800">{activeSales.length}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border p-4">
                    <h3 className="text-sm font-medium text-gray-500">Filtered Hotels</h3>
                    <p className="text-2xl font-bold text-gray-800">{filteredSales.length}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border p-4">
                    <h3 className="text-sm font-medium text-gray-500">Total Amount Due (Filtered)</h3>
                    <p className={`text-2xl font-bold ${filteredTotal > 0 ? "text-red-600" : filteredTotal < 0 ? "text-blue-600" : "text-green-600"}`}>
                        ₹{Math.abs(filteredTotal).toLocaleString("en-IN")}
                        {filteredTotal < 0 && <span className="text-sm font-normal ml-1">(Advance)</span>}
                    </p>
                </div>
            </div>

            {/* Filter Controls */}
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
                <h2 className="text-sm font-semibold text-gray-700 mb-3">Filters</h2>
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search by hotel name */}
                    <Input
                        placeholder="Search by hotel name..."
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        className="flex-1 rounded-lg text-base h-11 border-gray-300 focus:border-blue-500"
                    />

                    {/* Hotel Expiry filter */}
                    <div className="sm:w-52">
                        <Select value={hotelExpiryFilter} onValueChange={setHotelExpiryFilter}>
                            <SelectTrigger className="h-11 border-gray-300">
                                <SelectValue placeholder="Filter by expiry status" />
                            </SelectTrigger>
                            <SelectContent className="bg-white rounded-xl border z-[50]">
                                <SelectItem className="text-gray-900 focus:bg-blue-50 focus:rounded-lg" value="all">All Statuses</SelectItem>
                                <SelectItem className="text-gray-900 focus:bg-blue-50 focus:rounded-lg" value="continue">Continue</SelectItem>
                                <SelectItem className="text-gray-900 focus:bg-blue-50 focus:rounded-lg" value="uncontinue">Uncontinue</SelectItem>
                                <SelectItem className="text-gray-900 focus:bg-blue-50 focus:rounded-lg" value="not_to_give">Not to Give</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Clear filters */}
                    {(searchName || cityFilter.length > 0 || hotelExpiryFilter !== "all") && (
                        <Button
                            variant="outline"
                            onClick={() => { setSearchName(""); setCityFilter([]); setHotelExpiryFilter("all"); }}
                            className="h-11 px-4 border-gray-300 text-gray-600 hover:bg-gray-100"
                        >
                            Clear Filters
                        </Button>
                    )}
                </div>

                {/* City multi-select */}
                {uniqueCities.length > 0 && (
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                        <span className="text-sm text-gray-500 font-medium">Cities:</span>
                        {uniqueCities.map((city) => (
                            <label key={city} className="flex items-center gap-1.5 cursor-pointer">
                                <Checkbox
                                    checked={cityFilter.includes(city)}
                                    onCheckedChange={(checked) => {
                                        if (checked) {
                                            setCityFilter((prev) => [...prev, city]);
                                        } else {
                                            setCityFilter((prev) => prev.filter((c) => c !== city));
                                        }
                                    }}
                                />
                                <span className="text-sm text-gray-700">{city}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-6">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px]">
                        <thead>
                            <tr className="bg-white border-b">
                                <th className="text-left text-xs font-semibold text-gray-700 px-4 py-3 whitespace-nowrap">#</th>
                                <th className="text-left text-xs font-semibold text-gray-700 px-4 py-3 whitespace-nowrap">Hotel Name</th>
                                <th className="text-left text-xs font-semibold text-gray-700 px-4 py-3 whitespace-nowrap">City</th>
                                <th className="text-left text-xs font-semibold text-gray-700 px-4 py-3 whitespace-nowrap">Expiry Status</th>
                                <th className="text-left text-xs font-semibold text-gray-700 px-4 py-3 whitespace-nowrap">Last Payment</th>
                                <th className="text-left text-xs font-semibold text-gray-700 px-4 py-3 whitespace-nowrap">Last Rice Supply</th>
                                <th className="text-right text-xs font-semibold text-gray-700 px-4 py-3 whitespace-nowrap">Amount Due</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSales.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-16 text-gray-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="text-4xl">📋</div>
                                            <div>No active sales found</div>
                                            <div className="text-sm text-gray-400">Try adjusting your filters</div>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredSales.map((item, index) => {
                                    const expiryColors: Record<string, string> = {
                                        continue: "bg-green-100 text-green-800",
                                        uncontinue: "bg-orange-100 text-orange-800",
                                        not_to_give: "bg-red-100 text-red-800",
                                    };
                                    const expiryClass = expiryColors[item.hotelExpiry || ""] || "bg-gray-100 text-gray-500";

                                    return (
                                        <tr key={item.id} className="border-b bg-white hover:bg-blue-50 transition-colors">
                                            <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
                                            <td className="px-4 py-3">
                                                <Link href={`/sales/${item.id}`} className="text-blue-600 hover:text-blue-800 font-semibold text-sm hover:underline">
                                                    {item.name}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-700">{item.city || <span className="text-gray-400 italic">Not set</span>}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${expiryClass}`}>
                                                    {getHotelExpiryLabel(item.hotelExpiry)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{formatDate(item.lastPaymentDate)}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{formatDate(item.lastRiceSupplyDate)}</td>
                                            <td className="px-4 py-3 text-right">
                                                <span className={`font-bold text-sm ${item.totalAmountDue > 0 ? "text-red-600" : item.totalAmountDue < 0 ? "text-blue-600" : "text-green-600"}`}>
                                                    ₹{Math.abs(item.totalAmountDue).toLocaleString("en-IN")}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                        {filteredSales.length > 0 && (
                            <tfoot>
                                <tr className="bg-blue-600">
                                    <td colSpan={6} className="px-4 py-3 text-sm font-bold text-white">
                                        Total ({filteredSales.length} hotels)
                                    </td>
                                    <td className="px-4 py-3 text-right text-sm font-bold text-white">
                                        ₹{Math.abs(filteredTotal).toLocaleString("en-IN")}
                                        {filteredTotal < 0 && " (Adv)"}
                                    </td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
            </div>

            {/* Download Button */}
            <div className="flex justify-end">
                <Button
                    onClick={handleDownloadPDF}
                    disabled={filteredSales.length === 0}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md hover:shadow-lg transition-all duration-300 px-6 py-3 text-sm font-semibold"
                >
                    📥 Download PDF ({filteredSales.length} hotels · ₹{Math.abs(filteredTotal).toLocaleString("en-IN")})
                </Button>
            </div>
        </div>
    );
}
