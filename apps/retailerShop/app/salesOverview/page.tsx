import SalesOverviewList from "../components/SalesOverviewComponent/SalesOverviewList";

function SalesOverview() {
    return (
        <>
            <div className="flex flex-col p-3 sm:p-4 md:p-6 lg:p-8 xl:p-20 min-h-screen">
                {/* Header Section */}
                <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-4 sm:mb-6">
                    <div>
                        <h1 className="text-black text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
                            Sales Overview
                        </h1>
                        <p className="text-gray-600 text-sm sm:text-base mt-1">
                            View all hotels with their payment status and city information
                        </p>
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 w-full -mx-3 sm:mx-0">
                    <SalesOverviewList />
                </div>
            </div>
        </>
    )
}

export default SalesOverview;
