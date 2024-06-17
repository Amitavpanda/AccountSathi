import Link from "next/link";
import PurchaseInfo from "../components/PurchaseInfo";
import { Button } from "@repo/ui/button";
import { BadgePlus } from "lucide-react";



function Purchase() {

    return (
        <>
            <div className="flex flex-col p-20">
                <div className="flex flex-row items-center justify-between">
                    <h1 className="text-black bold-20">Purchase Info</h1>
                    <Link href={`/purchase/addNewPurchase`}>
                        <Button className="w-40 h-15 rounded-md bg-blue-90 text-white rounded-xl">
                            <BadgePlus className="mr-1 h-4 w-5 " /> Add New Supplier
                        </Button>
                    </Link>
                </div>
                <div className="">
                    <PurchaseInfo />
                </div>

            </div>
        </>
    )
}

export default Purchase;