"use client"

import { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import { error, info } from "@repo/logs/logs";
import { SalesOverviewType, createColumns } from "./columns";
import { DataTable } from "./data-table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@repo/ui/dialog"
import { Button } from "@repo/ui/button"
import { Input } from "@repo/ui/input"
import { Label } from "@repo/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@repo/ui/select"
import jsPDF from "jspdf"


function SalesOverviewList() {
    const [salesOverview, setSalesOverview] = useState<SalesOverviewType[]>([]);
    const [totalAmountDueSum, setTotalAmountDueSum] = useState<number | undefined>();
    const [loading, setLoading] = useState(true);

    // Edit dialog state
    const [editingItem, setEditingItem] = useState<SalesOverviewType | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [hotelNameValue, setHotelNameValue] = useState<string>("");
    const [hotelExpiryValue, setHotelExpiryValue] = useState<string>("");
    const [statusValue, setStatusValue] = useState<string>("");
    const [cityValue, setCityValue] = useState<string>("");
    const [phoneNumberValue, setPhoneNumberValue] = useState<string>("");
    const [isUpdating, setIsUpdating] = useState(false);

    // Hidden rows state for PDF export
    const [hiddenRows, setHiddenRows] = useState<Set<string>>(new Set());

    // Selected rows state for PDF export
    const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

    // Filter state (lifted from DataTable for PDF export access)
    const [cityFilter, setCityFilter] = useState<string[]>([]);
    const [hotelExpiryFilter, setHotelExpiryFilter] = useState<string[]>([]);
    const [statusFilter, setStatusFilter] = useState<string>("all");

    // Track selection order to preserve row order in PDF
    const [selectionOrder, setSelectionOrder] = useState<string[]>([]);

    const fetchSalesOverview = async () => {
        const baseUri = process.env.NEXT_PUBLIC_UI_BASE_URI;
        try {
            setLoading(true);
            const response = await axios.get(`${baseUri}/getSalesOverview`);
            info("the response of salesOverview is", response);
            if (response.status == 200) {
                console.log("the response.data is ", response.data.data);
                setSalesOverview(response.data.data);
                setTotalAmountDueSum(response.data.totalAmountDueSum);
            }
        }
        catch (err: any) {
            error("Error in getting the SalesOverview", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchSalesOverview();
    }, [])

    const handleEdit = (item: SalesOverviewType) => {
        setEditingItem(item);
        setHotelNameValue(item.name || "");
        setHotelExpiryValue(item.hotelExpiry || "");
        setStatusValue(item.status || "");
        setCityValue(item.city || "");
        setPhoneNumberValue(item.phoneNumber || "");
        setIsDialogOpen(true);
    };

    const handleSave = async () => {
        if (!editingItem) return;

        const baseUri = process.env.NEXT_PUBLIC_UI_BASE_URI;
        try {
            setIsUpdating(true);
            const response = await axios.put(`${baseUri}/updateSalesInfo`, {
                id: editingItem.id,
                name: hotelNameValue || undefined,
                hotelExpiry: hotelExpiryValue || undefined,
                status: statusValue || undefined,
                city: cityValue || undefined,
                phoneNumber: phoneNumberValue || undefined,
            });
            info("Update response:", response);
            if (response.status === 200) {
                // Update local state
                setSalesOverview(prev => prev.map(item =>
                    item.id === editingItem.id
                        ? {
                            ...item,
                            name: hotelNameValue || item.name,
                            hotelExpiry: hotelExpiryValue || null,
                            status: statusValue || null,
                            city: cityValue || null,
                            phoneNumber: phoneNumberValue || null
                        }
                        : item
                ));
                setIsDialogOpen(false);
                setEditingItem(null);
            }
        } catch (err: any) {
            error("Error updating SalesInfo:", err);
        } finally {
            setIsUpdating(false);
        }
    };

    // Toggle hide/show row for PDF export
    const handleToggleHide = useCallback((id: string) => {
        setHiddenRows(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    }, []);

    // Toggle select/deselect row for PDF export
    const handleToggleSelect = useCallback((id: string) => {
        setSelectedRows(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
                // Remove from selection order
                setSelectionOrder(order => order.filter(rowId => rowId !== id));
            } else {
                newSet.add(id);
                // Add to selection order
                setSelectionOrder(order => [...order, id]);
            }
            return newSet;
        });
    }, []);

    // Helper function to generate PDF for a given set of rows
    const generatePDF = useCallback((rows: SalesOverviewType[], filename: string, pdfType: "selected" | "deselected") => {
        if (rows.length === 0) {
            return;
        }

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // Title
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        const titleText = pdfType === "selected" ? "Sales Overview Report (Selected)" : "Sales Overview Report (Deselected)";
        doc.text(titleText, pageWidth / 2, 20, { align: "center" });

        // Date
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        const today = new Date().toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
        doc.text("Generated on: " + today, pageWidth / 2, 28, { align: "center" });

        // Filter info
        let filterInfoY = 28;
        if (cityFilter.length > 0 || hotelExpiryFilter.length > 0 || statusFilter !== "all") {
            doc.setFontSize(9);
            doc.setTextColor(100, 100, 100);
            let filterText = "Filters: ";
            if (cityFilter.length > 0) filterText += "City: " + cityFilter.join(", ") + " ";
            if (hotelExpiryFilter.length > 0) filterText += "Status: " + hotelExpiryFilter.join(", ");
            if (statusFilter !== "all") {
                filterText += "Status: " + (statusFilter === "no-status" ? "No Status" : statusFilter) + " ";
            }
            doc.text(filterText, pageWidth / 2, 34, { align: "center" });
            filterInfoY = 34;
        }

        // Table header
        const startY = filterInfoY + 10;
        const colWidths = { name: 100, amount: 50 };
        const leftMargin = 30;

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setFillColor(66, 133, 244);
        doc.rect(leftMargin, startY - 6, colWidths.name + colWidths.amount, 10, "F");
        doc.setTextColor(255, 255, 255);
        doc.text("Hotel Name", leftMargin + 5, startY);
        doc.text("Amount", leftMargin + colWidths.name + 5, startY);

        // Table rows
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        let currentY = startY + 12;
        let totalAmount = 0;

        rows.forEach((item, index) => {
            // Check if we need a new page
            if (currentY > 270) {
                doc.addPage();
                currentY = 20;
            }

            // Alternate row background
            if (index % 2 === 0) {
                doc.setFillColor(245, 247, 250);
                doc.rect(leftMargin, currentY - 6, colWidths.name + colWidths.amount, 10, "F");
            }

            doc.setFontSize(10);
            const hotelName = item.name.length > 35 ? item.name.substring(0, 35) + "..." : item.name;
            doc.text(hotelName, leftMargin + 5, currentY);

            // Use "Rs." instead of rupee symbol for PDF compatibility
            const amountValue = Math.abs(item.totalAmountDue).toLocaleString("en-IN");
            const amountPrefix = item.totalAmountDue < 0 ? "(Adv) Rs." : item.totalAmountDue === 0 ? "(Paid) Rs." : "Rs.";
            doc.text(amountPrefix + amountValue, leftMargin + colWidths.name + 5, currentY);

            totalAmount += item.totalAmountDue;
            currentY += 10;
        });

        // Total row
        currentY += 5;
        doc.setFont("helvetica", "bold");
        doc.setFillColor(66, 133, 244);
        doc.rect(leftMargin, currentY - 6, colWidths.name + colWidths.amount, 10, "F");
        doc.setTextColor(255, 255, 255);
        doc.text("Total", leftMargin + 5, currentY);
        doc.text("Rs." + totalAmount.toLocaleString("en-IN"), leftMargin + colWidths.name + 5, currentY);

        // Footer
        doc.setTextColor(128, 128, 128);
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text("Total Hotels: " + rows.length, leftMargin, currentY + 15);

        // Save
        doc.save(filename);
    }, [cityFilter, hotelExpiryFilter, statusFilter]);

    // Download both selected and deselected PDFs
    const handleDownloadBothPDFs = useCallback(() => {
        // First apply city, hotelExpiry and status filters
        let filteredRows = salesOverview.filter(item => {
            const matchesCity = cityFilter.length === 0 || cityFilter.includes(item.city || "");
            const matchesHotelExpiry = hotelExpiryFilter.length === 0 || hotelExpiryFilter.includes(item.hotelExpiry || "");
            let matchesStatus = true;
            if (statusFilter === "all") {
                matchesStatus = true;
            } else if (statusFilter === "no-status") {
                matchesStatus = !item.status || item.status === "";
            } else {
                matchesStatus = item.status === statusFilter;
            }
            return matchesCity && matchesHotelExpiry && matchesStatus;
        });

        // Then exclude hidden rows
        const visibleRows = filteredRows.filter(item => !hiddenRows.has(item.id));

        // Split into selected and deselected while preserving selection order for selected PDF
        // Create a map of visible rows for quick lookup
        const visibleMap = new Map<string, SalesOverviewType>(visibleRows.map(r => [r.id, r]));

        // Build selected rows preserving a mix of selection order and visible table order:
        // - Items present in `selectionOrder` will be ordered by that list
        // - Items not present in `selectionOrder` will preserve their visible table order
        const orderMap = new Map(selectionOrder.map((id, i) => [id, i]));
        const selectedInVisible = visibleRows
            .map((item, idx) => ({ item, idx }))
            .filter(({ item }) => selectedRows.has(item.id));

        selectedInVisible.sort((a, b) => {
            const aPos = orderMap.has(a.item.id) ? orderMap.get(a.item.id)! : Number.POSITIVE_INFINITY;
            const bPos = orderMap.has(b.item.id) ? orderMap.get(b.item.id)! : Number.POSITIVE_INFINITY;
            if (aPos === bPos) {
                return a.idx - b.idx; // preserve visible order for items not in selectionOrder
            }
            return aPos - bPos;
        });

        const selectedRowsData = selectedInVisible.map(x => x.item);

        // Deselected keep visibleRows order
        const deselectedRowsData = visibleRows.filter(item => !selectedRows.has(item.id));

        // Validate
        if (selectedRowsData.length === 0) {
            alert("No rows selected for export. Please select at least one row.");
            return;
        }

        const today = new Date().toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }).replace(/\s/g, "-");

        // Generate selected PDF
        generatePDF(selectedRowsData, `selected-sales-overview-${today}.pdf`, "selected");

        // Generate deselected PDF after a small delay to ensure first download starts
        if (deselectedRowsData.length > 0) {
            setTimeout(() => {
                generatePDF(deselectedRowsData, `deselected-sales-overview-${today}.pdf`, "deselected");
            }, 300);
        }
    }, [salesOverview, hiddenRows, selectedRows, selectionOrder, cityFilter, hotelExpiryFilter, statusFilter, generatePDF]);

    // Create columns with edit handler, hide toggle, and select toggle
    const columns = useMemo(() => createColumns(handleEdit, hiddenRows, handleToggleHide, selectedRows, handleToggleSelect), [hiddenRows, handleToggleHide, selectedRows, handleToggleSelect]);

    if (loading) {
        return (
            <div className="container mx-auto py-3 sm:py-4 md:py-6 px-0 sm:px-4">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="container mx-auto py-3 sm:py-4 md:py-6 px-0 sm:px-4">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow-sm border p-4">
                        <h3 className="text-sm font-medium text-gray-500">Total Hotels</h3>
                        <p className="text-2xl font-bold text-gray-800">{salesOverview.length}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border p-4">
                        <h3 className="text-sm font-medium text-gray-500">Total Amount Due</h3>
                        <p className="text-2xl font-bold text-green-600">
                            ₹{totalAmountDueSum !== undefined ? totalAmountDueSum.toLocaleString('en-IN') : 0}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border p-4">
                        <h3 className="text-sm font-medium text-gray-500">Pending</h3>
                        <p className="text-2xl font-bold text-yellow-600">
                            {salesOverview.filter(s => s.totalAmountDue > 0).length}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border p-4">
                        <h3 className="text-sm font-medium text-gray-500">Paid / Advance</h3>
                        <p className="text-2xl font-bold text-blue-600">
                            {salesOverview.filter(s => s.totalAmountDue <= 0).length}
                        </p>
                    </div>
                </div>

                {/* Download PDF Section */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 bg-white rounded-lg shadow-sm border p-4">
                    <div className="text-sm text-gray-600 flex flex-col sm:flex-row gap-2 sm:gap-4">
                        <div>
                            <span className="font-medium">{selectedRows.size}</span> hotels selected for PDF export
                            {selectedRows.size > 0 && (
                                <button
                                    onClick={() => { setSelectedRows(new Set()); setSelectionOrder([]); }}
                                    className="ml-2 text-blue-600 hover:text-blue-800 underline"
                                >
                                    Clear selection
                                </button>
                            )}
                        </div>
                        <div>
                            <span className="font-medium">{hiddenRows.size}</span> hotels hidden from PDF export
                            {hiddenRows.size > 0 && (
                                <button
                                    onClick={() => setHiddenRows(new Set())}
                                    className="ml-2 text-blue-600 hover:text-blue-800 underline"
                                >
                                    Clear hidden
                                </button>
                            )}
                        </div>
                    </div>
                    <Button
                        onClick={handleDownloadBothPDFs}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                        disabled={selectedRows.size === 0}
                    >
                        📥 Download Both PDFs ({selectedRows.size} selected)
                    </Button>
                </div>

                {/* Data Table */}
                <div className="w-full overflow-hidden">
                    <DataTable
                        columns={columns}
                        data={salesOverview}
                        hiddenRows={hiddenRows}
                        selectedRows={selectedRows}
                        onToggleSelect={handleToggleSelect}
                        cityFilter={cityFilter}
                        setCityFilter={setCityFilter}
                        hotelExpiryFilter={hotelExpiryFilter}
                        setHotelExpiryFilter={setHotelExpiryFilter}
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                    />
                </div>
            </div>

            {/* Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px] bg-white z-[100]">
                    <DialogHeader>
                        <DialogTitle className="text-gray-900">Edit Hotel Information</DialogTitle>
                        <DialogDescription className="text-gray-600">
                            Update hotel details for {editingItem?.name}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="hotel-name" className="text-right text-gray-700">
                                Hotel Name
                            </Label>
                            <Input
                                id="hotel-name"
                                value={hotelNameValue}
                                onChange={(e) => setHotelNameValue(e.target.value)}
                                placeholder="Enter hotel name"
                                className="col-span-3 border-gray-300 focus:border-blue-500"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="city" className="text-right text-gray-700">
                                City
                            </Label>
                            <Input
                                id="city"
                                value={cityValue}
                                onChange={(e) => setCityValue(e.target.value)}
                                placeholder="Enter city"
                                className="col-span-3 border-gray-300 focus:border-blue-500"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="hotel-expiry" className="text-right text-gray-700">
                                Hotel Expiry
                            </Label>
                            <Select value={hotelExpiryValue} onValueChange={setHotelExpiryValue}>
                                <SelectTrigger className="col-span-3 border-gray-300">
                                    <SelectValue placeholder="Select hotel expiry status" />
                                </SelectTrigger>
                                <SelectContent className="bg-white rounded-xl border z-[101]">
                                    <SelectItem className="text-gray-900 focus:bg-blue-50 focus:rounded-lg" value="continue">Continue</SelectItem>
                                    <SelectItem className="text-gray-900 focus:bg-blue-50 focus:rounded-lg" value="uncontinue">Uncontinue</SelectItem>
                                    <SelectItem className="text-gray-900 focus:bg-blue-50 focus:rounded-lg" value="not_to_give">Not to Give</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="status" className="text-right text-gray-700">
                                Status
                            </Label>
                            <Input
                                id="status"
                                value={statusValue}
                                onChange={(e) => setStatusValue(e.target.value)}
                                placeholder="Enter status"
                                className="col-span-3 border-gray-300 focus:border-blue-500"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phone-number" className="text-right text-gray-700">
                                WhatsApp No.
                            </Label>
                            <Input
                                id="phone-number"
                                value={phoneNumberValue}
                                onChange={(e) => setPhoneNumberValue(e.target.value)}
                                placeholder="Enter WhatsApp number"
                                type="tel"
                                className="col-span-3 border-gray-300 focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsDialogOpen(false)}
                            disabled={isUpdating}
                            className="border-gray-300 text-gray-700 hover:bg-gray-100"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            onClick={handleSave}
                            disabled={isUpdating}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {isUpdating ? "Saving..." : "Save changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}


export default SalesOverviewList;
