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
                const response: AxiosResponse<{ data: PurchaseInfoType[] }> = await axios.get('http://localhost:1338/getSupplierPurchase');
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
            <div className="container mx-auto py-10">
                <DataTable columns={columns} data={purchaseInfo} />
            </div>
        </>
    )
}


export default PurchaseInfo;