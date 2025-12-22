import AddNewPurchaseDetailsComponent from "../../../components/AddNewPurchaseDetailsComponent";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@repo/ui/button";

export default async function AddNewPurchasDetails({ params }: any){
    const { id } = await params;
    return(
        <div className="flex flex-col p-3 sm:p-4 md:p-6 lg:p-8 xl:p-20 min-h-screen">
            {/* Header Section */}
            <div className="mb-6 sm:mb-8">
                <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-4 sm:mb-6">
                    <div className="flex items-center gap-4">
                        <Link href={`/purchase/${id}`} className="flex-shrink-0">
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-10 w-10 p-0 rounded-lg border-gray-300 hover:bg-gray-50 transition-colors"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 leading-tight">
                                Add New Purchase Data
                            </h1>
                            <p className="text-sm sm:text-base text-slate-600 mt-1">
                                Add new transaction details for Purchase ID: <span className="font-semibold text-slate-800">{id}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 w-full">
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    <AddNewPurchaseDetailsComponent id={id}/>
                </div>
            </div>
        </div>
    )
}