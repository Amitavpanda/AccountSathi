"use client"


import axios from "axios";
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { infoPerDayMonthSchema } from "../utils/validator";
import { format } from "date-fns"
import { cn } from "../../../../packages/ui/@/lib/utils"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@repo/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/popover"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@repo/ui/calendar"
import { Button } from "@repo/ui/button";
import { columns } from "../components/SalesDetailsComponent/geInfoPerDayMonthComponent/columns";
import { columnsCollection } from "../components/SalesDetailsComponent/getCollectionPerDayMonthComponent/columns";
import { DataTable } from "../components/SalesDetailsComponent/geInfoPerDayMonthComponent/data-table";
import { DataTable as DataTableCollection } from "../components/SalesDetailsComponent/getCollectionPerDayMonthComponent/data-table";



function GetInfoPerDay() {

    const [infoDetails, setInfoDetails] = useState([]);

    const form = useForm<z.infer<typeof infoPerDayMonthSchema>>({
        resolver: zodResolver(infoPerDayMonthSchema),
        defaultValues: {

        },
    })

    async function onSubmit(values: z.infer<typeof infoPerDayMonthSchema>) {
        console.log(" I am getting called after clicking button");
        try {
            const baseUri = process.env.NEXT_PUBLIC_UI_BASE_URI;
            console.log("the  values are ", values);
            const response = await axios.post(`${baseUri}/infoPerDayMonth`, values);
            console.log("the response.data", response.data);
            console.log("the perDayDetails", response.data.perDayData);
            setInfoDetails(response.data.perDayData);


            if (response.status == 200) {
                console.log("data fetched from backend successfully");
                await new Promise(resolve => setTimeout(resolve, 100));
                form.reset();
            }
        }

        catch (err) {
            console.error("error in getting the inforPerDay");
        }
    }

    return (
        <div className="flex flex-col p-3 sm:p-4 md:p-6 lg:p-8 xl:p-20 min-h-screen">
            {/* Header Section */}
            <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 leading-tight mb-2">
                    Info Per Day Month
                </h1>
                <p className="text-sm sm:text-base text-slate-600">
                    View daily information and collections for selected dates
                </p>
            </div>

            {/* Form Section */}
            <div className="mb-6 sm:mb-8">
                <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 md:p-8 shadow-sm">
                    <h2 className="text-lg sm:text-xl font-semibold text-slate-800 mb-4 sm:mb-6">
                        Select Date
                    </h2>

                    <Form {...form} onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel className="text-sm font-medium text-slate-700">Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "h-11 pl-3 text-left font-normal rounded-lg border-gray-300 hover:border-emerald-500 transition-colors bg-white",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "PPP")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0 bg-white border border-gray-200 rounded-lg shadow-lg" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date > new Date() || date < new Date("1900-01-01")
                                                    }
                                                    initialFocus
                                                    className="rounded-lg border border-gray-200 bg-white"
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormDescription className="text-xs text-slate-500">
                                            Select a date to view daily information
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-center pt-4">
                                <Button
                                    type="submit"
                                    className="w-full sm:w-48 h-12 sm:h-11 md:h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 mobile-button touch-target border-0"
                                >
                                    Get Info
                                </Button>
                            </div>
                        </div>
                    </Form>
                </div>
            </div>

            {/* Data Display Sections */}
            {infoDetails && Object.keys(infoDetails).length > 0 && (
                <div className="space-y-6 sm:space-y-8">
                    {/* Purchase Section */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 md:p-8 shadow-sm">
                        <h2 className="text-lg sm:text-xl font-semibold text-slate-800 mb-4 sm:mb-6 text-center">
                            Purchase Information
                        </h2>
                        <p className="text-sm text-slate-600 text-center mb-4">
                            Purchase details for the selected date
                        </p>
                    </div>

                    {/* Sales Section */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 md:p-8 shadow-sm">
                        <h2 className="text-lg sm:text-xl font-semibold text-slate-800 mb-4 sm:mb-6 text-center">
                            Sales Information
                        </h2>

                        {/* Info Subsection */}
                        <div className="mb-6 sm:mb-8">
                            <h3 className="text-base sm:text-lg font-medium text-slate-700 mb-4">
                                Sales Info
                            </h3>
                            <div className="space-y-4">
                                {Object.keys(infoDetails).map((salesInfoId) => (
                                    <div key={salesInfoId} className="space-y-3">
                                        {(infoDetails as any)[salesInfoId].info.length > 0 && (
                                            <h4 className="text-sm sm:text-base font-medium text-slate-800 text-center">
                                                {(infoDetails as any)[salesInfoId].hotelName}
                                            </h4>
                                        )}
                                        {(infoDetails as any)[salesInfoId].info.length > 0 ? (
                                            <div className="overflow-x-auto">
                                                <div className="min-w-full">
                                                    <DataTable columns={columns} data={(infoDetails as any)[salesInfoId].info} id={salesInfoId} />
                                                </div>
                                            </div>
                                        ) : null}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Collection Subsection */}
                        <div>
                            <h3 className="text-base sm:text-lg font-medium text-slate-700 mb-4">
                                Collections
                            </h3>
                            <div className="space-y-4">
                                {Object.keys(infoDetails).map((salesInfoId) => (
                                    <div key={salesInfoId} className="space-y-3">
                                        {(infoDetails as any)[salesInfoId].collectionInfo.length > 0 && (
                                            <h4 className="text-sm sm:text-base font-medium text-slate-800 text-center">
                                                {(infoDetails as any)[salesInfoId].hotelName}
                                            </h4>
                                        )}
                                        {(infoDetails as any)[salesInfoId].collectionInfo.length > 0 ? (
                                            <div className="overflow-x-auto">
                                                <div className="min-w-full">
                                                    <DataTable columns={columnsCollection} data={(infoDetails as any)[salesInfoId].collectionInfo} id={salesInfoId} />
                                                </div>
                                            </div>
                                        ) : null}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}





export default GetInfoPerDay