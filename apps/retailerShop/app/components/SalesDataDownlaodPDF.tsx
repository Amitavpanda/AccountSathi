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




import { DataTable } from './SalesDetailsComponent/data-table';


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
import { salesDataDurationSchema } from "../utils/validator"
import { cn } from "../../../../packages/ui/@/lib/utils"
import axios from "axios"
import { useEffect, useState, useRef } from "react"
import { SalesDetailsType, columns } from "./SalesDetailsComponent/columns";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import html2pdf from "html2pdf.js";


interface SalesDataDownloadPDFProps {
    id: string
}

export function SalesDataDownloadPDF({ id }: SalesDataDownloadPDFProps) {
    let finalAmount = 0;
    const [salesDataDuration, setSalesDataDuration] = useState<SalesDetailsType[]>([]);
    const [endDate, setEndDate] = useState<String>("");
    const [startingDate, setStartingDate] = useState<String>("");
    const [hotelName, setHotelName] = useState<String>();
    const [hotelAddress, setHotelAddress] = useState<String>();

    const [BF, setBF] = useState<number>(0);

    const salesDataDurationRef = useRef(null);

    const form = useForm<z.infer<typeof salesDataDurationSchema>>({
        resolver: zodResolver(salesDataDurationSchema),
        defaultValues: {
            salesInfoId: id,
        },
    })


    async function onSubmit(values: z.infer<typeof salesDataDurationSchema>) {

        console.log("I am getting called after");
        try {
            const baseUri = process.env.NEXT_PUBLIC_UI_BASE_URI;
            console.log("form data submitted", values);
            const response = await axios.post(`${baseUri}/getSalesDataDuration`, values);
            console.log("response", response.data);
            setSalesDataDuration(response.data.data);
            setEndDate(response.data.endDateResponse);
            setStartingDate(response.data.startingDateResponse);
            setHotelName(response.data.hotelName.name);
            setHotelAddress(response.data.hotelAddress.address);
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
    console.log("the salesDataDuration", salesDataDuration);
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

            // Programmatic pagination similar to Purchase PDF: create page-sized clones with
            // proper margins (left/right/top/bottom) and render each page separately with html2canvas
            // then append to jsPDF. This keeps layout consistent and avoids html2pdf pagebreak issues.

            const MARGINS_IN = { top: 0.5, bottom: 0.5, left: 0.5, right: 0.5 };
            const A4_IN_HEIGHT = 11.69; // inches
            const A4_IN_WIDTH = 8.27; // inches

            // compute CSS px per inch accurately
            const testDiv = document.createElement('div');
            testDiv.style.width = '1in';
            testDiv.style.position = 'absolute';
            testDiv.style.left = '-9999px';
            document.body.appendChild(testDiv);
            const CSS_PX_PER_IN = testDiv.offsetWidth || 96;
            document.body.removeChild(testDiv);

            const A4_PX_HEIGHT = A4_IN_HEIGHT * CSS_PX_PER_IN;
            const A4_PX_WIDTH = A4_IN_WIDTH * CSS_PX_PER_IN;
            const marginsPx = {
                top: MARGINS_IN.top * CSS_PX_PER_IN,
                bottom: MARGINS_IN.bottom * CSS_PX_PER_IN,
                left: MARGINS_IN.left * CSS_PX_PER_IN,
                right: MARGINS_IN.right * CSS_PX_PER_IN,
            };

            const pageMaxHeightPx = A4_PX_HEIGHT;

            const allChildren = Array.from(element.children) as HTMLElement[];
            const pageContainers: HTMLElement[] = [];

            function createPageContainer() {
                const page = document.createElement('div');
                page.style.width = A4_PX_WIDTH + 'px';
                page.style.boxSizing = 'border-box';
                page.style.paddingTop = `${marginsPx.top}px`;
                page.style.paddingBottom = `${marginsPx.bottom}px`;
                page.style.paddingLeft = `${marginsPx.left}px`;
                page.style.paddingRight = `${marginsPx.right}px`;
                page.style.background = '#ffffff';
                page.style.font = getComputedStyle(element).font || '';
                return page;
            }

            let currentPage = createPageContainer();
            let started = false;

            for (const child of allChildren) {
                const isGroup = child.classList && child.classList.contains('page-break-avoid');

                if (!started && !isGroup) {
                    currentPage.appendChild(child.cloneNode(true));
                    continue;
                }

                started = true;

                if (isGroup) {
                    const clone = child.cloneNode(true) as HTMLElement;
                    currentPage.appendChild(clone);

                    currentPage.style.position = 'absolute';
                    currentPage.style.left = '-9999px';
                    document.body.appendChild(currentPage);
                    const h = currentPage.scrollHeight;
                    document.body.removeChild(currentPage);

                    if (h > pageMaxHeightPx) {
                        currentPage.removeChild(clone);
                        pageContainers.push(currentPage);
                        currentPage = createPageContainer();
                        currentPage.appendChild(clone);

                        currentPage.style.position = 'absolute';
                        currentPage.style.left = '-9999px';
                        document.body.appendChild(currentPage);
                        const h2 = currentPage.scrollHeight;
                        document.body.removeChild(currentPage);
                        if (h2 > pageMaxHeightPx) {
                            pageContainers.push(currentPage);
                            currentPage = createPageContainer();
                        }
                    }
                } else {
                    currentPage.appendChild(child.cloneNode(true));
                }
            }

            if (currentPage.childElementCount > 0) pageContainers.push(currentPage);

            const pdf = new jsPDF({ unit: 'in', format: 'a4', orientation: 'portrait' });
            const pageWidthIn = pdf.internal.pageSize.getWidth();

            for (let i = 0; i < pageContainers.length; i++) {
                const pageEl = pageContainers[i]!;
                pageEl.style.position = 'absolute';
                pageEl.style.left = '-9999px';
                document.body.appendChild(pageEl);

                const canvas = await html2canvas(pageEl, {
                    scale: 2,
                    useCORS: true,
                    allowTaint: true,
                    logging: false,
                    width: pageEl.offsetWidth,
                    height: pageEl.scrollHeight,
                });

                const imgData = canvas.toDataURL('image/jpeg', 0.98);
                const imgProps = pdf.getImageProperties(imgData);
                const imgWidthIn = pageWidthIn;
                const imgHeightIn = (imgProps.height * imgWidthIn) / imgProps.width;

                pdf.addImage(imgData, 'JPEG', 0, 0, imgWidthIn, imgHeightIn);
                if (i < pageContainers.length - 1) pdf.addPage();
                document.body.removeChild(pageEl);
            }

            pdf.save(`${hotelName || 'Sales_Report'}.pdf`);

            // Restore original styles
            element.style.cssText = originalStyles;

        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    }
    return (
        <>

            <div className="p-4 sm:p-6 lg:p-8">

                <h1 className="text-xl sm:text-2xl font-bold text-slate-800 mb-6">Download the data between a specified duration</h1>

                <Form {...form} onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="space-y-6">

                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                <FormField
                                    control={form.control}
                                    name="startingDate"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col w-full">
                                            <FormLabel>Starting Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full h-11 pl-3 text-left font-normal rounded-xl border-gray-300 hover:bg-gray-50",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP")
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50 " />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar className="bg-white text-gray-900 rounded-xl border"
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) =>
                                                            date > new Date() || date < new Date("1900-01-01")
                                                        }
                                                        initialFocus



                                                    />
                                                </PopoverContent>
                                            </Popover>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                <FormField
                                    control={form.control}
                                    name="endDate"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col w-full">
                                            <FormLabel>End Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full h-11 pl-3 text-left font-normal rounded-xl border-gray-300 hover:bg-gray-50",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP")
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50 " />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar className="bg-white text-gray-900 rounded-xl border"
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) =>
                                                            date > new Date() || date < new Date("1900-01-01")
                                                        }
                                                        initialFocus

                                                    />
                                                </PopoverContent>
                                            </Popover>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex justify-center pt-4">
                                <Button type="submit" className="w-full sm:w-48 h-12 sm:h-11 md:h-12 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 mobile-button touch-target border-0">
                                    Get Data
                                </Button>
                            </div>
                        </div>
                </Form>


                {salesDataDuration && (
                    <>

                        <div className="mt-8">
                            <DataTable columns={columns} data={salesDataDuration} id={id} />
                        </div>

                        <div className="mt-8">
                            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6 overflow-x-auto pdf-content" ref={salesDataDurationRef} id="pdfDownload">

                            <h1 className="text-xl sm:text-2xl font-bold leading-tight text-center">{hotelName}</h1>
                            <h1 className="text-sm sm:text-base font-semibold leading-tight text-center -mt-1">{hotelAddress}</h1>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-end gap-2 sm:mr-1 mt-4">

                                {BF !== 0 && (
                                    <>

                                        <h1 className="text-sm font-medium">BF Total Balance</h1>
                                        <h1 className="text-lg font-bold">=</h1>
                                        <h1 className="text-lg font-bold">Rs {BF}</h1>

                                    </>
                                )}
                            </div>

                            {Object.keys(salesDataDuration).map((date: string) => (

                                <div className="flex flex-col page-break-avoid" key={date}>
                                    {date in salesDataDuration && (salesDataDuration as any)[date]?.dateDescription !== "no" && (
                                        <div className="overflow-visible break-inside-avoid mb-2">
                                            <h1 className="underline text-base sm:text-lg font-semibold">{date}</h1>
                                        </div>
                                    )}
                                    {date in salesDataDuration && (salesDataDuration as any)[date]?.info?.map((item: any, index: number) => (

                                        <>
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
                                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 overflow-visible break-inside-avoid w-full sm:w-auto">


                                                    {item.extraAmount > 0 ? (

                                                        <>
                                                            <div className="bg-yellow-50 rounded-lg p-2 w-full sm:w-auto">
                                                                <h1 className="text-sm font-medium">{item.extraAmountDescription}</h1>

                                                            </div>

                                                        </>
                                                    ) : item.cashPaid === "no" ? (
                                                        <>
                                                            <h1 className="text-sm font-medium">{item.stockName}</h1>
                                                            <div className="flex flex-row items-center justify-center gap-2">
                                                                <h1 className="text-sm">{item.quantity} X</h1>
                                                                <h1 className="text-sm"> Rs {item.price} </h1>
                                                            </div>
                                                            {item.isPaymentDone === "Yes" && <>
                                                                <div className="bg-green-50 rounded-lg p-2 w-full sm:w-auto">
                                                                    <h1 className="text-sm font-medium">Payment Done</h1>
                                                                </div>
                                                            </>}

                                                        </>

                                                    ) :

                                                        (

                                                            <div className="bg-green-50 rounded-lg p-2 overflow-visible break-inside-avoid w-full sm:w-auto">
                                                                <h1 className="text-sm font-medium">{item.amountPaidDescription}</h1>
                                                                {/* <div className="flex flex-row item-center justify-center gap-2">
                                                                    <h1 className="font-[700]"> Rs {item.previousAmount} - </h1>
                                                                    <h1>Rs {item.amountPaid}</h1>
                                                                </div> */}

                                                            </div>
                                                        )

                                                    }


                                                </div>
                                                <div className="break-inside-avoid overflow-visible text-right sm:text-left">

                                                    {item.extraAmount > 0 ? (
                                                        <>
                                                            <h1 className="text-base sm:text-lg font-bold"><span className="text-lg sm:text-xl"> + </span> Rs {item.extraAmount}</h1>
                                                        </>
                                                    ) :
                                                        item.cashPaid === "no" ? (
                                                            <>
                                                                {BF === 0 && index === 0 ? (
                                                                    <>
                                                                        <h1 className="text-base sm:text-lg font-semibold">Rs {item.amount}</h1>

                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <h1 className="text-base sm:text-lg font-semibold"> {item.isPaymentDone !== "Yes" && <span className="text-lg sm:text-xl"> + </span>} Rs {item.amount}</h1>

                                                                    </>
                                                                )}

                                                            </>
                                                        )

                                                            : (
                                                                <>
                                                                    <h1 className="text-base sm:text-lg font-semibold"><span className="text-lg sm:text-xl"> - </span> Rs {item.amountPaid}</h1>

                                                                </>

                                                            )}
                                                </div>
                                            </div>
                                        </>

                                    ))}

                                    <hr className="border-gray-300 w-full mt-3 mb-2" style={{ borderWidth: '2px' }} />
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 break-inside-avoid overflow-visible mt-2 pt-2 border-t border-gray-200">
                                        {date in salesDataDuration && ((salesDataDuration as any)[date]?.finalAmount ?? 0) < 0 ? (
                                            <>
                                                <h1 className="bg-yellow-200 rounded-lg p-2 break-inside-avoid overflow-visible text-sm font-medium w-full sm:w-auto">Remaining Advanced Payment</h1>

                                            </>
                                        ) : (
                                            <>
                                                <h1 className="text-sm font-medium"> Balance Total Amount </h1>

                                            </>
                                        )}
                                        <h1 className="text-base sm:text-lg font-bold">Rs {(salesDataDuration as any)[date]?.finalAmount ?? 0}</h1>
                                    </div>
                                </div>
                            ))}
                        </div>
                        </div>
                        <div className="flex justify-center mt-6">
                            <Button onClick={() => handleGeneratePDF()} className="w-full sm:w-48 h-12 sm:h-11 md:h-12 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-sm font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 mobile-button touch-target border-0">
                                Download PDF
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </>
    )
}