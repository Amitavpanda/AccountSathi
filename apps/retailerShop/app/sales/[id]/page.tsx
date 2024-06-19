import { Button } from "@repo/ui/button";
import PurchaseDetails from "../../components/PurchaseDetails";
import { BadgePlus } from "lucide-react";
import Link from "next/link";
import SalesDetails from "../../components/SalesDetails";




export default function PurchaseDetailsMain({ params }: any) {
    const { id } = params;
    return (
        <div className="flex flex-col p-20">
            <div className="flex flex-row items-center justify-between">
                <h1 className="text-black bold-20">Sales Details</h1>
                <Link href={`/sales/${id}/addNewData`}>
                    <Button className="w-40 h-15 rounded-md bg-blue-90 text-white rounded-xl">
                        <BadgePlus className="mr-1 h-4 w-5 " /> Add New  Data
                    </Button>
                </Link>
            </div>
            <div className="">
                <SalesDetails id={id} />
            </div>

        </div>
    )
}