"use client"

import router, { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { PurchaseDetailsType, columns } from './PurchaseDetailsComponent/columns';
import axios, { AxiosResponse } from 'axios';
import { error, info } from '@repo/logs/logs';
import { DataTable } from './PurchaseDetailsComponent/data-table';
import Link from 'next/link';
import { Button } from '@repo/ui/button';

interface  PurchaseDetailsProps {
    id : any;
}

export default function PurchaseDetails({id} : PurchaseDetailsProps){
    const [purchaseDetails, setPurchaseDetails] = useState<PurchaseDetailsType[]>([]);


    useEffect(() => {

        console.log("I am getting called")
        const fetchPurchaseDetails = async () => {
    
            try {
                const baseUri = process.env.NEXT_PUBLIC_UI_BASE_URI;
                const response: AxiosResponse<{ data: PurchaseDetailsType[] }> = await axios.get(`${baseUri}/getSupplierPurchaseDetails/${id}`);
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

            <Link href={`/purchase/${id}/downloadPDF`}>
                <Button className="w-40 h-15 rounded-md bg-blue-90 text-white rounded-xl">Download PDF</Button>
            </Link>

            <div className="container mx-auto py-10">
                <DataTable columns={columns} data={purchaseDetails}/>
            </div>
        </>
    )
}