import Link from "next/link";
import PurchaseInfo from "../components/PurchaseInfo";
import { Button } from "@repo/ui/button";
import { BadgePlus } from "lucide-react";

function Purchase() {

    return (
        <>
            <div className="flex flex-col p-3 sm:p-4 md:p-6 lg:p-8 xl:p-20 min-h-screen">
                {/* Header Section */}
                <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-4 sm:mb-6">
                    <h1 className="text-black text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
                        Purchase Info
                    </h1>
                    <Link href={`/purchase/addNewPurchase`} className="w-full sm:w-auto">
                        <Button className="w-full sm:w-48 h-12 sm:h-11 md:h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 mobile-button touch-target border-0">
                            <BadgePlus className="h-4 w-4 sm:h-4 sm:w-4" />
                            <span className="sm:hidden">Add New Supplier</span>
                            <span className="hidden sm:inline">Add New Supplier</span>
                        </Button>
                    </Link>
                </div>

                {/* Content Section */}
                <div className="flex-1 w-full -mx-3 sm:mx-0">
                    <PurchaseInfo />
                </div>
            </div>
        </>
    )
}

export default Purchase;