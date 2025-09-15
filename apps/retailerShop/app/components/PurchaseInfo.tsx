"use client"

import { useEffect, useState } from "react";
import {  PurchaseInfoType, columns } from "./PurchaseInfoComponent/columns";
import { DataTable } from "./PurchaseInfoComponent/data-table";
import axios, { AxiosResponse } from "axios";
import { error, info } from "@repo/logs/logs";


 function PurchaseInfo(){
    const [purchaseInfo, setPurchaseInfo] = useState<PurchaseInfoType[]>([]);

    useEffect(() => {

        console.log("I am getting called")
        const fetchPurchaseInfo = async () => {

            try {
                const baseUri = process.env.NEXT_PUBLIC_UI_BASE_URI;
                const response: AxiosResponse<{ data: PurchaseInfoType[] }> = await axios.get(`${baseUri}/getSupplierPurchase`);
                info("the response of purchaseInfo is", response);
                if (response.status == 200) {
                    console.log("the response.data is ", response.data.data);
                    setPurchaseInfo(response.data.data);
                }
            }
            catch (err: any) {
                error("Error in getting the PurchaseInfo", err);
            }


        }

        fetchPurchaseInfo();
    }, [])
    console.log("the PurchaseInfo after successful response from the backend", purchaseInfo);
    return(
        <>
            <div className="container mx-auto py-3 sm:py-4 md:py-6 px-0 sm:px-4">
                <div className="mb-4 sm:mb-6 bg-white rounded-lg shadow-sm border p-4 sm:p-6">
                    <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-2">
                        Purchase Information
                    </h1>
                    <p className="text-sm text-gray-600">Manage your supplier purchases and track outstanding amounts</p>
                </div>
                <div className="w-full overflow-hidden">
                    <DataTable columns={columns} data={purchaseInfo} />
                </div>
            </div>
        </>
    )
}


export default PurchaseInfo;