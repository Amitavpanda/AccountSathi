import Link from "next/link";
import { Button } from "@repo/ui/button";
import { BadgePlus } from "lucide-react";
import SalesInfo from "../components/SalesInfo";



function Sales() {

    return (
        <>
            <div className="flex flex-col p-20">
                <div className="flex flex-row items-center justify-between">
                    <h1 className="text-black bold-20">Sales Info</h1>
                    <Link href={`/sales/addNewSales`}>
                        <Button className="w-40 h-15 rounded-md bg-blue-90 text-white rounded-xl">
                            <BadgePlus className="mr-1 h-4 w-5 " /> Add New Hotel
                        </Button>
                    </Link>
                </div>
                <div className="">
                    <SalesInfo />
                </div>

            </div>
        </>
    )
}

export default Sales;