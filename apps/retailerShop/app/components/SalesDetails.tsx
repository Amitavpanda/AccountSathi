"use client"

import router, { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { error, info } from '@repo/logs/logs';
import { SalesDetailsType, columns } from './SalesDetailsComponent/columns';
import { DataTable } from './SalesDetailsComponent/data-table';






import Link from 'next/link';
import { Button } from '@repo/ui/button';

interface SalesDetailsProps {
    id: any;
}

export default function SalesDetails({ id }: SalesDetailsProps) {
    const [salesDetails, setSalesDetails] = useState<SalesDetailsType[]>([]);
    // const [hotelName, setHotelName] = 



    useEffect(() => {

        console.log("I am getting called")
        const fetchSalesDetails = async () => {

            try {
                const baseUri = process.env.NEXT_PUBLIC_UI_BASE_URI;
                const response: AxiosResponse<{ data: SalesDetailsType[] }> = await axios.get(`${baseUri}/getSalesDetails/${id}`);
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
    return (
        <>
            <h1>Sales Details for id : {id}</h1>
            <h1>Hotel Name : {}</h1>

            
            <Link href={`/sales/${id}/downloadPDF`}>
                <Button className="w-40 h-15 rounded-md bg-blue-90 text-white rounded-xl">Download PDF</Button>
            </Link>

            <div className="container mx-auto py-10">
                <DataTable columns={columns} data={salesDetails} id={id} />
            </div>
        </>
    )
}