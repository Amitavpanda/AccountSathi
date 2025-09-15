

"use client"

import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import { error, info } from "@repo/logs/logs";
import { SalesInfoType, columns } from "./SalesInfoComponent/columns";
import { DataTable } from "./SalesInfoComponent/data-table";


 function SalesInfo(){
    const [salesInfo, setSalesInfo] = useState<SalesInfoType[]>([]);
    const [totalAmountDueSum, setTotalAmountDueSum] = useState<number | undefined>();

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
    console.log("the SalesInfo after successful response from the backend", salesInfo);
    return(
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
        </>
    )
}


export default SalesInfo;