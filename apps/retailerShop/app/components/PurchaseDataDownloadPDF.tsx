"use client"


import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@repo/ui/dialog"

import { format } from "date-fns"

import { Button } from "@repo/ui/button"


import { DataTable } from './PurchaseDetailsComponent/data-table';


import "../globals.css";



import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { z } from "zod"
import { Popover, PopoverContent, PopoverTrigger } from "@repo/ui/popover"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@repo/ui/calendar"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@repo/ui/form"
import { purchaseDataDurationSchema } from "../utils/validator"
import { cn } from "../../../../packages/ui/@/lib/utils"
import axios from "axios"
import { useEffect, useState, useRef } from "react"
import { PurchaseDetailsType, columns } from "./PurchaseDetailsComponent/columns";
import html2canvas from "html2canvas";
import html2pdf from "html2pdf.js";
import jsPDF from "jspdf";


interface PurchaseDataDownloadPDFProps {
    id: string
}

export function PurchaseDataDownloadPDF({ id }: PurchaseDataDownloadPDFProps) {
    let finalAmount = 0;
    const [purchaseDataDuration, setPurchaseDataDuration] = useState<{ [date: string]: { info: PurchaseDetailsType[], dateDescription: string, finalAmount: number } }>({});
    const [endDate, setEndDate] = useState<String>("");
    const [startingDate, setStartingDate] = useState<String>("");
    const [supplierName, setSupplierName] = useState<String>();
    const [supplierAddress, setSupplierAddress] = useState<String>();

    const [BF, setBF] = useState<number>(0);

    const purchaseDataDurationRef = useRef(null);

    const form = useForm<z.infer<typeof purchaseDataDurationSchema>>({
        resolver: zodResolver(purchaseDataDurationSchema),
        defaultValues: {
            purchaseInfoId: id,
        },
    })


    async function onSubmit(values: z.infer<typeof purchaseDataDurationSchema>) {


        try {
            const baseUri = process.env.NEXT_PUBLIC_UI_BASE_URI;
            console.log("form data submitted", values);
            const response = await axios.post(`${baseUri}/getPurchasesDataDuration`, values);
            console.log("response", response.data);
            setPurchaseDataDuration(response.data.data);
            setEndDate(response.data.endDateResponse);
            setStartingDate(response.data.startingDateResponse);
            setSupplierName(response.data.supplierName.nameOfTheSupplier);
            setSupplierAddress(response.data.supplierAddress.address);
            setBF(response.data.BF);

            if (response.status = 200) {
                console.log('Successfully got the data from the backend.');

                await new Promise(resolve => setTimeout(resolve, 1000));
                form.reset();
            }
            else {
                console.error("does not got the data from the backend");
            }

        }

        catch (err) {
            console.error("Error Getting response: ", err);
        }


    }
    console.log("the purchaseDataDuration", purchaseDataDuration);
    const handleGeneratePDF = async () => {
        const element = document.querySelector("#pdfDownload") as HTMLElement;
        if (!element) return;

        try {
            // Temporarily modify styles for PDF generation
            const originalStyles = element.style.cssText;
            element.style.cssText += `
                width: 800px !important;
                min-width: 800px !important;
                max-width: 800px !important;
                white-space: nowrap !important;
                word-wrap: break-word !important;
                overflow-wrap: break-word !important;
            `;

            // Force layout recalculation
            element.offsetHeight;

            const opt = {
                margin: [0.5, 0.5, 0.5, 0.5] as [number, number, number, number], // top, right, bottom, left margins
                filename: `${supplierName || 'Purchase_Report'}.pdf`,
                image: {
                    type: 'jpeg',
                    quality: 0.98
                },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    allowTaint: true,
                    logging: false,
                    dpi: 192,
                    letterRendering: true,
                    width: 800,
                    height: element.scrollHeight,
                    windowWidth: 1200,
                    windowHeight: element.scrollHeight + 200
                },
                jsPDF: {
                    unit: 'in',
                    format: 'a4',
                    orientation: 'portrait',
                    compress: true
                },
                pagebreak: {
                    mode: ['avoid-all', 'css', 'legacy'],
                    before: '.page-break-before',
                    after: '.page-break-after',
                    avoid: '.page-break-avoid'
                }
            };

            // Generate the PDF
            await html2pdf().from(element).set(opt).save();

            // Restore original styles
            element.style.cssText = originalStyles;

        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    }
    return (
        <div className="p-4 sm:p-6 md:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 leading-tight mb-2">
                        Download Purchase Data PDF
                    </h1>
                    <p className="text-sm sm:text-base text-slate-600">
                        Select a date range to generate and download your purchase data PDF report
                    </p>
                </div>

                <Form {...form} onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
                    {/* Date Selection Section */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 md:p-8 shadow-sm">
                        <h2 className="text-lg sm:text-xl font-semibold text-slate-800 mb-4 sm:mb-6">
                            Select Date Range
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            <FormField
                                control={form.control}
                                name="startingDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel className="text-sm font-medium text-slate-700">Starting Date</FormLabel>
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
                                            Select the start date for the report
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="endDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel className="text-sm font-medium text-slate-700">End Date</FormLabel>
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
                                            Select the end date for the report
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex justify-center mt-6">
                            <Button
                                type="submit"
                                className="w-full sm:w-48 h-12 sm:h-11 md:h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 mobile-button touch-target border-0"
                            >
                                Generate Report
                            </Button>
                        </div>
                    </div>
                </Form>


                {purchaseDataDuration && (
                    <>
                        {/* Data Table Section */}
                        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 md:p-8 shadow-sm">
                            <h2 className="text-lg sm:text-xl font-semibold text-slate-800 mb-4 sm:mb-6">
                                Purchase Data Preview
                            </h2>
                            <div className="overflow-x-auto">
                                <DataTable columns={columns} data={Object.values(purchaseDataDuration).flatMap(item => item.info)} />
                            </div>
                        </div>

                        {/* PDF Preview Section */}
                        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 md:p-8 shadow-sm">
                            <h2 className="text-lg sm:text-xl font-semibold text-slate-800 mb-4 sm:mb-6">
                                PDF Preview
                            </h2>

                            <div className="overflow-x-auto">
                                <div className="min-w-[35rem] p-5 bg-white border rounded-xl pdf-content" ref={purchaseDataDurationRef} id="pdfDownload">
                                    <h1 className="text-[24px] font-[700] leading-[120%] text-center">{supplierName}</h1>
                                    <h1 className="text-[16px] font-[700] leading-[120%] text-center -mt-2">{supplierAddress}</h1>

                                    <div className="flex flex-row items-center justify-end gap-2 mr-1">
                                        {BF !== 0 && (
                                            <>
                                                <h1>BF Total Balance</h1>
                                                <h1>=</h1>
                                                <h1>Rs {BF}</h1>
                                            </>
                                        )}
                                    </div>

                                    {Object.keys(purchaseDataDuration).map((date: string) => (
                                        <div className="flex flex-col" key={date}>
                                            {purchaseDataDuration[date]?.dateDescription !== "no" && (
                                                <div className="break-inside-avoid overflow-visible">
                                                    <h1 className="underline">{date}</h1>
                                                </div>
                                            )}
                                            {purchaseDataDuration[date]?.info?.map((item: any, index: number) => (
                                                <div key={index} className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center justify-center gap-4 overflow-visible break-inside-avoid">
                                                        {item.extraAmount > 0 ? (
                                                            <div className="bg-yellow-50 rounded-xl p-2">
                                                                <h1>{item.extraAmountDescription}</h1>
                                                            </div>
                                                        ) : item.cashPaid === "no" ? (
                                                            <>
                                                                <h1>{item.stockName}</h1>
                                                                <div className="flex flex-row items-center justify-center gap-2">
                                                                    <h1>{item.quantity} X</h1>
                                                                    <h1>Rs {item.price}</h1>
                                                                </div>
                                                                {item.isPaymentDone === "Yes" && (
                                                                    <div className="bg-green-50 rounded-xl p-2">
                                                                        <h1>Payment Done</h1>
                                                                    </div>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <div className="bg-green-50 rounded-xl p-2 break-inside-avoid overflow-visible">
                                                                <h1>{item.amountPaidDescription}</h1>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="break-inside-avoid overflow-visible">
                                                        {item.extraAmount > 0 ? (
                                                            <h1><span className="font-[700] text-[20px]"> + </span> Rs {item.extraAmount}</h1>
                                                        ) : item.cashPaid === "no" ? (
                                                            <>
                                                                {BF === 0 && index === 0 ? (
                                                                    <h1>Rs {item.amount}</h1>
                                                                ) : (
                                                                    <h1>{item.isPaymentDone !== "Yes" && <span className="font-[700] text-[20px]"> + </span>} Rs {item.amount}</h1>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <h1><span className="font-[700] text-[20px]"> - </span> Rs {item.amountPaid}</h1>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}

                                            <hr className="text-black-100 w-full mt-2" style={{ borderWidth: '3px' }} />
                                            <div className="flex flex-row items-center justify-between -gap-4 break-inside-avoid overflow-visible">
                                                {(purchaseDataDuration[date]?.finalAmount ?? 0) < 0 ? (
                                                    <h1 className="bg-yellow-200 rounded-xl p-2 break-inside-avoid overflow-visible">Remaining Advanced Payment</h1>
                                                ) : (
                                                    <h1 className="">Balance Total Amount</h1>
                                                )}
                                                <h1>Rs {purchaseDataDuration[date]?.finalAmount}</h1>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center mt-6">
                            <Button
                                onClick={() => handleGeneratePDF()}
                                className="w-full sm:w-48 h-12 sm:h-11 md:h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 mobile-button touch-target border-0"
                            >
                                Download PDF
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}





