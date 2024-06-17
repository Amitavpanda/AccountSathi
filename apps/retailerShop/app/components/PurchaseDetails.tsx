"use client"

import router, { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { PurchaseDetailsType, columns } from './PurchaseDetailsComponent/columns';
import axios, { AxiosResponse } from 'axios';
import { error, info } from '@repo/logs/logs';
import { DataTable } from './PurchaseDetailsComponent/data-table';

interface  PurchaseDetailsProps {
    id : any;
}

export default function PurchaseDetails({id} : PurchaseDetailsProps){
    const [purchaseDetails, setPurchaseDetails] = useState<PurchaseDetailsType[]>([]);


    useEffect(() => {

        console.log("I am getting called")
        const fetchPurchaseDetails = async () => {
    
            try {
                const response: AxiosResponse<{ data: PurchaseDetailsType[] }> = await axios.get(`http://localhost:1338/getSupplierPurchaseDetails/${id}`);
                info("the response of purchaseDetails is", response);
                if (response.status == 200) {
                    console.log("the response.data is ", response.data.data);
                    setPurchaseDetails(response.data.data);
                }
            }
            catch (err: any) {
                error("Error in getting the PurchaseDetails", err);
            }
            
    
        }
    
        fetchPurchaseDetails();
    }, [])
    return(
        <>
            <h1>Purchase Details for id : {id}</h1>

            <div className="container mx-auto py-10">
                <DataTable columns={columns} data={purchaseDetails}/>
            </div>
        </>
    )
}