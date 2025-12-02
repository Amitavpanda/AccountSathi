

"use client"

import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { error, info } from "@repo/logs/logs";
import { SalesInfoType, createColumns } from "./SalesInfoComponent/columns";
import { DataTable } from "./SalesInfoComponent/data-table";
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


function SalesInfo() {
    const [salesInfo, setSalesInfo] = useState<SalesInfoType[]>([]);
    const [totalAmountDueSum, setTotalAmountDueSum] = useState<number | undefined>();
    const [editingSalesInfo, setEditingSalesInfo] = useState<SalesInfoType | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [cityValue, setCityValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        console.log("I am getting called")
        const fetchSalesInfo = async () => {
            const baseUri = process.env.NEXT_PUBLIC_UI_BASE_URI;
            try {
                const response = await axios.get(`${baseUri}/getSalesInfo`);
                info("the response of salesInfo is", response);
                if (response.status == 200) {
                    console.log("the response.data is ", response.data.data);
                    setSalesInfo(response.data.data);
                    setTotalAmountDueSum(response.data.totalAmountDueSum);
                }
            }
            catch (err: any) {
                error("Error in getting the SalesInfo", err);
            }
        }

        fetchSalesInfo();
    }, [])

    const handleEdit = (salesInfoItem: SalesInfoType) => {
        setEditingSalesInfo(salesInfoItem);
        setCityValue(salesInfoItem.city || "");
        setIsDialogOpen(true);
    };

    const handleSave = async () => {
        if (!editingSalesInfo) return;

        const baseUri = process.env.NEXT_PUBLIC_UI_BASE_URI;
        try {
            setIsLoading(true);
            const response = await axios.put(`${baseUri}/updateSalesInfo`, {
                id: editingSalesInfo.id,
                city: cityValue,
            });
            info("Update response:", response);
            if (response.status === 200) {
                // Update local state
                setSalesInfo(prev => prev.map(item => 
                    item.id === editingSalesInfo.id 
                        ? { ...item, city: cityValue }
                        : item
                ));
                setIsDialogOpen(false);
                setEditingSalesInfo(null);
            }
        } catch (err: any) {
            error("Error updating SalesInfo:", err);
        } finally {
            setIsLoading(false);
        }
    };

    // Create columns with edit handler
    const columns = useMemo(() => createColumns(handleEdit), []);

    console.log("the SalesInfo after successful response from the backend", salesInfo);
    return (
        <>
            <div className="container mx-auto py-3 sm:py-4 md:py-6 px-0 sm:px-4">
                <div className="mb-4 sm:mb-6 bg-white rounded-lg shadow-sm border p-4 sm:p-6">
                    <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-2">
                        Total Amount Due: <span className="text-green-600 font-bold text-xl sm:text-2xl">Rs {totalAmountDueSum !== undefined ? totalAmountDueSum.toLocaleString() : 0}</span>
                    </h1>
                </div>
                <div className="w-full overflow-hidden">
                    <DataTable columns={columns} data={salesInfo} />
                </div>
            </div>

            {/* Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px] bg-white z-[100]">
                    <DialogHeader>
                        <DialogTitle className="text-gray-900">Edit Hotel Information</DialogTitle>
                        <DialogDescription className="text-gray-600">
                            Update city information for {editingSalesInfo?.name}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="hotel-name" className="text-right text-gray-600">
                                Hotel
                            </Label>
                            <Input
                                id="hotel-name"
                                value={editingSalesInfo?.name || ""}
                                disabled
                                className="col-span-3 bg-gray-100 text-gray-700 border-gray-300"
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
                                placeholder="Enter city name"
                                className="col-span-3 border-gray-300 focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsDialogOpen(false)}
                            disabled={isLoading}
                            className="border-gray-300 text-gray-700 hover:bg-gray-100"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            onClick={handleSave}
                            disabled={isLoading}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {isLoading ? "Saving..." : "Save changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}


export default SalesInfo;