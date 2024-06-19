"use client"

import router, { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { error, info } from '@repo/logs/logs';
import { SalesDetailsType, columns } from './SalesDetailsComponent/columns';
import { DataTable } from './SalesDetailsComponent/data-table';

interface  SalesDetailsProps {
    id : any;
}

export default function SalesDetails({id} : SalesDetailsProps){
    const [salesDetails, setSalesDetails] = useState<SalesDetailsType[]>([]);


    useEffect(() => {

        console.log("I am getting called")
        const fetchSalesDetails = async () => {
    
            try {
                const response: AxiosResponse<{ data: SalesDetailsType[] }> = await axios.get(`http://localhost:1338/getSalesDetails/${id}`);
                info("the response of salesDetails is", response);
                if (response.status == 200) {
                    console.log("the response.data is ", response.data.data);
                    setSalesDetails(response.data.data);
                }
            }
            catch (err: any) {
                error("Error in getting the SalesDetails", err);
            }
            
    
        }
    
        fetchSalesDetails();
    }, [])
    return(
        <>
            <h1>Purchase Details for id : {id}</h1>

            <div className="container mx-auto py-10">
                <DataTable columns={columns} data={salesDetails}/>
            </div>
        </>
    )
}