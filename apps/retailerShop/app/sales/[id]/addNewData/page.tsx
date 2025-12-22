import AddNewPurchaseDetailsComponent from "../../../components/AddNewPurchaseDetailsComponent";
import AddNewSalesDetailsComponent from "../../../components/AddNewSalesDetailsComponent";

export default async function AddNewData({ params }: any) {
    const { id } = await params;
    return (
        <div className="flex flex-col p-3 sm:p-4 md:p-6 lg:p-8 xl:p-20 min-h-screen">
            {/* Header Section */}
            <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 leading-tight mb-2">
                    Add New Data
                </h1>
                <p className="text-sm sm:text-base text-slate-600">
                    Add new sales transaction data for ID: <span className="font-semibold text-slate-800">{id}</span>
                </p>
            </div>

            {/* Form Section */}
            <div className="flex-1">
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    <AddNewSalesDetailsComponent id={id} />
                </div>
            </div>
        </div>
    )
}