"use client"

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
    }, [id])
    return (
        <>
            <div className="flex flex-col p-3 sm:p-4 md:p-6 lg:p-8 xl:p-20 min-h-screen">
                {/* Header Section */}
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 leading-tight mb-2">
                        Sales Data
                    </h1>
                    <p className="text-sm sm:text-base text-slate-600">
                        Transaction history and details for ID: <span className="font-semibold text-slate-800">{id}</span>
                    </p>
                </div>

                {/* Action Section */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                        <div className="text-sm sm:text-base text-slate-600">
                            <span className="font-medium">Hotel:</span> {salesDetails.length > 0 ? salesDetails[0]?.hotelName || 'Loading...' : 'Loading...'}
                        </div>
                        <Link href={`/sales/${id}/downloadPDF`}>
                            <Button className="w-full sm:w-48 h-12 sm:h-11 md:h-12 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 mobile-button touch-target border-0">
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span>Download PDF</span>
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Data Table Section */}
                <div className="flex-1">
                    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                        <DataTable columns={columns} data={salesDetails} id={id} />
                    </div>
                </div>
            </div>
        </>
    )
}